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
- `GET /api/v1/account/transactions` returns paginated transfer history.

Errors use this shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed"
  }
}
```
