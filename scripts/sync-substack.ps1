# ============================================================
# SYNC SUBSTACK POSTS TO THE WEBSITE, ONCE, FROM THIS COMPUTER
#
# Pulls the latest copy of the repository, runs the Substack
# archiver, and if any post is new or was edited on Substack,
# commits it and pushes it. The push starts the deploy workflow
# on GitHub, and the site updates a few minutes later.
#
# Windows Task Scheduler runs this file once a day. To set that
# up, run install-substack-sync.ps1 once. See scripts/README.md.
#
# WHY ON THIS COMPUTER AND NOT ON GITHUB
# Substack refuses requests from data centres, where GitHub's
# machines are. It accepts them from a home internet connection.
#
# No Claude, no API key and no paid service is involved. Only
# Git and Node.js, which are already installed.
#
# Everything it does is written to a log file:
#   %LOCALAPPDATA%\anupamkumar-substack-sync.log
# ============================================================

# ------------------------------------------------------------
# STEP 1 - Settings
# ------------------------------------------------------------

# The repository folder is the one above the folder this script
# is in (this script lives in <repository>\scripts\).
$RepositoryFolder = Split-Path -Parent $PSScriptRoot

# Where the log is written. Outside the repository on purpose, so
# it is never committed by accident.
$LogFile = Join-Path $env:LOCALAPPDATA "anupamkumar-substack-sync.log"

# The only branch this script will ever commit to.
$PublishBranch = "main"

# ------------------------------------------------------------
# STEP 2 - A small helper that writes one line to the log
# ------------------------------------------------------------

function Write-Log {
    param([string]$Message)
    $Stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $Line = "$Stamp  $Message"
    Add-Content -Path $LogFile -Value $Line
    # Write-Host shows the line on screen without making it part of
    # a function's result. (Write-Output would, and then a check
    # like "did this command succeed?" would get the wrong answer.)
    Write-Host $Line
}

# Runs a command, copies everything it prints into the log, and
# returns $true if it succeeded and $false if it failed.
function Invoke-Logged {
    param([string]$Description, [scriptblock]$Command)
    Write-Log "Running: $Description"
    $Output = & $Command 2>&1
    foreach ($Line in $Output) { Write-Log "    $Line" }
    return ($LASTEXITCODE -eq 0)
}

Write-Log "------------------------------------------------------------"
Write-Log "Substack sync started"

# ------------------------------------------------------------
# STEP 3 - Check Git and Node.js can be found
# ------------------------------------------------------------

foreach ($Program in @("git", "node")) {
    if (-not (Get-Command $Program -ErrorAction SilentlyContinue)) {
        Write-Log "STOPPED: '$Program' could not be found. Is it installed?"
        exit 1
    }
}

Set-Location $RepositoryFolder
Write-Log "Repository: $RepositoryFolder"

# ------------------------------------------------------------
# STEP 4 - Only ever work on the main branch
#
# If the repository is on another branch (in the middle of some
# other work), committing there would put the post in the wrong
# place. So the sync is skipped for today and tried again
# tomorrow.
# ------------------------------------------------------------

$CurrentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($CurrentBranch -ne $PublishBranch) {
    Write-Log "SKIPPED: the repository is on branch '$CurrentBranch', not '$PublishBranch'."
    exit 0
}

# ------------------------------------------------------------
# STEP 5 - Get the latest copy from GitHub first
#
# "--ff-only" means: only update if it can be done cleanly. If
# it cannot, nothing is changed and the sync stops, rather than
# Git trying to merge anything on its own.
# ------------------------------------------------------------

if (-not (Invoke-Logged "git pull" { git pull --ff-only })) {
    Write-Log "STOPPED: could not update from GitHub. Nothing was changed."
    exit 1
}

# ------------------------------------------------------------
# STEP 6 - Run the archiver
#
# It never fails on purpose: if Substack cannot be reached it
# says so and writes nothing.
# ------------------------------------------------------------

Invoke-Logged "archiver" { node scripts/archive-substack.mjs } | Out-Null

# ------------------------------------------------------------
# STEP 7 - Did anything change?
#
# Only the content/external folder is looked at. Any other work
# in progress elsewhere in the repository is left untouched.
# ------------------------------------------------------------

$Changes = git status --porcelain --untracked-files=all -- content/external
if (-not $Changes) {
    Write-Log "No new or edited posts. Nothing to publish."
    exit 0
}

# ------------------------------------------------------------
# STEP 8 - Commit and push only the archived posts
#
# The "-- content/external" at the end of the commit means only
# that folder goes into the commit, even if other files have
# been changed or staged.
# ------------------------------------------------------------

if (-not (Invoke-Logged "git add" { git add -- content/external })) {
    Write-Log "STOPPED: git add failed. Nothing was committed."
    exit 1
}

if (-not (Invoke-Logged "git commit" { git commit -m "content: sync Substack posts" -- content/external })) {
    Write-Log "STOPPED: git commit failed. Nothing was pushed."
    exit 1
}

if (-not (Invoke-Logged "git push" { git push })) {
    Write-Log "STOPPED: git push failed. The commit is saved on this computer and will go up with the next push."
    exit 1
}

Write-Log "Published. The site updates in a few minutes."
exit 0
