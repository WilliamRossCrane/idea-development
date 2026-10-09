# Local development

Clone this repository and open the relevant project directory.
Install dependencies separately in each Node project using its committed lockfile.

| Project | Setup and run | Checks |
| --- | --- | --- |
| Chef Quest | Open chef-quest/index.html in a browser | `node --check script.js` from chef-quest |
| Party Games | From party-games: `npm ci`, then `npm run dev` | `npm test` and `npm run build` |
| CardBinder | From cardbinder: `npm ci`, then `npm run dev` | `npm run lint`, `npm test`, `npm run build` |
| PokéOS | Read pokeos/README.md and pokeos/docs | No application to build yet |
| AI Learning Platform | Read ai-learning-platform/README.md | No application to build yet |
| Digital Technologies Library | Read digital-technologies-library/README.md | No application to build yet |

For the Node apps, use Node.js 22 LTS or a later compatible version.
Run Party Games and CardBinder one at a time on their default port, or set a different port:

```bash
cd cardbinder
npm run dev -- --port 3001
```

If credentials are needed, copy that project's .env.example to .env.local and fill in local values.
Keep environment files inside their own project folder. Example files contain configuration guidance.
See each project README for data-provider and database requirements.
