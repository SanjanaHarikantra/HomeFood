# Dabba Wala Backend

Node.js + Express + MongoDB backend for the customer-only Dabba Wala app.

## 1) Setup

1. Copy env file:

```bash
cp .env.example .env
```

2. Update `.env` with your MongoDB URI and database name if needed.

3. Install packages:

```bash
npm install
```

4. Run backend:

```bash
npm run dev
```
Server starts on `http://localhost:5000` by default.

## 2) API Base URL

`http://localhost:5000/api`

## 3) Endpoints

### Health
- `GET /health`

### Auth
- `POST /auth/send-otp`
  - body: `{ "phone": "9876543210" }`
- `POST /auth/verify-otp`
  - body: `{ "phone": "9876543210", "otp": "1234" }`

### Meals
- `GET /meals?search=&category=`
- `GET /meals/:id`

### Home Chefs
- `GET /home-chefs?search=&veg=&nonVeg=&healthy=&tiffin=&budget=`
- `GET /home-chefs/:chefId`
- `GET /home-chefs/:chefId/menu`
- `GET /home-chefs/:chefId/reviews`
- `POST /home-chefs/:chefId/reviews`
- `POST /home-chefs/:chefId/orders?userId=123`

### Offers and Coupons
- `GET /offers/coupons`

### Subscription Plans
- `GET /subscriptions/plans`

### User Addresses
- `GET /users/:userId/addresses`
- `POST /users/:userId/addresses`
- `DELETE /users/:userId/addresses/:addressId`

### User Orders
- `GET /users/:userId/orders`
- `POST /users/:userId/orders`
- `GET /users/:userId/orders/:orderId/tracking`
- `PATCH /users/:userId/orders/:orderId/status`

Order payload:

```json
{
  "items": [
    { "mealId": 1, "quantity": 2 },
    { "mealId": 3, "quantity": 1 }
  ],
  "addressId": 1,
  "paymentMethod": "UPI",
  "couponCode": "SWIGGY10"
}
```

### User Subscriptions
- `GET /users/:userId/subscriptions`
- `POST /users/:userId/subscriptions`

### Wallet and Gold
- `GET /users/:userId/wallet`
- `POST /users/:userId/wallet/add-money`
- `POST /users/:userId/wallet/redeem-gold`

### Payments
- `POST /payments/create`
- `POST /payments/confirm`

### Referral Rewards
- `POST /users/:userId/offers/referral`

## 4) Homemade Food Module

The new customer module supports:

- OTP login
- nearby home chef discovery
- chef profiles and menus
- add to cart and checkout
- homemade order placement
- live order tracking
- reviews and ratings
- subscription preview support for daily, weekly, and monthly tiffins

The backend uses MongoDB collections for:

- `users`
- `home_chefs`
- `chef_menu_items`
- `chef_reviews`
- `orders`
- `order_items`
- `order_tracking_events`
- `delivery_assignments`
- `subscription_plans`
- `user_subscriptions`
- `subscription_orders`
- `payment_transactions`

## 5) Notes

- OTP is a demo OTP (`1234`) for local development.
- Token is a simple dev token placeholder. You can replace this with JWT later.
- Foreign keys and transactions are included for order placement flow.
