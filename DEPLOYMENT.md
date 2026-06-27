# Deploy Payflow from GitHub

This repository is configured for:

- MongoDB Atlas: database
- Render: Express API
- Vercel: React/Vite frontend

The GitHub repository is `parihar-harsh/Payment-app` and the current deployment
branch is `master`.

## 1. Push the finished project to GitHub

From the repository root:

```bash
git add .
git commit -m "Harden backend and complete frontend"
git push origin master
```

Do not commit either `.env` file. Only `.env.example` files should be pushed.

## 2. Create the MongoDB Atlas database

1. Create an Atlas project and a cluster.
2. Open **Database Access** and create a database user. Use a generated password.
3. Open **Network Access** and allow the Render service to connect:
   - For a hobby deployment, `0.0.0.0/0` is the simplest option. The database
     still requires its username/password and TLS, but this is a broad network
     rule.
   - For stricter production access, use Render dedicated outbound IPs and add
     only those IPs to Atlas.
4. Select **Connect → Drivers → Node.js** and copy the SRV connection string.
5. Add the database name before the query string:

```text
mongodb+srv://APP_USER:URL_ENCODED_PASSWORD@cluster.example.mongodb.net/payflow?retryWrites=true&w=majority
```

If the password contains characters such as `@`, `:`, `/`, or `#`, URL-encode
the password before putting it in the URI.

## 3. Deploy the backend on Render

1. Sign in to Render using GitHub.
2. Select **New → Blueprint**.
3. Connect `parihar-harsh/Payment-app`.
4. Render detects the root `render.yaml`.
5. When prompted, enter:
   - `MONGODB_URI`: the Atlas SRV URI from step 2.
   - `CORS_ORIGINS`: initially use `http://localhost:5173`; replace it with the
     Vercel URL after step 4.
6. Create the Blueprint and wait for the health check to pass.
7. Copy the API URL, for example:

```text
https://payflow-api.onrender.com
```

Verify:

```text
https://payflow-api.onrender.com/health
```

It should return `"status": "ok"`.

Render generates `JWT_SECRET` automatically. Do not manually expose or copy it
into the frontend.

## 4. Deploy the frontend on Vercel

1. Sign in to Vercel using GitHub.
2. Select **Add New → Project** and import `parihar-harsh/Payment-app`.
3. Set **Root Directory** to `frontend`.
4. Vercel should detect Vite. Confirm:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add this environment variable for Production:

```text
VITE_API_URL=https://payflow-api.onrender.com/api/v1
```

6. Deploy and copy the permanent production URL, for example:

```text
https://payment-app-example.vercel.app
```

The included `frontend/vercel.json` enables React Router deep links such as
`/signin`, `/dashboard`, and `/send`.

## 5. Connect frontend and backend

Return to the Render service:

1. Open **Environment**.
2. Change `CORS_ORIGINS` to the exact Vercel production origin:

```text
https://payment-app-example.vercel.app
```

3. Save the environment change and let Render redeploy.
4. Open the Vercel site and create two accounts to test a transfer.

For multiple permitted sites, use a comma-separated value:

```text
https://app.example.com,https://payment-app-example.vercel.app
```

Do not add a trailing slash to an origin.

## Automatic deployments

After setup, pushing to GitHub deploys both applications automatically:

```bash
git add .
git commit -m "Describe the change"
git push origin master
```

Render rebuilds changes under `backend/`. Vercel rebuilds the frontend project.

## Production notes

- This is a demonstration wallet. `SIGNUP_BONUS=10000` creates simulated funds.
  Set it to `0` if you do not want demo balances.
- Render free web services can sleep when idle, causing a slow first request.
- Add every stable frontend origin to `CORS_ORIGINS`.
- Never put `MONGODB_URI` or `JWT_SECRET` in GitHub or Vercel frontend variables.
- Use a custom domain and paid/static outbound IP options before treating this
  as more than a portfolio or learning application.

Official references:

- [MongoDB Atlas connection requirements](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/)
- [Render monorepo deployment](https://render.com/docs/monorepo-support)
- [Render health checks](https://render.com/docs/health-checks)
- [Vercel Vite deployment](https://vercel.com/docs/frameworks/frontend/vite)
