# Migration verification

The migration was checked with Node.js 24.19.0 and npm 11.9.0.

| Check | Result |
| --- | --- |
| Five repository imports | Project tree hashes exactly match their original main-branch trees |
| Original histories | All five source heads are ancestors of the migrated main branch; 44 original commits preserved |
| CardBinder retrieval | All eight original commit hashes, trees and file hashes reproduced exactly |
| Party Games import | Every file byte matches version 9 of the source archive |
| Chef Quest | JavaScript syntax check passed |
| Party Games | Clean dependency install, 31 tests and production build passed |
| CardBinder | Clean dependency install, TypeScript check, 44 tests and production build passed |
| Git integrity | Object integrity and whitespace checks passed |

App source files and lockfiles were imported without edits. Generated dependencies and build output are ignored.
The planning-only projects have no runnable application to test.

These checks verify file preservation and the existing automated checks. No live database,
external provider credentials, deployment reconnection or production browser session was tested.

Use `git log --first-parent --oneline` to review the 13 migration/setup commits in order.
