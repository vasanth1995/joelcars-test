# Joel Cars

Used-car showroom website for Joel Cars, Saravanampatti, Coimbatore.
React + Vite, hosted free on GitHub Pages, with Supabase (free) for cars, photos and the admin login.

- Public site: cars, photo gallery (auto-changing, click to pin), EMI calculator, call / WhatsApp buttons, "Happy owners" strip.
- Admin: `#/admin`. Add a car with photos, delete a sold car (its photos are removed too), manage happy-owner photos.

## Run locally
```
npm install
npm run dev
```
Without a `.env` file the site runs in demo mode (admin password `admin123`, data kept in the browser).

## Go live
1. Create a free Supabase project and run `supabase/schema.sql` in its SQL Editor.
2. Add an admin user under Authentication → Users, and turn **off** "Allow new users to sign up".
3. Add repository **variables** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Settings → Secrets and variables → Actions → Variables).
4. Settings → Pages → Source: **GitHub Actions**. Every push to `main` redeploys.

Business details (phone, address, hours, trust points, EMI defaults) live in `src/config.js`.
Never commit the Supabase `service_role` / secret key.
