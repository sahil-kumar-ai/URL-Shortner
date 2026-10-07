# URL Shortener

A full-stack URL shortener that converts long links into short, shareable URLs and tracks click counts.

This project combines a React frontend with an Express + MongoDB backend to create and manage shortened links.

## Features

- Shorten long URLs into compact codes
- View all created short links
- Copy or open generated links from the UI
- Delete links from the workspace
- Track basic click counts per shortened URL
- Redirect short URLs back to their original destinations

## Tech Stack

- Frontend: React + Vite
- Styling: Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## Project Structure

```text
Url-Shortner/
├── client/                # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/                # Express API
│   ├── src/
│   ├── package.json
│   └── .env.example
└── README.md
```

## Prerequisites

Before running the app, make sure you have:

- Node.js 18+ installed
- MongoDB running locally or a valid MongoDB connection URL
- npm installed

## Installation

1. Clone the repository
2. Install frontend dependencies:

```bash
cd client
npm install
```

3. Install backend dependencies:

```bash
cd ../server
npm install
```

## Environment Setup

Create a `.env` file inside the `server` folder with the following values:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/url-shortner
```

If you are using a different MongoDB instance, replace the `MONGO_URI` value accordingly.

## Running the App

Start the backend server:

```bash
cd server
npm run dev
```

Start the frontend app in a second terminal:

```bash
cd client
npm run dev
```

Then open:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## API Endpoints

### Create short URL

```http
POST /api/url/create
Content-Type: application/json
```

Request body:

```json
{
  "url": "https://example.com"
}
```

### Get all URLs

```http
GET /api/url/
```

### Delete a URL

```http
DELETE /api/url/delete/:id
```

### Redirect short URL

```http
GET /:code
```

Example:

```text
GET /abc123
```

This will redirect the browser to the original URL associated with `abc123`.

## Notes

- The frontend proxy is configured to forward `/api` requests to the backend server.
- The app validates that URLs start with `http://` or `https://` and enforces a maximum length of 2048 characters.
- Short codes are generated server-side and stored in MongoDB.

## License

This project is for learning and demonstration purposes.
