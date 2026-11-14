# ============================================================
# SET UP THE DAILY SUBSTACK SYNC - RUN THIS ONCE
#
# Creates a task in Windows Task Scheduler that runs
# sync-substack.ps1 every day at 10:30. Running this file a
# second time replaces the task, so it is safe to repeat.
#
# How to run it, from the repository folder in a terminal:
#   powershell -ExecutionPolicy Bypass -File scripts\install-substack-sync.ps1
#
# To remove the task later:
#   Unregister-ScheduledTask -TaskName "anupamkumar.org Substack sync" -Confirm:$false
# ============================================================

# ------------------------------------------------------------
# STEP 1 - Settings
# ------------------------------------------------------------

# The name the task has in Task Scheduler.
$TaskName = "anupamkumar.org Substack sync"

# The time of day it runs, on this computer's clock.
$RunAt = "10:30"

# The sync script, which sits next to this file.
$SyncScript = Join-Path $PSScriptRoot "sync-substack.ps1"
$RepositoryFolder = Split-Path -Parent $PSScriptRoot

# ------------------------------------------------------------
# STEP 2 - Describe the task
# ------------------------------------------------------------

# WHAT it runs. "-ExecutionPolicy Bypass" lets Windows run this
# one script without changing any security setting on the
# computer. "-WindowStyle Hidden" keeps the window out of sight.
$Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$SyncScript`"" `
    -WorkingDirectory $RepositoryFolder

# WHEN it runs: every day at the time above.
$Trigger = New-ScheduledTaskTrigger -Daily -At $RunAt

# HOW it runs:
#   -StartWhenAvailable  if the computer was off at 10:30, run as
#                        soon as it is next on, instead of
#                        waiting for tomorrow.
#   -ExecutionTimeLimit  give up after 10 minutes if stuck.
#   the battery options  still run on a laptop that is unplugged.
$Settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10) `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries

# ------------------------------------------------------------
# STEP 3 - Create (or replace) the task
#
# It runs as you, only while you are signed in to Windows. That
# is what lets "git push" use your saved GitHub sign-in.
# ------------------------------------------------------------

Register-ScheduledTask `
    -TaskName $TaskName `
    -Description "Copies new and edited Substack posts into the anupamkumar.org repository and publishes them." `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -Force | Out-Null

Write-Output ""
Write-Output "Done. The task '$TaskName' will run every day at $RunAt."
Write-Output "To run it right now as a test:"
Write-Output "    Start-ScheduledTask -TaskName `"$TaskName`""
Write-Output "To read what it did:"
Write-Output "    Get-Content `"$env:LOCALAPPDATA\anupamkumar-substack-sync.log`" -Tail 20"
