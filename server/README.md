Cartify v2 - E-commerce Backend

This is the backend system for Cartify v2, built with Node.js, Express, and MongoDB.

🚀 Key Features

    User Authentication: Secure registration and login.

    Order Management: User order placement and tracking.

    Product Catalog: Full CRUD functionality for products and categories.

    Admin Dashboard: Advanced controls for user management and sales reporting.

📋 API Documentation


1. Authentication

    Register a new user:
    POST http://localhost:3000/register

    Login to your account:
    POST http://localhost:3000/login

2. Public Store (For Customers)

    See all products:
    GET http://localhost:3000/api/products

    See all categories:
    GET http://localhost:3000/api/categories

3. Order Management (For Customers)

    Place a new order:
    POST http://localhost:3000/orders/

    See your order history:
    GET http://localhost:3000/orders/:userId

4. Favorites

    Toggle a product as favorite:
    PUT http://localhost:3000/api/:productId/favorite

5. Admin Controls (Protected)

These require the user to be logged in as an Admin.

    Add a new product:
    POST http://localhost:3000/admin/product

    Update a product:
    PUT http://localhost:3000/admin/product/:id

    Delete a product:
    DELETE http://localhost:3000/admin/product/:id

    Get list of all users:
    GET http://localhost:3000/admin/users

    Get sales data for graph:
    GET http://localhost:3000/admin/sales-graph

    Approve or Reject an order:
    PUT http://localhost:3000/admin/orders/:id/status

⚙️ Installation

    Clone the repository: git clone <your-repository-url>

    Navigate to folder: cd server

    Install dependencies: npm install

    Run the server: npm run dev