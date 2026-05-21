# TS F1 Rating
A web app for Formula 1 fans to rate drivers and race weekends throughout the season.

## What it does
At the start of a race session, users can rate the 22 drivers on the grid. Ratings close 2 days after the race finishes. Users can also leave short positive or negative comments on drivers, and rate the race weekend itself.
The app tracks stats across the season — season averages, last 3 and last 5 race averages, and best single-round rating per driver.

## Tech stack
- **Frontend** — Next.js (App Router), TypeScript
- **Database** — Supabase (Postgres)
- **Auth** — Supabase Auth with Google OAuth
- **Data sync** — Supabase Edge Function (Deno) on hourly cron, pulling from the [OpenF1 API](https://openf1.org)
- **Hosting** — Vercel

## Known improvements

- **Testing** — no test coverage currently, planned but deprioritised given the hobby project scope. Would add unit tests for Edge Function logic using Deno's built-in test runner
- **Styling** — CSS variables are inconsistently used and the Tailwind theme needs a proper pass to establish a consistent design system
- **Mobile** — the app is currently not mobile compatible
- **Comments** — currently shows a default "fan" label instead of the actual username, and the data related to each driver currently have no realtime connection
