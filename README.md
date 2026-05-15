# Bombay Dabba Wala App

## Working of the Application

### Step 1: Open the Application

When the user opens the Bombay Dabba Wala App, the first screen displayed is the Welcome Page followed by the Login Page.

The user can choose one of the following options:

- Login
- Register New Account
- Continue as Customer
- Continue as Admin

This is the starting point of the application.

---

### Step 2: User Login / Registration

If the user is already registered, they enter:

- Email ID / Mobile Number
- Password

and click on Login.

If the user is new, they click on Register and fill:

- Full Name
- Mobile Number
- Email ID
- Password
- Address
- User Type

After successful registration, the user enters the application dashboard.

---

### Step 3: Role-Based Access

The app works differently depending on the selected role:

#### Customer

For users who want to order food.

#### Home Chef

For users who want to sell homemade food.

#### Admin

For managing the complete platform.

This creates a proper system structure.

---

## Customer Side Working

### Step 4: Browse Food and Home Chefs

The customer dashboard displays:

- Nearby Home Chefs
- Restaurants
- Daily Tiffin Services
- Lunch Subscription Plans
- Dinner Plans
- Offers and Discounts

The customer can search based on:

- Food type
- Area
- Veg / Non-Veg
- Price
- Ratings
- Delivery time

This helps customers find suitable meals quickly.

### Step 5: View Food Details

When the customer selects a food item, the app shows:

- Food Image
- Food Name
- Price
- Description
- Chef Name
- Delivery Time
- Subscription Availability
- Customer Ratings

The customer then clicks Add to Cart.

### Step 6: Cart and Checkout

The cart page shows:

- Selected food items
- Quantity
- Total amount
- Delivery charges
- Payment summary

Customer clicks Proceed to Checkout.

### Step 7: Address and Payment

Customer enters:

- Delivery Address
- Preferred Delivery Time
- Payment Method

Payment methods include:

- UPI
- Debit/Credit Card
- Cash on Delivery
- Wallet Payment

Then customer clicks Place Order.

### Step 8: Order Sent to Backend

The Node.js backend:

- stores order in MySQL
- sends notification to Home Chef
- creates delivery request using Porter API

This is the main backend process.

---

## Home Chef Side Working

### Step 9: Home Chef Receives Order

The Home Chef dashboard shows:

New Order Received

with details:

- Customer Name
- Ordered Items
- Delivery Time
- Delivery Address

Chef can:

- Accept Order
- Reject Order

After accepting, food preparation starts.

### Step 10: Food Preparation

Chef prepares the food and clicks:

Food Ready

This triggers Porter pickup request automatically.

This is where delivery starts.

---

## Porter Delivery Side Working

### Step 11: Delivery Partner Assignment

The system sends:

- Pickup Address = Home Chef Location
- Drop Address = Customer Address
- Package Type = Food Delivery

to Porter.

Porter assigns:

- Delivery Partner Name
- Phone Number
- Tracking Link

This information is saved in the database.

### Step 12: Live Delivery Tracking

Customer can track:

- Order Confirmed
- Chef Accepted
- Food Prepared
- Delivery Partner Assigned
- Picked Up
- Out for Delivery
- Delivered

This improves customer trust.

---

## Admin Side Working

### Step 13: Admin Monitoring

Admin dashboard manages:

- Home Chef verification
- Customer support
- Order monitoring
- Payment reports
- Delivery status
- Complaint handling

Admin ensures smooth platform operation.

---

## Final Delivery Process

### Step 14: Successful Delivery

After the delivery partner completes delivery:

- Order Status = Completed
- Payment Status = Paid
- Customer Feedback Requested
- Rating Submitted

The full order process ends here.

---

## Simple App Flow

Open App  
-> Login / Register  
-> Select Role  
-> Customer Orders Food  
-> Home Chef Accepts  
-> Food Prepared  
-> Porter Pickup  
-> Live Tracking  
-> Delivery Completed  
-> Feedback and Rating

---

## Real Example

Rahul opens the app  
-> Orders Veg Lunch from nearby Home Chef  
-> Chef accepts the order  
-> Chef prepares food  
-> Porter rider picks up the tiffin  
-> Rahul tracks delivery live  
-> Food delivered to office  
-> Payment completed

This is how the Bombay Dabba Wala App works in real-time.

---

## Conclusion

The Bombay Dabba Wala App combines food ordering, home chef management, subscription tiffin services, and Porter delivery integration into one smart platform.

It works like a real startup-level food delivery system and provides a strong real-world final year project solution.

---

## Order Homemade Food Module

The new customer-side flow adds a dedicated entry point called `Continue as Order Homemade Food`.

### Customer Flow

1. OTP-based login
2. Nearby home chef discovery
3. Filter by veg, non-veg, healthy, tiffin, and budget
4. Chef profile with menu, ratings, images, and reviews
5. Add to cart
6. Checkout with address, delivery slot, and payment method
7. Order placement
8. Live tracking through `Placed -> Accepted -> Preparing -> Out for Delivery -> Delivered`
9. Ratings and reviews after delivery
10. Subscription previews for daily, weekly, and monthly tiffins

### Frontend Folder Structure

- `frontend/src/pages/OrderHomemadeFood.tsx` - complete customer ordering flow
- `frontend/src/pages/Login.tsx` - OTP login with the new homemade-food CTA
- `frontend/src/pages/RoleSelect.tsx` - landing/role selection screen
- `frontend/src/lib/backend.ts` - API wrappers for chefs, orders, reviews, and tracking
- `frontend/src/styles/OrderHomemadeFood.css` - responsive UI styles

### Backend Folder Structure

- `backend/src/controllers/homeChefs.controller.js`
- `backend/src/controllers/orders.controller.js`
- `backend/src/controllers/payments.controller.js`
- `backend/src/routes/homeChefs.routes.js`
- `backend/src/routes/orders.routes.js`
- `backend/src/routes/payments.routes.js`
- `backend/sql/schema.sql`
- `backend/sql/seed.sql`

### API Structure

- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `GET /api/home-chefs`
- `GET /api/home-chefs/:chefId`
- `GET /api/home-chefs/:chefId/menu`
- `GET /api/home-chefs/:chefId/reviews`
- `POST /api/home-chefs/:chefId/orders?userId=123`
- `POST /api/home-chefs/:chefId/reviews`
- `GET /api/users/:userId/orders/:orderId/tracking`
- `PATCH /api/users/:userId/orders/:orderId/status`
- `POST /api/payments/create`
- `POST /api/payments/confirm`

### Database Schema

The MySQL schema now includes the core homemade-food tables:

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

### Sample UI Layout

- Hero banner with CTA
- Search bar + filter chips
- Today’s Specials cards
- Nearby Home Chefs grid
- Chef profile panel
- Menu and cart sidebar
- Checkout form
- Subscription block
- Live tracking panel
- Reviews composer

---

## Home Chef Flow

The "Continue as Home Chef" flow is currently a frontend routing flow, not a separate backend account type.

In the current project, the user flow is:

- phone number
- OTP
- role selection

When the user taps `Continue as Home Chef`, the app navigates to the home-chef experience from the frontend. In this repository, that role is represented by the `Partner` page and related SPA routes.

The route handling in [`frontend/src/App.tsx`](frontend/src/App.tsx) maps the home-chef experience through the frontend router, while [`frontend/src/pages/Login.tsx`](frontend/src/pages/Login.tsx) handles the login and role selection step.

At the moment, the backend auth remains generic. It creates a logged-in user session, but it does not store a separate `home chef` role in the database. So, in plain English, the home-chef option is mainly a UI navigation flow right now.

The intended home-chef journey can be described like this:

- The user logs in with phone number and OTP.
- On the role screen, choosing Home Chef sends the app to the chef path.
- The backend auth is still generic login and JWT, not a separate chef account system yet.
- Chef features in the app are represented by the chef-oriented frontend screens and partner flow.
- A complete chef experience would normally include:
  - onboarding intro for chefs
  - dashboard overview
  - orders list and order detail screens
  - menu management screen
  - nearby orders and kitchens screen
  - chef profile screen
  - bottom navigation for chef pages

If you want, I can also turn this into a dedicated `Chef Flow` section in a cleaner report format.

---

## Home Chef Roadmap

The current project already has a frontend chef mode, but the following features would make it a real production-level Home Chef system:

### 1. Separate Home Chef Registration

Right now login is common for everyone. A dedicated Home Chef signup should include:

- Full Name
- Phone Number
- Kitchen Name
- Kitchen Address
- FSSAI License
- Aadhaar / PAN verification
- Bank Account Details
- UPI ID
- Profile Photo

This creates a proper chef account in MySQL.

### 2. Chef Role in Backend

Add a `role` field in the users table:

```sql
role ENUM('customer', 'chef', 'admin')
```

This allows backend authentication to distinguish chefs from customers and admins.

### 3. Real Order Management API

The current frontend uses local state for chef actions. The backend should expose APIs such as:

- `GET /api/chef/orders`
- `POST /api/chef/order/accept`
- `POST /api/chef/order/reject`
- `POST /api/chef/order/ready`

This makes live order handling real.

### 4. Menu Management Backend

Chef dishes should be saved in the database. Example APIs:

- `POST /api/chef/menu/add`
- `PUT /api/chef/menu/update`
- `DELETE /api/chef/menu/delete`
- `GET /api/chef/menu`

### 5. Online / Offline Kitchen Status

Chefs should be able to control availability with:

- Online
- Busy
- Offline

Example:

- `POST /api/chef/status`

### 6. Earnings + Wallet Section

Very important for the Home Chef dashboard. It should show:

- Today Earnings
- Weekly Earnings
- Monthly Earnings
- Pending Payments
- Wallet Balance
- Withdraw Request

### 7. Delivery Partner Integration

For real pickup and delivery assignment, integrate with:

- Porter
- Dunzo
- Shadowfax

### 8. Order Notifications

Chefs should get instant alerts using:

- Push notifications
- SMS
- WhatsApp alerts

when a new order arrives.

### 9. Ratings and Reviews

Customers should rate chefs on:

- Food Quality
- Delivery Experience
- Hygiene
- Packaging

### 10. Admin Approval Panel

Before a chef goes live, admin should verify:

- Documents
- Kitchen details
- License
- Bank details

Then approve the chef account.

### 11. Inventory Management

Chefs should be able to track:

- Ingredient stock
- Low stock alerts
- Daily requirement planning

### 12. Analytics Dashboard

The chef should see:

- Top-selling dishes
- Peak order times
- Repeat customers
- Monthly growth
- Revenue graph

### Priority Order

If building step by step, the best order is:

First priority:

- Separate chef registration
- Backend role system
- Order APIs
- Menu APIs

Second priority:

- Earnings
- Notifications
- Delivery integration

Third priority:

- Ratings
- Admin approval
- Analytics
- Inventory
"# HomeFood" 
