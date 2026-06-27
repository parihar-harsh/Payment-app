# Payment App Frontend

Responsive React client for the Payment App API.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

`VITE_API_URL` must point to the backend `/api/v1` URL. The backend CORS
configuration must include the frontend origin.

Authentication tokens use session storage, so closing the tab ends the local
session. Protected routes redirect unauthenticated visitors to sign in.
