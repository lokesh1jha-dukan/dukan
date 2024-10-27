# Dukaan - E-commerce Application

**Dukaan** is a fully-featured e-commerce platform built with [Next.js](https://nextjs.org/), utilizing [Prisma](https://www.prisma.io/) as the ORM and [PostgreSQL](https://www.postgresql.org/) as the database. It provides a scalable and efficient system for managing products, orders, payments, and user data.

## Features

- **Next.js**: Server-side rendering for faster page loads and better SEO.
- **Prisma ORM**: Simplified database management with a type-safe client.
- **PostgreSQL**: Robust relational database for storing all app data.
- **Stripe Integration**: Secure payments with Stripe.
- **Admin Dashboard**: Manage products, orders, and inventory.
- **Cart and Checkout System**: Full shopping cart functionality with order management.

## Getting Started

### Prerequisites

Before running the application, ensure you have the following installed:

- **Node.js** (v14 or later)
- **PostgreSQL** (v12 or later)
- **Prisma CLI**

### Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/dukaan.git
    ```

2. Navigate into the project directory:

    ```bash
    cd dukaan
    ```

3. Install the dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

4. Create a `.env` file in the root of the project and add your PostgreSQL database URL and other environment variables:

    ```bash
    DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DB_NAME
    ```

5. Run Prisma migrations to set up the database schema:

    ```bash
    npx prisma migrate dev
    ```

6. Start the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    ```

7. Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

### Database Management

- Run Prisma Studio to manage your database visually:

    ```bash
    npx prisma studio
    ```

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

