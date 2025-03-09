# Wallet UI - Financial Asset Management Interface

This project is a Vue 3 based web interface that connects to the Wallet API. It allows users to manage their financial assets (bank accounts, stocks, cryptocurrencies, etc.).

## Features

-   User authentication (login/registration)
-   Dashboard with overview
-   Account management (bank accounts, investment accounts, crypto wallets, etc.)
-   Asset management (stocks, cryptocurrencies, gold, etc.)
-   Transaction recording and tracking
-   Asset allocation and performance charts
-   Responsive design

## Technologies

-   Vue 3 (Composition API)
-   Vue Router
-   Pinia (State management)
-   Axios
-   Chart.js
-   Tailwind CSS

## Installation

### Requirements

-   Node.js (v14+)
-   NPM or Yarn

### Steps

1.  Install dependencies:

    ```bash
    cd ui
    npm install
    # or
    yarn install
    ```

2.  Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

3.  Open your browser and go to http://localhost:5173.

The API server must be running on http://localhost:8080.

## Structure

```
ui/
├── public/            # Static files
├── src/
│   ├── assets/        # CSS, images, etc.
│   │   ├── charts/    # Visualization components
│   │   ├── forms/     # Form components
│   │   └── layout/    # Layout components (header, footer, etc.)
│   ├── router/        # Vue Router configuration
│   ├── services/      # API connections
│   ├── stores/        # Pinia state management
│   ├── views/         # Page components
│   │   ├── auth/      # Authentication pages
│   │   ├── accounts/  # Account management pages
│   │   ├── assets/    # Asset management pages
│   │   └── transactions/ # Transaction pages
│   ├── App.vue        # Root component
│   └── main.js        # Application entry point
├── index.html         # Main HTML file
├── package.json       # Project dependencies and scripts
└── vite.config.js     # Vite configuration
```

## API Requests

The application forwards API requests to the Backend server using the Vite dev server's proxy settings. This configuration prevents CORS issues and simplifies the development process.

API requests follow these patterns:

-   `/api/v1/auth/*` - Authentication operations
-   `/api/v1/accounts/*` - Account management
-   `/api/v1/assets/*` - Asset management
-   `/api/v1/transactions/*` - Transaction management

## Building the Application

To build the application for production:

```bash
npm run build
# or
yarn build
```

This command compiles the project into the `/dist` folder. The files in this folder can be deployed to any static file server.

## Running with Docker

The `docker-compose.yml` file in the main project is configured to run the API and UI together. The application can be run with Docker as follows:

```bash
docker-compose up --build
```