# Game Night Hub

Seven party games in one shared room. Players join from their phones using a six-character code or QR invite. The host runs the night from a phone while a separate public screen shows the game on a TV. Keep the same players when you switch games.

## Quick party setup

1. Create a room on the host phone, then share the invite link or six-character code with friends.
2. Open **TV screen** from the room header on a laptop or TV browser (`/screen/ROOMCODE`). Cast that tab to the TV if needed. The TV shows the join QR, timer, question and scores; host controls and private answers stay on phones.
3. After two players join, tap **Start Quick Party** for Trivia → Who’s Most Likely? → Would You Rather?, five rounds each and 15-second timers. It starts in one tap; at results, **Next game** starts the next preset game directly. For other games, open **Choose a game or customise** to make your own playlist of up to three games and adjust timers, prompts or decks. Trivia also supports 10, 20 or 30 rounds.
4. Rounds automatically move to reveal when everyone has answered or passed. The reveal stays up until the host taps **Next round**; a shared three-second cue appears before the next question and its timer starts. The host's main button is **Reveal / Next**; pause, add 10 seconds, skip, undo and end are under **More controls**. During Bluff It voting, the host can hide an inappropriate bluff.
5. Friends who join mid-game start answering on the next round. Between games, the host can use **Next** on the playlist or pick another game. The same room code still works.

Under **Room controls**, the host can copy a **private host-phone link** to open the controller on another device. Keep this link and the recovery code private. Regular invite links and the TV QR code contain neither credential.

**Simple Mode** starts on for each phone and can be toggled from the room header. It keeps one clear instruction above the question, larger answer buttons, a visible **Pass this round** button and the scoreboard off the phone during answering. Players can change a selected answer or replace a pass until the timer ends. Passing never subtracts points. The preference is saved in that browser.

On the TV, scoring games announce the correct answer at reveal, show each player's pick beneath the choices, and display a short result callout. Votes appear only after reveal. Adult games show totals without naming who picked which option. These details come from the existing room update; the reveal needs no extra request or service.

## Games

| Game | How it works |
| --- | --- |
| Trivia Night | 502 original/curated questions in four decks. Private multiple-choice answers, timed rounds, double points and a scoreboard. |
| Who's Most Likely? | Vote privately for a player. Optionally let one player write each prompt before everyone votes; writers rotate each round. A built-in prompt appears if the writer passes or time runs out. |
| Bluff It | Submit fake answers, choose among anonymous answers, score for correct guesses and for fooling others. |
| Hot Seat | One player secretly chooses an answer; everyone else guesses it. The spotlight rotates each round. |
| Would You Rather? | Two choices, private votes and a result split. Choose the regular party deck or the optional Crazy NSFW 18+ deck with 30 original prompts. |
| The Wheel | The host enters 2–12 distinct options, spins from their phone, and everyone sees the same pick on their phone and TV. Repeat spins or edit the options during play without leaving the room. |
| After Dark | Adult optional group votes, mild/messy/unhinged prompt decks and an optional truth prompt for the most-voted player. |

After Dark and the Crazy NSFW Would You Rather deck require every player to confirm they are 18+ and opt in before play. After Dark players can select `Just play`, `Sip if I choose`, or `Smoke if I choose`. Consuming anything is always optional.

The host can add up to 20 custom friend prompts per game/deck in the lobby. Custom prompts stay in that room and can be removed there. They join the rotation with the built-in question bank. The NSFW Would You Rather deck has its own separate custom prompt list.

## Deploy to Vercel

1. Put this folder in a **new GitHub repository**. Commit `package-lock.json`, but exclude `node_modules`, `.next`, and `.env` files.
2. In Vercel, select **Add New → Project**, import the repository and use the detected Next.js settings.
3. In your Vercel project, add **Neon Postgres** through Storage / Marketplace and connect it to the **Production** environment. Ensure the project has a `DATABASE_URL` environment variable. Alternatively, supply the connection string of an existing Neon database.
4. Redeploy after connecting the database. The server creates its `trivia_rooms` table automatically on the first request; there is no separate migration.
5. Open the Vercel address, create a room, and share its QR code or link. Open the separate TV screen from the room header on a laptop, then use **Chrome → Cast → Cast tab** if you use Chromecast. Phones open the normal room link and play individually.

**Keep the host recovery code private.** It is shown under **Room controls** on the host device. A joined player can use it to take over if the host device is lost. The host can also transfer control directly to any joined player. Your name/icon and room token are saved in that browser so a reload reconnects you. Rooms expire after 24 hours; scores and the question/prompt rotation last for rematches in that room.

## Run locally

Requires Node.js 20.9+. Local development works without a database; rooms are held in memory until the dev server restarts.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` on the same computer. With `DATABASE_URL` set in `.env.local`, local development uses Neon instead. A Vercel deployment always needs Neon; the memory preview is development-only. Phones need to reach the deployed Vercel URL or the laptop's accessible LAN address; `localhost` on a phone points to the phone.

```bash
npm test
npm run build
```

## Structure

- `app/`: home page, responsive phone room and public TV screen, API route handlers and styles.
- `lib/public.mjs`: browser-safe game list, icons and settings.
- `lib/party-content.mjs` and `lib/after-dark-would-rather.mjs`: prompts and bluff topics, loaded only on the server.
- `app/wheel.jsx`: shared phone and TV wheel display.
- `lib/questions.mjs`: compiled trivia bank, loaded only on the server.
- `lib/game.mjs`: room, round, timing, voting and scoring logic.
- `lib/store.mjs`: Neon persistence with version-based concurrent update protection.
- `scripts/build_questions.py`: regenerate the question bank from `lib/*.json` and `scripts/extra_questions.txt`.

This is a room-code party game with no accounts. Anyone with a room link can view the game, but cannot answer without joining. A host recovery code grants host control, so do not share it publicly. Adding long-term profiles, seasons or public matchmaking would need a proper account system and additional moderation.
