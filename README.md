# 🌾 Grainathon '26 — Backend

A production-ready **Node.js / Express** backend for the DJS NSS Grainathon '26 donation drive. It reads donation data live from **Google Sheets** (via a Google service account) and exposes simple REST endpoints for per-day totals, committee totals, grand totals, and the current winners.

---

## ✨ Features

- 📊 **Google Sheets as the data source** — no database needed; volunteers just update a sheet
- 📅 Per-day (Day 1 / 2 / 3) department-wise donation data
- 🧑‍🤝‍🧑 Committee-wise donation data
- 💰 Grand total across all days and committees
- 🏆 Winning department (aggregated across all 3 days) and winning committee
- 🔒 Security hardening with `helmet`, CORS, and request rate limiting
- ⚡ Response compression, structured logging (`winston`), graceful shutdown
- ❤️ Health-check endpoint

---

## 🧱 Tech Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js |
| Framework | Express 4 |
| Data source | Google Sheets API v4 (`googleapis`) |
| Security | `helmet`, `cors`, `express-rate-limit` |
| Logging | `winston` |
| Dev tooling | `nodemon` |

---

## 📁 Project Structure

```
.
├── credentials/                  # 🔐 NOT committed (git-ignored)
│   └── service-account.json      #    Google service account key
├── src/
│   ├── config/
│   │   ├── env.js                # Environment variable loader
│   │   └── sheets.js             # Sheet IDs + ranges per day / committee
│   ├── controllers/
│   │   └── donation.controller.js
│   ├── middleware/
│   │   └── error-handler.js      # Global error handler
│   ├── routes/
│   │   ├── index.js              # Route aggregator + /health
│   │   └── donation.routes.js
│   ├── services/
│   │   ├── donation.service.js   # Parsing + business logic
│   │   └── google-sheets.service.js
│   ├── utils/
│   │   ├── app-error.js
│   │   └── logger.js
│   ├── app.js                    # Express app setup
│   └── server.js                 # Entry point
├── .env.example
├── .gitignore
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** v18 or higher
- **npm**
- A **Google Cloud project** with the Google Sheets API enabled
- The donation Google Sheets (Day 1, Day 2, Day 3, Committee)

### 2. Clone & install

```bash
git clone -b backend https://github.com/djsnss/djsnss-grainathon26.git
cd djsnss-grainathon26
npm install
```

### 3. Set up Google credentials

The backend authenticates to Google Sheets with a **service account**, using a JSON key file stored in the `credentials/` folder.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create (or select) a project.
2. Enable the **Google Sheets API** (APIs & Services → Library).
3. Go to **IAM & Admin → Service Accounts** and create a service account.
4. Open the service account → **Keys → Add key → Create new key → JSON**. A `.json` file will download.
5. Create a `credentials/` folder in the project root and save the file as:

   ```
   credentials/service-account.json
   ```

6. Open the JSON file, copy the `client_email` value (looks like `name@project-id.iam.gserviceaccount.com`), and **share each Google Sheet with that email** as a **Viewer**. The app only requests the read-only Sheets scope.

> ⚠️ **Never commit `credentials/` or any service account key.** The folder is already listed in `.gitignore`. If a key is ever leaked, delete it in Google Cloud Console and generate a new one.

The expected file shape (values are placeholders):

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

### 4. Configure environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port the server listens on | `3000` |
| `NODE_ENV` | `development` or `production` | `development` |
| `GOOGLE_SHEET_DAY1` | Spreadsheet ID for Day 1 | **required** |
| `GOOGLE_SHEET_DAY2` | Spreadsheet ID for Day 2 | **required** |
| `GOOGLE_SHEET_DAY3` | Spreadsheet ID for Day 3 | **required** |
| `GOOGLE_SHEET_COMMITTEE` | Spreadsheet ID for committee data | **required** |
| `GOOGLE_SHEET_RANGE` | Range read from each sheet | `Sheet1!A:Z` |
| `GOOGLE_SERVICE_ACCOUNT_PATH` | Path to the service account JSON | `./credentials/service-account.json` |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window in ms | `900000` (15 min) |
| `RATE_LIMIT_MAX` | Max requests per window per IP | `100` |

> 💡 The **spreadsheet ID** is the long string in the sheet URL:
> `https://docs.google.com/spreadsheets/d/`**`<SPREADSHEET_ID>`**`/edit`

### 5. Run the server

```bash
# Development (auto-reload with nodemon)
npm run dev

# Production
npm start
```

The API is then available at `http://localhost:3000/api`.

---

## 📄 Expected Google Sheet Format

The first row is treated as a header and skipped. Rows with a blank name, a non-numeric amount, or a negative amount are ignored.

**Day sheets (Day 1 / 2 / 3)** — `Department | Amount`

| Department | Amount |
|------------|--------|
| CSE | 5000 |
| IT | 3500 |

**Committee sheet** — `Committee | Amount`

| Committee | Amount |
|-----------|--------|
| Cultural | 6000 |
| Technical | 4500 |

Only columns A and B are read, and data is read from the range set in `GOOGLE_SHEET_RANGE` (default: a tab named `Sheet1`). Make sure your tab name matches, or update the variable.

---

## 🔌 API Reference

Base URL: `http://localhost:3000/api`

### `GET /health`

Health check.

```json
{
  "status": "ok",
  "timestamp": "2026-01-01T10:00:00.000Z",
  "uptime": "123.45s",
  "memoryUsage": "24.10 MB"
}
```

### `GET /day?day=1|2|3`

Department-wise donations for a given day.

```json
{
  "success": true,
  "data": {
    "day": 1,
    "departments": [
      { "department": "CSE", "amount": 5000 },
      { "department": "IT", "amount": 3500 }
    ],
    "total": 8500
  },
  "timestamp": "2026-01-01T10:00:00.000Z"
}
```

Returns `400` if `day` is missing or not 1, 2, or 3.

### `GET /comm`

Committee-wise donations.

```json
{
  "success": true,
  "data": {
    "committees": [
      { "committee": "Cultural", "amount": 6000 },
      { "committee": "Technical", "amount": 4500 }
    ],
    "total": 10500
  },
  "timestamp": "2026-01-01T10:00:00.000Z"
}
```

### `GET /total`

All three days plus committee data, with a grand total.

```json
{
  "success": true,
  "data": {
    "days": [ { "day": 1, "departments": [], "total": 0 }, "..." ],
    "committee": { "committees": [], "total": 0 },
    "grandTotal": 0
  },
  "timestamp": "2026-01-01T10:00:00.000Z"
}
```

### `GET /winning`

Top department (summed across all 3 days) and top committee.

```json
{
  "success": true,
  "data": {
    "department": { "name": "CSE", "amount": 15000 },
    "committee": { "name": "Cultural", "amount": 6000 }
  },
  "timestamp": "2026-01-01T10:00:00.000Z"
}
```

Returns `404` if no department or committee data is available.

### Error format

```json
{
  "status": "fail",
  "statusCode": 400,
  "message": "Invalid or missing 'day' query param. Must be 1, 2, or 3."
}
```

Stack traces are included only when `NODE_ENV=development`.

---

## 🛡️ Security & Operations

- **Helmet** sets secure HTTP headers.
- **CORS** is open (`*`) in development. In production it is restricted to a single origin hardcoded in `src/app.js` (`https://yourdomain.com`), so **update this to your real frontend domain** before deploying.
- **Rate limiting** applies to all `/api` routes (default: 100 requests / 15 min / IP).
- **Request body size** is limited to 10 KB.
- **Logging:** console logs in all environments; in production, logs are also written to `error.log` and `combined.log`.
- **Graceful shutdown** on `SIGTERM` / `SIGINT`, with a forced exit after 10 seconds.

---

## 🧪 Troubleshooting

| Problem | Likely cause / fix |
|---------|--------------------|
| `Environment variable "GOOGLE_SHEET_DAY1" is not set` | `.env` is missing or incomplete. Copy `.env.example` and fill it in. |
| `Google Sheets authentication failed` | `credentials/service-account.json` is missing, misplaced, or invalid JSON. Check `GOOGLE_SERVICE_ACCOUNT_PATH`. |
| `Failed to fetch data from Google Sheets` | The sheet isn't shared with the service account email, the spreadsheet ID is wrong, or the tab name doesn't match `GOOGLE_SHEET_RANGE`. |
| Empty `departments` / `committees` | Sheet has only a header row, or amounts aren't numeric. |
| CORS errors in production | Update the allowed origin in `src/app.js`. |

---

## 🤝 Contributing

1. Fork the repo and create a feature branch from `backend`
2. Make your changes and test locally
3. Open a pull request with a clear description

---

## 📜 License

Add a license here (e.g. MIT) if applicable.

---

Built with ❤️ by **DJS NSS** for Grainathon '26.