# Deploying individual projects

Each app can be deployed separately from this repository.
Set the deployment project's root directory to the corresponding folder.

| App | Root directory | Configuration |
| --- | --- | --- |
| Chef Quest | chef-quest | Static HTML/CSS/JavaScript; no build command |
| Party Games | party-games | Next.js; npm ci and npm run build; production DATABASE_URL required |
| CardBinder | cardbinder | Next.js; npm ci and npm run build; provider keys remain server-side |

Keep separate hosting projects, URLs and environment variables for each app.
The migration does not reconnect, redeploy or remove existing deployments.
Planning-only projects have no application to deploy yet.

When reconnecting a deployment, select WilliamRossCrane/idea-development and its app folder.
Review its existing environment variables, build settings and domain before publishing.
