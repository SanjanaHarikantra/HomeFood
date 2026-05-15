const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type RequestOptions = RequestInit & {
  json?: unknown;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }

  return payload as T;
}

export type BackendMeal = {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string | null;
  rating: string | null;
  tag: string | null;
};

export type BackendAddress = {
  id: number;
  user_id: number;
  type: string;
  full_address: string;
  name: string;
  phone: string;
  city: string;
  pincode: string;
  is_default: number;
};

export type BackendUser = {
  id: number;
  name: string;
  phone: string;
  role?: "customer" | "chef" | "delivery" | "admin";
  chef_id?: number | null;
};

export type BackendOrder = {
  id: number;
  order_code: string;
  user_id: number;
  chef_id?: number | null;
  address_id: number;
  order_type?: string;
  payment_method: string;
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  created_at: string;
  delivery?: {
    provider: "Porter";
    riderName: string;
    riderPhone: string;
    vehicleType: string;
    eta: string;
    fee: number;
    instruction: string;
    note: string;
    orderStatus: string;
    completionTime?: string;
    nextDeliveryTime?: string;
    timeline: {
      label: string;
      completed: boolean;
      active?: boolean;
    }[];
    trackingId: string;
  };
  items?: {
    id: number;
    meal_id: number;
    title: string;
    price: number;
    quantity: number;
  }[];
};

export type BackendWallet = {
  id: number;
  user_id: number;
  balance: number;
  gold_points: number;
  updated_at: string;
};

export type BackendWalletTx = {
  id: number;
  user_id: number;
  title: string;
  amount: number;
  status: string;
  kind: "credit" | "debit";
  created_at: string;
};

export type BackendGoldTx = {
  id: number;
  user_id: number;
  title: string;
  points: number;
  kind: "earned" | "used";
  created_at: string;
};

export type BackendSubscriptionPlan = {
  id: number;
  name: string;
  price: number;
  duration_days: number;
  description: string | null;
  is_active: number;
};

export type BackendCreatedSubscription = {
  id: number;
  user_id: number;
  plan_id: number;
  address_id: number;
  payment_method: string;
  amount: number;
  starts_on: string;
  ends_on: string;
  status: string;
  created_at: string;
};

export type BackendHomeChef = {
  id: number;
  chef_name: string;
  kitchen_name: string;
  area: string;
  city: string;
  cuisine_tag: string;
  bio: string | null;
  rating: number;
  review_count: number;
  delivery_time_mins: number;
  delivery_radius_km: number;
  veg_only: number;
  image_url: string | null;
  is_active: number;
  menu_count?: number;
};

export type BackendHomeChefMenuItem = {
  id: number;
  chef_id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string | null;
  image_url: string | null;
  is_veg: number;
  is_healthy: number;
  is_tiffin: number;
  is_budget: number;
  is_available: number;
};

export type BackendChefProfile = BackendHomeChef & {
  user_id?: number;
  owner_name?: string;
  owner_phone?: string;
};

export type BackendHomeChefReview = {
  id: number;
  chef_id: number;
  customer_id: number | null;
  order_id: number | null;
  rating: number;
  review_text: string;
  created_at: string;
  customer_name?: string;
};

export type BackendHomeChefTracking = {
  order: BackendOrder;
  chef: BackendHomeChef | null;
  delivery: {
    id: number;
    order_id: number;
    partner_name: string;
    partner_phone: string;
    vehicle_type: string;
    status: string;
    eta_minutes: number;
    pickup_time: string | null;
    dropoff_time: string | null;
    created_at: string;
  } | null;
  events: {
    id: number;
    order_id: number;
    status: string;
    note: string;
    created_at: string;
  }[];
  timeline: {
    label: string;
    completed: boolean;
    active?: boolean;
  }[];
};

export type BackendChefDashboard = {
  chef: BackendHomeChef & {
    user_id?: number;
    owner_name?: string;
    owner_phone?: string;
  };
  stats: {
    liveOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalOrders: number;
    earnings: number;
    rating: number;
    menuCount: number;
  };
};

export type BackendChefOrder = {
  id: number;
  order_code: string;
  customer_name: string;
  item_summary: string;
  status: "Pending" | "Accepted" | "Preparing" | "Shipped" | "Out for Delivery" | "Delivered" | "Rejected";
  created_at: string;
  address: string;
  total: number;
};

export async function sendOtp(phone: string) {
  const response = await request<{
    success: boolean;
    message: string;
    data: { phone: string; otp: string };
  }>("/auth/send-otp", {
    method: "POST",
    json: { phone },
  });

  return response.data;
}

export async function verifyOtp(phone: string, otp: string, role: "customer" | "chef" = "customer") {
  const response = await request<{
    success: boolean;
    data: { user: BackendUser; token: string };
  }>("/auth/verify-otp", {
    method: "POST",
    json: { phone, otp, role },
  });

  return response.data.user;
}

export async function fetchMeals() {
  const response = await request<{
    success: boolean;
    data: BackendMeal[];
  }>("/meals");

  return response.data;
}

export async function listAddresses(userId: number) {
  const response = await request<{
    success: boolean;
    data: BackendAddress[];
  }>(`/users/${userId}/addresses`);

  return response.data;
}

export async function getWallet(userId: number) {
  const response = await request<{
    success: boolean;
    data: {
      wallet: BackendWallet;
      transactions: BackendWalletTx[];
      goldHistory: BackendGoldTx[];
    };
  }>(`/users/${userId}/wallet`);

  return response.data;
}

export async function addMoney(
  userId: number,
  payload: { amount: number; method: string }
) {
  await request(`/users/${userId}/wallet/add-money`, {
    method: "POST",
    json: payload,
  });
}

export async function redeemGold(
  userId: number,
  payload: { reward: "discount50" | "freeDelivery" | "cashback" }
) {
  await request(`/users/${userId}/wallet/redeem-gold`, {
    method: "POST",
    json: payload,
  });
}

export async function applyReferralReward(
  userId: number,
  payload: { source?: string; cash?: number; gold?: number }
) {
  await request(`/users/${userId}/offers`, {
    method: "POST",
    json: payload,
  });
}

export async function getOrders(userId: number) {
  const response = await request<{
    success: boolean;
    data: BackendOrder[];
  }>(`/users/${userId}/orders`);

  return response.data;
}

export async function getSubscriptionPlans() {
  const response = await request<{
    success: boolean;
    data: BackendSubscriptionPlan[];
  }>("/subscriptions/plans");

  return response.data;
}

export async function createSubscription(
  userId: number,
  payload: { planId: number; addressId: number; paymentMethod: string }
) {
  const response = await request<{
    success: boolean;
    message: string;
    data: BackendCreatedSubscription;
  }>(`/users/${userId}/subscriptions`, {
    method: "POST",
    json: payload,
  });

  return response.data;
}

export async function getHomeChefs(filters: {
  search?: string;
  veg?: boolean;
  nonVeg?: boolean;
  healthy?: boolean;
  tiffin?: boolean;
  budget?: boolean;
}) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.veg) params.set("veg", "1");
  if (filters.nonVeg) params.set("nonVeg", "1");
  if (filters.healthy) params.set("healthy", "1");
  if (filters.tiffin) params.set("tiffin", "1");
  if (filters.budget) params.set("budget", "1");

  const response = await request<{
    success: boolean;
    data: BackendHomeChef[];
  }>(`/home-chefs${params.toString() ? `?${params.toString()}` : ""}`);

  return response.data;
}

export async function getHomeChef(chefId: number) {
  const response = await request<{
    success: boolean;
    data: BackendHomeChef;
  }>(`/home-chefs/${chefId}`);

  return response.data;
}

export async function getHomeChefMenu(
  chefId: number,
  filters: {
    search?: string;
    veg?: boolean;
    healthy?: boolean;
    tiffin?: boolean;
    budget?: boolean;
  } = {}
) {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.veg) params.set("veg", "1");
  if (filters.healthy) params.set("healthy", "1");
  if (filters.tiffin) params.set("tiffin", "1");
  if (filters.budget) params.set("budget", "1");

  const response = await request<{
    success: boolean;
    data: BackendHomeChefMenuItem[];
  }>(`/home-chefs/${chefId}/menu${params.toString() ? `?${params.toString()}` : ""}`);

  return response.data;
}

export async function getChefProfile(userId: number) {
  const response = await request<{
    success: boolean;
    data: BackendChefProfile;
  }>(`/home-chefs/me/${userId}/profile`);

  return response.data;
}

export async function updateChefProfile(
  userId: number,
  payload: {
    chefName: string;
    kitchenName: string;
    area: string;
    city: string;
    cuisineTag?: string;
    bio?: string;
    image_url?: string | null;
  }
) {
  const response = await request<{
    success: boolean;
    data: BackendChefProfile;
  }>(`/home-chefs/me/${userId}/profile`, {
    method: "PATCH",
    json: payload,
  });

  return response.data;
}

export async function getChefDashboard(userId: number) {
  const response = await request<{
    success: boolean;
    data: BackendChefDashboard;
  }>(`/home-chefs/me/${userId}/dashboard`);

  return response.data;
}

export async function getChefOrders(userId: number) {
  const response = await request<{
    success: boolean;
    data: BackendChefOrder[];
  }>(`/home-chefs/me/${userId}/orders`);

  return response.data;
}

export async function updateChefOrderStatus(
  userId: number,
  orderId: number,
  payload: { status: "Pending" | "Accepted" | "Preparing" | "Shipped" | "Out for Delivery" | "Delivered" | "Rejected" }
) {
  const response = await request<{
    success: boolean;
    data: { id: number; status: string };
  }>(`/home-chefs/me/${userId}/orders/${orderId}/status`, {
    method: "PATCH",
    json: payload,
  });

  return response.data;
}

export async function getChefMenu(userId: number) {
  const response = await request<{
    success: boolean;
    data: BackendHomeChefMenuItem[];
  }>(`/home-chefs/me/${userId}/menu`);

  return response.data;
}

export async function createChefMenuItem(
  userId: number,
  payload: {
    title: string;
    category: string;
    price: number;
    description?: string;
    image_url?: string | null;
  }
) {
  const response = await request<{
    success: boolean;
    data: BackendHomeChefMenuItem;
  }>(`/home-chefs/me/${userId}/menu`, {
    method: "POST",
    json: payload,
  });

  return response.data;
}

export async function updateChefMenuItem(
  userId: number,
  menuItemId: number,
  payload: {
    isAvailable?: boolean;
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    image_url?: string | null;
  }
) {
  const response = await request<{
    success: boolean;
    data: Partial<BackendHomeChefMenuItem>;
  }>(`/home-chefs/me/${userId}/menu/${menuItemId}`, {
    method: "PATCH",
    json: payload,
  });

  return response.data;
}

export async function deleteChefMenuItem(userId: number, menuItemId: number) {
  await request(`/home-chefs/me/${userId}/menu/${menuItemId}`, {
    method: "DELETE",
  });
}

export async function getHomeChefReviews(chefId: number) {
  const response = await request<{
    success: boolean;
    data: BackendHomeChefReview[];
  }>(`/home-chefs/${chefId}/reviews`);

  return response.data;
}

export async function createChefReview(
  chefId: number,
  payload: {
    customerId?: number | null;
    orderId?: number | null;
    rating: number;
    reviewText: string;
  }
) {
  const response = await request<{
    success: boolean;
    data: BackendHomeChefReview;
  }>(`/home-chefs/${chefId}/reviews`, {
    method: "POST",
    json: payload,
  });

  return response.data;
}

export async function createHomemadeOrder(
  userId: number,
  chefId: number,
  payload: {
    items: { menuItemId: number; quantity: number }[];
    addressId: number;
    paymentMethod: string;
    deliverySlot?: string;
    note?: string;
  }
) {
  const response = await request<{
    success: boolean;
    message: string;
    data: BackendOrder & {
      chef?: BackendHomeChef;
      items?: { menuItemId: number; quantity: number; price: number; title: string }[];
      delivery?: {
        provider: "Porter";
        riderName: string;
        riderPhone: string;
        vehicleType: string;
        eta: string;
        fee: number;
        orderStatus: string;
        trackingId: string;
      };
    };
  }>(`/home-chefs/${chefId}/orders?userId=${userId}`, {
    method: "POST",
    json: payload,
  });

  return response.data;
}

export async function getOrderTracking(userId: number, orderId: number) {
  const response = await request<{
    success: boolean;
    data: BackendHomeChefTracking;
  }>(`/users/${userId}/orders/${orderId}/tracking`);

  return response.data;
}

export async function updateOrderStatus(
  userId: number,
  orderId: number,
  payload: {
    status: string;
    note?: string;
    partnerName?: string;
    partnerPhone?: string;
    vehicleType?: string;
    etaMinutes?: number;
  }
) {
  const response = await request<{
    success: boolean;
    message: string;
    data: BackendOrder;
  }>(`/users/${userId}/orders/${orderId}/status`, {
    method: "PATCH",
    json: payload,
  });

  return response.data;
}

export async function createAddress(
  userId: number,
  payload: {
    type: string;
    fullAddress: string;
    name: string;
    phone: string;
    city: string;
    pincode: string;
    isDefault?: boolean;
  }
) {
  const response = await request<{
    success: boolean;
    data: BackendAddress;
  }>(`/users/${userId}/addresses`, {
    method: "POST",
    json: payload,
  });

  return response.data;
}

export async function deleteAddress(userId: number, addressId: number) {
  await request(`/users/${userId}/addresses/${addressId}`, {
    method: "DELETE",
  });
}

export async function placeOrder(
  userId: number,
  payload: {
    items: { mealId: number; quantity: number }[];
    addressId: number;
    paymentMethod: string;
    couponCode?: string;
    walletUsed?: number;
  }
) {
  const response = await request<{
    success: boolean;
    message: string;
    data: {
      id: number;
      order_code: string;
      user_id: number;
      address_id: number;
      payment_method: string;
      subtotal: number;
      discount: number;
      total: number;
      status: string;
      created_at: string;
    };
  }>(`/users/${userId}/orders`, {
    method: "POST",
    json: payload,
  });

  return response.data;
}
