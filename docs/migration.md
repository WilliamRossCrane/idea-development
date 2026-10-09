# Migration record

Five repositories were imported from their main branches using merge commits.
The original commits, authors, messages and hashes remain reachable in this repository.
Each import commit places the source tree inside its project folder without changing its bytes.
Before an import, historical commits retain the original repository's root paths.

Party Games was imported from version 9 of Trivia-Night-Live-Vercel.zip.
The archive had no Git history; its import is the start of its history here.

Exact source heads, tree hashes and import commits are recorded in migration-sources.json.
Original repositories remain available. Existing deployments still use those sources until explicitly reconnected.

## Review progression

Use `git log --first-parent --oneline` to follow the migration and setup commits.
Use `git log --graph --all --oneline` to inspect the preserved source histories.
