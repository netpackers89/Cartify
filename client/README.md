Cartify Frontend

Cartify is a modern, responsive e-commerce storefront. This application manages user authentication, product browsing, a shopping cart, order tracking, and a dedicated administrative suite for back-end management.
📂 Project Structure

The project is organized to separate shared components, administrative features, and user-facing pages:
Plaintext

client/src/
├── components/          # Reusable global UI components
│   ├── Footer.jsx/css
│   ├── Hero.jsx/css
│   ├── Navbar.jsx/css
│   ├── OrderReceipt.jsx/css
│   └── ProtectedAdminRoute.jsx
├── pages/               # Application page views
│   ├── Admin/           # Administrative dashboard modules
│   │   ├── Categories/
│   │   ├── components/
│   │   ├── Dashboard/
│   │   ├── Products/
│   │   ├── Sales/
│   │   ├── Users/
│   │   └── index.js     # Module exports
│   ├── Auth/            # Login and Sign-up modules
│   └── User/            # Customer-facing views (Home, Cart, Products, etc.)
├── App.jsx              # Main routing configuration
├── App.css              # Global application styles
└── main.jsx             # React entry point

🚀 Key Features

    Modular Architecture: Organized by page type (Admin vs. User vs. Auth) for maintainable code.

    Administrative Suite: Dedicated directory for managing categories, products, sales, and users.

    Customer Experience: Fully implemented user-facing features including product details, cart management, and order tracking.

    Secured Routing: Includes ProtectedAdminRoute to ensure administrative components are only accessible to authorized users.

🛠 Tech Stack

    Framework: React

    Routing: React Router DOM

    Styling: CSS Modules/Standard CSS files for component-level styling.

📦 Getting Started

    Clone the repository.

    Install dependencies:
    Bash

    npm install

    Environment Setup: Ensure your local development environment is configured to connect to your backend API.

    Launch the application:
    Bash

    npm run dev