# Grind Rank Tracker

A clean black-and-green calisthenics rank tracker inspired by starter bodyweight training videos like YellowDude's "How to start calisthenics when you're miserable." It tracks whether you completed the right workout tasks, calculates a score, assigns a rank tier, and stores progress locally in the browser.

## Features

- Rank tiers: Wood, Bronze, Silver, Gold, Platinum, Diamond, Emerald, Master
- Daily workout checklist
- Automatic scoring based on completed exercises
- Progress bar and current rank card
- Streak and total sessions completed
- Local browser saving with `localStorage`
- Clean black/green UI
- Ready for GitHub + Vercel

## How to run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## How to deploy on Vercel

1. Create a GitHub repo.
2. Upload all files in this folder.
3. Go to Vercel and choose **New Project**.
4. Import your GitHub repo.
5. Keep the default Next.js settings.
6. Click **Deploy**.

## How to customize

Edit `app/page.jsx`:

- Change the `WORKOUT_TASKS` array to adjust exercises.
- Change the `RANKS` array to adjust rank names or score requirements.
