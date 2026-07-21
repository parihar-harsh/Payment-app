# Payment App Backend

## Requirements

- Node.js 20 or newer
- MongoDB replica set or MongoDB Atlas

Money transfers and user/account creation use MongoDB transactions. A standalone
MongoDB server is intentionally rejected at startup because it cannot guarantee
atomic transfers.

## Setup

```bash
cp .env.example .env
npm install
npm start
```

Generate a strong JWT secret instead of using the example value. The frontend
origin must be present in `CORS_ORIGINS`. `SIGNUP_BONUS` is intended only for
demo environments; omit it in production so new accounts start at zero.

## Demo accounts

For a deployed demo where clients need ready-made wallets to test debit/credit
through the normal transfer flow, enable:

```bash
SEED_DEMO_ACCOUNTS=true
DEMO_ACCOUNT_PASSWORD=DemoPass123!
DEMO_SENDER_BALANCE=10000
DEMO_RECEIVER_BALANCE=1000
```

The API will ensure these users exist at startup:

```txt
demo.sender@example.com / DemoPass123!
demo.receiver@example.com / DemoPass123!
```

The sender starts with more balance so users can sign in as the sender, search
for "Demo Receiver", and transfer money through the real transaction endpoint.
Use these only for demo environments because the credentials are intentionally
public.

To seed manually instead of on every startup:

```bash
npm run seed:demo
```

For local MongoDB, initialize a single-node replica set and use a URI containing
`replicaSet=rs0`. `REQUIRE_TRANSACTIONS=false` is only suitable for development
that does not exercise signup or transfer operations.

For MongoDB Atlas, use the `mongodb+srv://` driver connection string as
`MONGODB_URI`. Atlas already provides the transaction-capable deployment this
API requires. See the repository root `DEPLOYMENT.md` for the GitHub-based
Render and Vercel workflow.

## API behavior

- All account endpoints require `Authorization: Bearer <token>`.
- User search now requires authentication and does not expose email addresses.
- Transfer amounts must be positive whole INR values.
- JWTs expire after the configured `JWT_EXPIRES_IN` duration.
- `GET /health` reports API/database readiness.
- `GET /api/v1/account/transactions` returns cursor-paginated transfer history.

Errors use this shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed"
  }
}
```
