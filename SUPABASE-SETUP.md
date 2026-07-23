# Connect CNG CAFE to Supabase

1. In Supabase, revoke the secret key that was shared in chat and create a replacement. Do not place a secret key in this website or GitHub repository.
2. Open the Supabase SQL Editor and run the full contents of `supabase-setup.sql`.
3. In **Authentication → Users**, create the owner email and password you want to use for the CNG admin page.
4. In the SQL Editor, run the commented `insert into public.cafe_admins ...` command at the bottom of `supabase-setup.sql`, replacing `YOUR_ADMIN_EMAIL` with that owner email.
5. Deploy every file in this `outputs` folder to GitHub Pages, including `supabase-config.js`.
6. Open `https://cngcafe.fun/admin/`, sign in with the owner email/password, change the menu, and click **Save changes**.

Customers will receive the latest menu whenever they open or refresh the public site. The website uses the publishable Supabase key only; Row Level Security prevents public visitors from editing the menu.
