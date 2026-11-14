# scripts/

Utilities for the whole repository. This README covers the Substack sync. The other scripts
explain themselves in the comments at the top of each file.

| File | What it is |
|---|---|
| `archive-substack.mjs` | Reads the Substack feed and writes new or edited posts into `content/external/`. |
| `sync-substack.ps1` | Runs the archiver, then commits and pushes anything that changed. |
| `install-substack-sync.ps1` | Run once. Makes Windows run `sync-substack.ps1` every day. |
| `check-accessibility.mjs` | The accessibility check (`npm run check-a11y`). |
| `rehype-wrap-tables.mjs` | Wraps tables so they scroll inside their own box on a phone. |
| `relock.mjs` | Rebuilds `package-lock.json` (`npm run relock`). |

---

## The daily Substack sync

### What this does

Once a day, your own computer checks the Substack feed. A new post is copied into
`content/external/` as a Markdown file. If a post you already have was edited on Substack,
its file is rewritten to match. Anything that changed is committed and pushed, and the site
updates a few minutes later.

It runs on your computer and not on GitHub because Substack refuses requests from data
centres, which is where GitHub's machines are. No Claude, no API key and no paid service is
involved. It uses only Git and Node.js.

### How to set it up (once)

1. Open the repository folder in VS Code.
2. Open a terminal: **Terminal → New Terminal**.
3. Run this command. It creates the daily task in Windows Task Scheduler:

   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\install-substack-sync.ps1
   ```

   You should see `Done. The task 'anupamkumar.org Substack sync' will run every day at 10:30.`

   If it says **Access is denied**, close VS Code, open it again by right-clicking it and
   choosing **Run as administrator**, then run the same command again.

4. Test it now instead of waiting until tomorrow:

   ```powershell
   Start-ScheduledTask -TaskName "anupamkumar.org Substack sync"
   ```

   This prints nothing. Wait about 30 seconds, then read what it did:

   ```powershell
   Get-Content "$env:LOCALAPPDATA\anupamkumar-substack-sync.log" -Tail 20
   ```

   The last line should be `No new or edited posts. Nothing to publish.` or
   `Published. The site updates in a few minutes.` Anything starting with `STOPPED` says what
   went wrong.

### How to run it by hand

Exactly the same as the daily run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\sync-substack.ps1
```

Or only the archiver, without committing anything: `npm run archive-substack`.

### What it reads and what it writes

- **Reads:** `https://asranupam.substack.com/feed`, plus the existing files in
  `content/external/`, `content/essays/` and `content/notes/`.
- **Writes:** files in `content/external/` only, one commit called
  `content: sync Substack posts`, and the log at
  `%LOCALAPPDATA%\anupamkumar-substack-sync.log`.

### Dependencies

Git and Node.js, both already installed (CLAUDE.md §2). Windows PowerShell comes with
Windows. Your GitHub sign-in must be saved, which it already is if `git push` works in the
VS Code terminal without asking for a password.

### How to change the common things

- **The time it runs:** change `$RunAt = "10:30"` near the top of
  `install-substack-sync.ps1`, then run the install command again. It replaces the old task.
- **Stop it for good:**

  ```powershell
  Unregister-ScheduledTask -TaskName "anupamkumar.org Substack sync" -Confirm:$false
  ```

- **See or pause it with the mouse:** open **Task Scheduler** from the Start menu, then
  **Task Scheduler Library**, and find `anupamkumar.org Substack sync`.

### Rules the archiver follows

- **A post is matched by its Substack address**, the `substackUrl` line in each file. So a
  post whose title changed on Substack updates its existing file. It does not get a second one.
- **The filename never changes**, even when the title does, because the filename decides the
  post's address on this site and a published address must never break (CLAUDE.md rule 8).
- **A post that is also an essay or a note here is skipped.** If a file in `content/essays/`
  or `content/notes/` has the same `substackUrl`, the archiver leaves that post alone. This
  covers pieces written here first and cross-posted, and archived posts you moved across by
  hand.
- **Files in `content/external/` will be overwritten** whenever the post on Substack differs.
  Correct a post on Substack, never in its file here.

### Known limitations

- **It only runs when the computer is on and you are signed in to Windows.** If the computer
  was off at 10:30, it runs as soon as it is next on.
- **The feed only lists recent posts.** An edit to a very old post that has dropped out of
  the feed will not be picked up. [Not checked: how many posts Substack keeps in the feed.]
- **A post deleted on Substack stays on the site.** That is deliberate: this repository is
  the archive.
- **It skips the day if the repository is on a branch other than `main`**, so it never
  commits into unfinished work. The log says so.
- **The first run after this change rewrites the two existing archived posts once**, because
  the note at the top of each file was reworded.
- **A small window may flash up briefly** when the task starts.
- **`sync-substack.ps1` was not test-run before it was committed**, because PowerShell was not
  available where it was written. The archiver it calls was tested against a sample feed.
  Run step 4 above once and read the log.

**Last updated:** 14 November 2026
