# LOYAH App

Next.js app with personalized AI.

## Setup
1. npm install
2. copy .env.example to .env.local and add keys
3. npm run dev

## Supabase tables needed:
- analyses (id, user_id, input, pattern, advice, created_at)
- profiles (user_id, style, goal)

AI uses personalized prompts based on attachment style and goal.
