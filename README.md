# Client Requests Dashboard

An internal dashboard for tracking client requests through a simple status pipeline: New, In Progress, Done.

Full-stack TypeScript: React frontend, Express and MongoDB backend.


## Tech Stack

**Client:** React 18, Vite, TypeScript, React Router v6, Axios, Tailwind CSS v4

**Server:** Node.js, Express 5, TypeScript, MongoDB with Mongoose 9, Zod, JWT, bcryptjs

## Project Structure

```text
task1/
├── client/
│   └── src/
│       ├── api/           # Axios instance and endpoint modules
│       ├── components/    # UI components
│       ├── context/       # AuthContext
│       ├── hooks/         # useAuth, useRequests
│       ├── pages/         # Login, Register, Dashboard
│       ├── types/
│       └── utils/
└── server/
    └── src/
        ├── config/        # Env parsing, DB connection
        ├── controllers/   # HTTP handlers
        ├── middleware/    # Auth, validation, error handling
        ├── models/        # Mongoose schemas
        ├── routes/
        ├── services/      # Business logic and DB access
        ├── types/
        ├── utils/         # ApiError, ApiResponse, asyncHandler, jwt
        └── validators/    # Zod schemas
```

Controllers handle HTTP concerns only. Services own business logic and database access; nothing outside `services/` touches Mongoose, and nothing inside it touches `req` or `res`.

## API

All routes are prefixed with `/api/v1`.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Create an account, returns `{ user, token }` |
| POST | `/auth/login` | No | Authenticate, returns `{ user, token }` |
| GET | `/auth/me` | Yes | Get the current user |
| GET | `/requests` | Yes | List the current user's requests |
| POST | `/requests` | Yes | Create a request |
| PATCH | `/requests/:id/status` | Yes | Update a request's status |

Success response:

```json
{ "success": true, "message": "...", "data": {} }
```

Error response (`errors` is present only for validation failures):

```json
{ "success": false, "message": "...", "errors": [{ "path": "email", "message": "Invalid email" }] }
```

## Getting Started

**Prerequisites:** Node.js 18+, npm, and a MongoDB instance (local or Atlas).

### Server

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

| Variable | Description | Example |
| --- | --- | --- |
| `NODE_ENV` | Toggles logging and error stack traces | `development` |
| `PORT` | HTTP port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/client-requests` |
| `JWT_SECRET` | Token signing secret (32+ characters) | |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:5173` |

Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Client

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_URL` | Backend base URL | `http://localhost:5000/api/v1` |

The app is served at http://localhost:5173.

### Reviewer Access

A dedicated Atlas database is available for evaluation. Set `MONGODB_URI` in `server/.env` to the connection string provided in the submission notes. The user has access to a test database only and will be removed after review.

## Scripts

| Location | Command | Description |
| --- | --- | --- |
| server | `npm run dev` | Start the dev server with `tsx watch` |
| server | `npm run build` | Compile TypeScript to `dist/` |
| server | `npm run serve` | Run the compiled build |
| client | `npm run dev` | Start the Vite dev server |
| client | `npm run build` | Create a production build |
| client | `npm run preview` | Preview the production build |

## Design Decisions

- **Separate `app.ts` and `server.ts`.** The Express app can be imported without binding a port, which simplifies integration testing and serverless deployment.
- **Per-user scoping.** Every request is filtered by `createdBy` at the query level, so users can only read and update their own data.
- **Optimistic updates.** The UI applies status changes immediately, reconciles with the server response, and rolls back on failure.
- **Axios interceptors.** The token is attached automatically, and a 401 clears the session and redirects to login.
- **Zod as the source of truth.** Service input types are inferred from the schemas, keeping validation and types in sync.
- **Centralized error handling.** `asyncHandler` forwards rejected promises to one middleware that maps `ApiError`, Zod, Mongoose, and duplicate-key errors to a consistent response.

## Out of Scope

- **Logout endpoint.** Auth is stateless JWT, so logout is handled client-side by discarding the token. Revocation would require a blacklist store or refresh-token flow.
- **Refresh tokens.** Access tokens expire after 7 days, which is acceptable for an internal tool.
- **Rate limiting, production request logging, HTTPS.** These belong at the infrastructure layer (reverse proxy or gateway).

## License

MIT
