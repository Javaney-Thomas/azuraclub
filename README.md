````markdown
# Azura Project

Azura is a full-stack marketplace application that is divided into two main parts:

- **azura-api**: The backend API built with Node.js, Express, GraphQL, MongoDB, and Mongoose.
- **azura-client**: The frontend built with Next.js, React, Apollo Client, and TailwindCSS.

This document provides comprehensive setup instructions for both the backend and frontend.

---

## Features

### Backend (azura-api)

- GraphQL API with Apollo Server
- Authentication (JWT-based)
- Product, Order, and User management
- Cloudinary integration for image uploads
- Stripe integration for payments
- Admin dashboard for analytics
- Comprehensive test coverage with Jest

### Frontend (azura-client)

- Next.js-based server-side rendering
- Apollo Client for GraphQL integration
- Authentication with JWT
- Product listing and search
- Shopping cart and checkout with Stripe
- Admin dashboard for analytics

---

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/azura.git
cd azura
```
````

### 2. Setup the Backend (azura-api)

```sh
cd azura-api
```

#### Install dependencies

```sh
npm install
```

#### Setup environment variables

Create a `.env` file in the `azura-api` directory and add the following:

```env
MONGO_URI=mongodb://localhost:27017/azura
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

#### Start the development server

```sh
npm run dev
```

#### Running tests

```sh
npm run test
```

#### Load sample data into MongoDB

```sh
mongoimport --uri mongodb://localhost:27017/azura --collection products --file seed/products.json --jsonArray
mongoimport --uri mongodb://localhost:27017/azura --collection users --file seed/users.json --jsonArray
```

---

### 3. Setup the Frontend (azura-client)

```sh
cd ../azura-client
```

#### Install dependencies

```sh
npm install
```

#### Setup environment variables

Create a `.env.local` file in the `azura-client` directory and add the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

#### Start the frontend server

```sh
npm run dev
```

---

## Folder Structure

```
azura/
│
├── azura-api/ (Backend)
│   ├── src/
│   │   ├── models/ (Mongoose schemas)
│   │   ├── resolvers/ (GraphQL resolvers)
│   │   ├── schemas/ (GraphQL schemas)
│   │   ├── utils/ (Utility functions)
│   │   ├── middlewares/ (Express middlewares)
│   │   ├── config/ (Configuration files)
│   │   ├── app.ts (Express app setup)
│   │   ├── index.ts (Server entry point)
│   ├── tests/ (Jest test cases)
│   ├── package.json
│   ├── .env
│
├── azura-client/ (Frontend)
│   ├── pages/ (Next.js pages)
│   ├── components/ (Reusable UI components)
│   ├── styles/ (Global styles)
│   ├── utils/ (Helper functions)
│   ├── apollo/ (GraphQL Apollo Client setup)
│   ├── public/ (Static assets)
│   ├── package.json
│   ├── .env.local
│
├── seed/ (Sample MongoDB data)
│   ├── products.json
│   ├── users.json
│
├── README.md
```

---

## API Endpoints

### Authentication

- `signup(email, password)`: Register a new user
- `login(email, password)`: Authenticate a user and return JWT token

### Products

- `getProducts(page, limit, search)`: Fetch paginated product list
- `getProduct(id)`: Get details of a single product

### Orders

- `createOrder(userId, cartItems)`: Place an order
- `getOrders(userId)`: Get order history

### Admin

- `getDashboardMetrics`: Get admin analytics
- `updateUserRole(userId, role)`: Change user role

---

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes and commit (`git commit -m 'Added feature'`).
4. Push to your branch (`git push origin feature-name`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License.

```

```
