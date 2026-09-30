# Shop Banh Keo

A full-stack confectionery e-commerce project for browsing products, placing orders, and managing shop operations. The repository includes a React Native mobile app, a web-based admin interface, and a Node.js/Express backend with MySQL support.

## Overview

Shop Banh Keo provides:

- Product listing and product details
- Category browsing
- Shopping cart and order placement
- Order history
- Admin dashboard and order management
- Product and inventory management
- Import order management
- Admin authentication

## Tech Stack

- **Mobile app:** React Native, Expo, Expo Router, TypeScript
- **Web app:** HTML, CSS, and JavaScript
- **Backend:** Node.js and Express
- **Database:** MySQL
- **API documentation:** Swagger

## Project Structure

```text
shop-banh-keo/
├── mobile-app/          # Expo mobile application
│   ├── app/             # Screens and file-based routes
│   ├── components/      # Reusable mobile UI components
│   ├── context/         # Application state and context
│   ├── services/        # API and service logic
│   ├── types/           # TypeScript types
│   └── package.json
├── web-app/             # Web interface
│   ├── admin/            # Admin dashboard pages
│   ├── components/      # Reusable web components
│   └── layout/           # Web layouts
├── server/              # Express backend
│   ├── config/           # Database configuration
│   ├── controllers/      # Business logic
│   ├── routes/           # API route definitions
│   ├── index.js          # Backend entry point
│   ├── swagger.js        # Swagger configuration
│   └── package.json
└── README.md
```

## API Endpoints

The backend runs under the `/api` prefix.

### Products

```text
GET /api/products
GET /api/products/:id
```

### Categories

```text
GET /api/categories
```

### Orders

```text
POST /api/orders
GET /api/orders
GET /api/orders/:id/items
```

### Authentication

```text
POST /api/auth/login
```

### Administration

```text
GET    /api/admin/dashboard
PUT    /api/admin/orders/:id/status
POST   /api/admin/imports
GET    /api/admin/imports
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
GET    /api/admin/brands
```

## Prerequisites

Install the following before running the project:

- Node.js (LTS recommended)
- npm
- MySQL
- Expo Go or an Android/iOS development environment for the mobile app
- A modern web browser

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/PhuongDao1409/shop-banh-keo.git
cd shop-banh-keo
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure the database

Update the MySQL connection settings in:

```text
server/config/db.js
```

Make sure the database exists and contains the tables required by the application.

### 4. Start the backend

```bash
cd server
node index.js
```

The backend starts on:

```text
http://localhost:5000
```

### 5. Start the mobile app

Open a new terminal and run:

```bash
cd mobile-app
npm install
npx expo start
```

You can then open the app using Expo Go, an Android emulator, an iOS simulator, or Expo web support.

### 6. Run the web app

The web interface is located in `web-app`. To serve it locally with Python:

```bash
cd web-app
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/admin
```

You can also open the HTML files in `web-app/admin` directly in a browser.

## Swagger Documentation

Swagger configuration is located at:

```text
server/swagger.js
```

Review or extend this file when documenting backend endpoints.

## Production Considerations

Before deploying this project to production:

- Store database credentials in environment variables
- Protect all admin endpoints with authentication and authorization
- Validate and sanitize request data
- Enable HTTPS
- Add structured logging and error handling
- Configure CORS for trusted origins only
- Add automated tests and database migrations

## Contributing

Contributions are welcome. When making changes, keep the responsibilities separated between:

- `mobile-app` for the customer mobile experience
- `web-app` for the browser-based interface
- `server` for APIs and business logic

## License

This repository does not currently include a license. Add a license file if you plan to distribute the project publicly.
