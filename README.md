# PayGuard System

PayGuard is a very simple payment and document management system with user and admin dashboards.

## Links

[PayGuard System Live](https://payguard-system.netlify.app/)

[Backend Codebase](https://github.com/hkeva/payguard-server).

## Features

### Admin Dashboard

- **Login**: Admin can log in using the credentials below.
- **Admin Features**:
  - View and filter payment, document, and user lists.
  - Update payment/document status (this triggers an email to the user).
  - Download payment invoices.

#### Admin Login

- **Email**: `humayraeva@gmail.com`
- **Password**: `12345678`

### User Dashboard

- **Register**: Users need to register first.
- **Login**: Users need to verify their email before logging in.
- **User Features**:
  - Create new payments.
    (_Note: Since Stripe is in test mode, please use valid test card information provided by [Stripe's Test Card Info](https://docs.stripe.com/testing)._)
  - Create new documents.
  - View a list of their created payments and documents.

## Technologies Used

- **Supabase** for authentication.
- **Stripe** for payment integration.
- **RTK Query** for API integration.
- **Ant Design (antd)** for UI components.
- **Tailwind CSS** for styling.

### Environment Variables

```bash
VITE_API_BASE_URL=<Your API Base URL>
VITE_SUPABASE_URL=<Your Supabase Project URL>
VITE_SUPABASE_ANON_KEY=<Your Supabase Anon Key>
VITE_STRIPE_PUBLISHABLE_KEY=<Your Stripe Publishable Key>

```

### Run project

```bash
yarn or npm install
yarn dev or npm run dev

```
