import { useEffect, useState } from "react";
import "./styles/global.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Meals from "./pages/Meals";
import MealDetail from "./pages/MealDetail";
import Subscriptions from "./pages/Subscriptions";
import DailyMealCustomizer from "./components/DailyMealCustomizer";
import Cart from "./pages/Cart";
import LiveTrackingPage from "./pages/LiveTrackingPage";
import HealthDashboardPage from "./pages/HealthDashboardPage";
import Corporate from "./pages/Corporate";
import Partner from "./pages/Partner";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Notifications from "./pages/Notifications";
import EditProfile from "./pages/EditProfile";
import Checkout from "./pages/Checkout";
import Splash from "./pages/Splash";
import RoleSelect from "./pages/RoleSelect";
import ChefWelcome from "./pages/ChefWelcome";
import ChefDashboard from "./pages/ChefDashboard";
import ChefOrders from "./pages/ChefOrders";
import ChefMenu from "./pages/ChefMenu";
import ChefNearby from "./pages/ChefNearby";
import ChefProfile from "./pages/ChefProfile";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import Location from "./pages/Location";
import Search from "./pages/Search";
import OrderHomemadeFood from "./pages/OrderHomemadeFood";
import SubscriptionDetails from "./pages/SubscriptionDetails";
import SubscriptionAddress from "./pages/SubscriptionAddress";
import SubscriptionPayment from "./pages/SubscriptionPayment";
import SubscriptionConfirmation from "./pages/SubscriptionConfirmation";
import type { SubscriptionPlan } from "./pages/Subscriptions";
import NearMe from "./pages/NearMe";
import BigPromo from "./pages/BigPromo";
import BestSeller from "./pages/BestSeller";
import BudgetMeal from "./pages/BudgetMeal";
import HealthyFood from "./pages/HealthyFood";
import Open24Hours from "./pages/Open24Hours";
import Popular from "./pages/Popular";
import MoreFilters from "./pages/MoreFilters";
import GharKaWallet from "./pages/GharKaWallet";
import Favourites from "./pages/Favourites";
import ManageAddress, { type SavedAddress } from "./pages/ManageAddress";
import OffersCoupons from "./pages/OffersCoupons";
import GharKaGold from "./pages/GharKaGold";
import ReferEarn from "./pages/ReferEarn";
import ChefNavbar from "./components/ChefNavbar";
import {
  createAddress as apiCreateAddress,
  addMoney as apiAddMoney,
  createChefMenuItem as apiCreateChefMenuItem,
  deleteChefMenuItem as apiDeleteChefMenuItem,
  deleteAddress as apiDeleteAddress,
  getChefDashboard as apiGetChefDashboard,
  getChefMenu as apiGetChefMenu,
  getChefOrders as apiGetChefOrders,
  getChefProfile as apiGetChefProfile,
  getHomeChefMenu as apiGetHomeChefMenu,
  getHomeChefs as apiGetHomeChefs,
  fetchMeals as apiFetchMeals,
  getOrders as apiGetOrders,
  getSubscriptionPlans as apiGetSubscriptionPlans,
  getWallet as apiGetWallet,
  listAddresses as apiListAddresses,
  applyReferralReward as apiApplyReferralReward,
  redeemGold as apiRedeemGold,
  placeOrder as apiPlaceOrder,
  createSubscription as apiCreateSubscription,
  type BackendCreatedSubscription,
  type BackendChefOrder,
  type BackendChefProfile,
  type BackendHomeChefMenuItem,
  type BackendOrder,
  type BackendMeal,
  type BackendSubscriptionPlan,
  type BackendUser,
  updateChefProfile as apiUpdateChefProfile,
  updateChefMenuItem as apiUpdateChefMenuItem,
  updateChefOrderStatus as apiUpdateChefOrderStatus,
} from "./lib/backend";

type Meal = {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  rating: string;
  tag?: string;
};

type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  items: CartItem[];
  total: number;
  address: string;
  payment: string;
  placedAt: string;
  delivery?: DeliverySnapshot;
};

type DeliveryTimelineStep = {
  label: string;
  completed: boolean;
  active?: boolean;
};

type DeliverySnapshot = {
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
  timeline: DeliveryTimelineStep[];
  trackingId: string;
};

type Coupon = {
  code: string;
  label: string;
  type: "percent" | "flat";
  value: number;
  max?: number;
  min?: number;
};

type WalletPaymentMethod = "UPI" | "Card" | "Net Banking";
type WalletTransaction = {
  id: string;
  title: string;
  dateTime: string;
  amount: number;
  status: "Success" | "Pending" | "Failed";
  kind: "credit" | "debit";
};

type GoldTransaction = {
  id: string;
  title: string;
  dateTime: string;
  points: number;
  kind: "earned" | "used";
};

type ChefOrderStatus = "Pending" | "Accepted" | "Preparing" | "Shipped" | "Out for Delivery" | "Delivered" | "Rejected";
type ChefOrder = {
  id: string;
  customer: string;
  items: string;
  status: ChefOrderStatus;
  time: string;
  address: string;
};

type ChefMenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  category: string;
  available: boolean;
  image: string;
};

type ChefArea = {
  name: string;
  orders: string;
  highlight?: boolean;
};

type ChefProfileInfo = {
  kitchenName: string;
  ownerName: string;
  area: string;
  city: string;
  cuisineTag: string;
  bio: string;
  rating: string;
  reviewCount: number;
  payout: string;
  onlineHours: string;
  image: string;
};

type SubscriptionDeliverySnapshot = {
  provider: "Porter";
  nextDeliveryTime: string;
  scheduleStatus: string;
  riderName: string;
  riderPhone: string;
  vehicleType: string;
};

type LocalSubscriptionSnapshot = BackendCreatedSubscription & {
  plan_name?: string;
};

type AuthUser = BackendUser;

const DEFAULT_CHEF_PROFILE: ChefProfileInfo = {
  kitchenName: "Aai's Kitchen",
  ownerName: "Sushmita Joshi",
  area: "Bandra West",
  city: "Mumbai",
  cuisineTag: "Homemade",
  bio: "Warm home-style meals for nearby families and office lunch orders.",
  rating: "4.8★",
  reviewCount: 128,
  payout: "Weekly transfer to bank account ending 4591",
  onlineHours: "9:00 AM - 9:00 PM",
  image: "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=1200&q=80",
};

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-1",
    type: "Home",
    fullAddress: "C4/139, Mehndi Wala Park, Block C5, Keshav Puram",
    name: "Sushhh",
    phone: "7290876554",
    city: "New Delhi",
    pincode: "110035",
    isDefault: true,
  },
  {
    id: "addr-2",
    type: "Work",
    fullAddress: "Tower B, Sector 62, Near Metro Station",
    name: "Sushhh",
    phone: "7290876554",
    city: "Noida",
    pincode: "201309",
  },
];

const COUPONS: Coupon[] = [
  {
    code: "SWIGGY10",
    label: "10% off up to ₹50",
    type: "percent",
    value: 10,
    max: 50,
    min: 149,
  },
  {
    code: "TIFFIN50",
    label: "Flat ₹50 off on ₹199+",
    type: "flat",
    value: 50,
    min: 199,
  },
  {
    code: "FRESH15",
    label: "15% off up to ₹80",
    type: "percent",
    value: 15,
    max: 80,
    min: 249,
  },
  {
    code: "WELCOME25",
    label: "25% off up to ₹120 on ₹399+",
    type: "percent",
    value: 25,
    max: 120,
    min: 399,
  },
];

const MEALS: Meal[] = [
  {
    id: "meal-aai-thali",
    title: "Aai's Daily Thali",
    description: "2 phulka, dal fry, jeera rice, sabzi & salad",
    price: 169,
    rating: "4.8★",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
    tag: "Veg",
  },
  {
    id: "meal-protein-box",
    title: "Protein Power Box",
    description: "Brown rice, tofu masala, sprouts, curd",
    price: 219,
    rating: "4.7★",
    image:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80",
    tag: "Veg",
  },
  {
    id: "meal-khichdi-combo",
    title: "Comfort Khichdi Combo",
    description: "Moong dal khichdi, ghee, papad, buttermilk",
    price: 149,
    rating: "4.6★",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80",
    tag: "Veg",
  },
  {
    id: "meal-chicken-curry",
    title: "Chicken Curry Tiffin",
    description: "Steamed rice, home-style chicken curry, salad",
    price: 249,
    rating: "4.7★",
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    tag: "Non-Veg",
  },
  {
    id: "meal-egg-bhurji",
    title: "Egg Bhurji Meal Box",
    description: "Phulka, egg bhurji, dal, cucumber salad",
    price: 199,
    rating: "4.5★",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80",
    tag: "Non-Veg",
  },
  {
    id: "meal-paneer-millet",
    title: "Paneer Millet Bowl",
    description: "Millet pulao, paneer tikka, saute veggies",
    price: 229,
    rating: "4.6★",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    tag: "Veg",
  },
];

const LOCAL_ORDER_HISTORY_KEY = "dabba_local_orders";
const LOCAL_DELIVERY_HISTORY_KEY = "dabba_delivery_history";
const LOCAL_SUBSCRIPTION_HISTORY_KEY = "dabba_subscription_history";
const ENTRY_MODE_KEY = "dabba_entry_mode";

const DELIVERY_INSTRUCTIONS = [
  "Leave at gate",
  "Call before arrival",
  "Office reception drop",
  "Security handover",
];

const DELIVERY_NOTES = [
  "No onion",
  "Less spicy",
  "Ring the bell once",
  "Call if delayed",
];

const App = () => {
  const [route, setRoute] = useState(window.location.hash || "#choose-role");
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const raw = window.localStorage.getItem("dabba_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  });
  const [showSplash, setShowSplash] = useState(true);
  const [location, setLocation] = useState("");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(MEALS[0] ?? null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [deliverySnapshot, setDeliverySnapshot] = useState<DeliverySnapshot | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<BackendSubscriptionPlan[]>([]);
  const [subscriptionAddress, setSubscriptionAddress] = useState("");
  const [subscriptionPayment, setSubscriptionPayment] = useState("");
  const [subscriptionResult, setSubscriptionResult] = useState<BackendCreatedSubscription | null>(null);
  const [subscriptionError, setSubscriptionError] = useState("");
  const [subscriptionDelivery, setSubscriptionDelivery] = useState<SubscriptionDeliverySnapshot | null>(null);
  const [deliveryInstruction, setDeliveryInstruction] = useState(DELIVERY_INSTRUCTIONS[0]);
  const [deliveryNote, setDeliveryNote] = useState(DELIVERY_NOTES[0]);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(DEFAULT_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(DEFAULT_ADDRESSES[0]?.id ?? null);
  const [walletBalance, setWalletBalance] = useState(500);
  const [walletPoints, setWalletPoints] = useState(1200);
  const [backendReady, setBackendReady] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [backendUserId, setBackendUserId] = useState<number | null>(null);
  const [backendMealsByTitle, setBackendMealsByTitle] = useState<Map<string, BackendMeal>>(new Map());
  const [backendOrders, setBackendOrders] = useState<BackendOrder[]>([]);
  const [goldHistory, setGoldHistory] = useState<GoldTransaction[]>([
    {
      id: "GLD-1001",
      title: "Order Reward",
      dateTime: "24 Mar 2026, 8:10 PM",
      points: 20,
      kind: "earned",
    },
    {
      id: "GLD-1002",
      title: "Wallet Top-up Reward",
      dateTime: "24 Mar 2026, 10:30 AM",
      points: 20,
      kind: "earned",
    },
  ]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([
    {
      id: "WLT-1001",
      title: "Wallet Top-up",
      dateTime: "24 Mar 2026, 10:30 AM",
      amount: 500,
      status: "Success",
      kind: "credit",
    },
    {
      id: "WLT-1002",
      title: "Order Payment",
      dateTime: "23 Mar 2026, 1:10 PM",
      amount: -220,
      status: "Success",
      kind: "debit",
    },
    {
      id: "WLT-1003",
      title: "Cashback Reward",
      dateTime: "23 Mar 2026, 1:12 PM",
      amount: 20,
      status: "Success",
      kind: "credit",
    },
  ]);
  const [chefOnline, setChefOnline] = useState(true);
  const [chefOrders, setChefOrders] = useState<ChefOrder[]>([]);
  const [chefMenuItems, setChefMenuItems] = useState<ChefMenuItem[]>([]);
  const [chefAreas] = useState<ChefArea[]>([
    { name: "Bandra West", orders: "18 active requests", highlight: true },
    { name: "Andheri East", orders: "12 active requests" },
    { name: "Powai", orders: "7 active requests" },
  ]);
  const [chefProfile, setChefProfile] = useState<ChefProfileInfo>(DEFAULT_CHEF_PROFILE);
  const [featuredHomeMeals, setFeaturedHomeMeals] = useState<Meal[]>([]);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash || "#home");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const syncUserFromStorage = () => {
      const raw = window.localStorage.getItem("dabba_user");
      if (!raw) {
        setAuthUser(null);
        return;
      }

      try {
        setAuthUser(JSON.parse(raw) as AuthUser);
      } catch {
        setAuthUser(null);
      }
    };

    const onProfileUpdate = () => {
      syncUserFromStorage();
    };

    window.addEventListener("dabba-user-updated", onProfileUpdate);
    return () => window.removeEventListener("dabba-user-updated", onProfileUpdate);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!authUser && route !== "#login" && route !== "#choose-role") {
      window.location.hash = "#login";
    }
  }, [authUser, route]);

  useEffect(() => {
    const allowWithoutLocation = new Set([
      "#login",
      "#location",
      "#profile",
      "#edit-profile",
      "#choose-role",
      "#notifications",
      "#order-history",
      "#wallet",
      "#favourites",
      "#addresses",
      "#offers",
      "#gold",
      "#refer-earn",
      "#partner",
      "#chef-welcome",
      "#chef-dashboard",
      "#chef-orders",
      "#chef-menu",
      "#chef-nearby",
      "#chef-profile",
      "#order-home-made-food",
    ]);

    if (
      authUser &&
      !location &&
      !allowWithoutLocation.has(route) &&
      !route.startsWith("#subscription")
    ) {
      window.location.hash = "#location";
    }
  }, [authUser, location, route]);

  useEffect(() => {
    if (cartItems.length === 0) {
      setCouponInput("");
      setAppliedCoupon(null);
      setCouponError("");
    }
  }, [cartItems.length]);

  const readLocalOrderHistory = (): BackendOrder[] => {
    const raw = window.localStorage.getItem(LOCAL_ORDER_HISTORY_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as BackendOrder[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const writeLocalOrderHistory = (orders: BackendOrder[]) => {
    window.localStorage.setItem(LOCAL_ORDER_HISTORY_KEY, JSON.stringify(orders));
  };

  const readLocalDeliveryHistory = (): Record<string, DeliverySnapshot> => {
    const raw = window.localStorage.getItem(LOCAL_DELIVERY_HISTORY_KEY);
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw) as Record<string, DeliverySnapshot>;
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

  const writeLocalDeliveryHistory = (history: Record<string, DeliverySnapshot>) => {
    window.localStorage.setItem(LOCAL_DELIVERY_HISTORY_KEY, JSON.stringify(history));
  };

  const readLocalSubscriptionHistory = (): LocalSubscriptionSnapshot[] => {
    const raw = window.localStorage.getItem(LOCAL_SUBSCRIPTION_HISTORY_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as LocalSubscriptionSnapshot[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const writeLocalSubscriptionHistory = (history: LocalSubscriptionSnapshot[]) => {
    window.localStorage.setItem(LOCAL_SUBSCRIPTION_HISTORY_KEY, JSON.stringify(history));
  };

  const buildDeliverySnapshot = (orderCode: string, etaOverride?: string): DeliverySnapshot => {
    const nextDeliveryTime = new Date(Date.now() + 45 * 60 * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const completionTime = new Date(Date.now() + 60 * 60 * 1000).toLocaleString();

    return {
      provider: "Porter",
      riderName: "Assigned by Porter",
      riderPhone: "1800-180-1234",
      vehicleType: "Bike",
      eta: etaOverride || "25-35 min",
      fee: 29,
      instruction: deliveryInstruction,
      note: deliveryNote,
      orderStatus: "Chef preparing your food",
      completionTime,
      nextDeliveryTime,
      timeline: [
        { label: "Order Confirmed", completed: true },
        { label: "Chef Accepted", completed: true },
        { label: "Food Preparing", completed: true, active: true },
        { label: "Ready for Pickup", completed: false },
        { label: "Shipped", completed: false },
        { label: "Porter Assigned", completed: false },
        { label: "Picked Up", completed: false },
        { label: "On the Way", completed: false },
        { label: "Reached Nearby", completed: false },
        { label: "Delivered", completed: false },
      ],
      trackingId: orderCode,
    };
  };

  const buildDeliverySnapshotFromOrder = (backendOrder: BackendOrder): DeliverySnapshot => {
    const steps = ["Placed", "Accepted", "Preparing", "Shipped", "Out for Delivery", "Delivered"];
    const activeIndex = Math.max(0, steps.indexOf(backendOrder.status));
    const messages: Record<string, string> = {
      Placed: "Chef updated your order: Placed.",
      Accepted: "Chef updated your order: Accepted.",
      Preparing: "Chef updated your order: Preparing.",
      Shipped: "Chef updated your order: Shipped.",
      "Out for Delivery": "Chef updated your order: Out for Delivery.",
      Delivered: "Chef updated your order: Delivered.",
      Rejected: "Chef updated your order: Rejected.",
    };

    return {
      provider: "Porter",
      riderName: "Porter Rider",
      riderPhone: "1800-180-1234",
      vehicleType: "Bike",
      eta: backendOrder.status === "Delivered" ? "Delivered" : "25-35 min",
      fee: 29,
      instruction: deliveryInstruction,
      note: deliveryNote,
      orderStatus: messages[backendOrder.status] || `Order status: ${backendOrder.status}`,
      completionTime: backendOrder.status === "Delivered" ? new Date().toLocaleString() : undefined,
      timeline: steps.map((step, index) => ({
        label: step,
        completed: backendOrder.status === "Rejected" ? index === 0 : index <= activeIndex,
        active: step === backendOrder.status,
      })),
      trackingId: backendOrder.order_code,
    };
  };

  const buildLocalSubscriptionResult = (
    userId: number,
    plan: SubscriptionPlan,
    addressId: number,
    paymentMethod: string,
    planId: number
  ): LocalSubscriptionSnapshot => {
    const durationDaysMatch = plan.period.match(/\d+/);
    const durationDays = durationDaysMatch ? Number(durationDaysMatch[0]) : 30;
    const parsedPrice = Number(plan.price.replace(/[^\d.]/g, ""));
    const startsOn = new Date();
    const endsOn = new Date(startsOn);
    endsOn.setDate(startsOn.getDate() + (Number.isFinite(durationDays) && durationDays > 0 ? durationDays : 30));

    return {
      id: Date.now(),
      user_id: userId,
      plan_id: Number.isFinite(planId) ? planId : 0,
      address_id: addressId,
      payment_method: paymentMethod,
      amount: Number.isFinite(parsedPrice) ? parsedPrice : 0,
      starts_on: startsOn.toISOString(),
      ends_on: endsOn.toISOString(),
      status: "active",
      created_at: startsOn.toISOString(),
      plan_name: plan.title,
    };
  };

  const makeLocalOrder = (params: {
    orderCode: string;
    addressId: number;
    paymentMethod: string;
    subtotal: number;
    discount: number;
    total: number;
    items: { mealId: number; quantity: number; price: number; title: string }[];
    delivery: DeliverySnapshot;
  }): BackendOrder => ({
    id: Date.now(),
    order_code: params.orderCode,
    user_id: authUser?.id ?? backendUserId ?? 0,
    address_id: params.addressId,
    payment_method: params.paymentMethod,
    subtotal: params.subtotal,
    discount: params.discount,
    total: params.total,
    status: "Placed",
    created_at: new Date().toISOString(),
    delivery: params.delivery,
    items: params.items.map((item, index) => ({
      id: index + 1,
      meal_id: item.mealId,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    })),
  });

  const mapChefOrder = (order: BackendChefOrder): ChefOrder => ({
    id: String(order.id),
    customer: order.customer_name,
    items: order.item_summary,
    status: order.status,
    time: new Date(order.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    address: order.address,
  });

  const mapChefMenuItem = (item: BackendHomeChefMenuItem): ChefMenuItem => ({
    id: String(item.id),
    name: item.title,
    description: item.description,
    price: `₹${Number(item.price)}`,
    stock: item.is_available ? 10 : 0,
    category: item.category,
    available: Boolean(item.is_available),
    image: item.image_url || DEFAULT_CHEF_PROFILE.image,
  });

  const mapFeaturedMeal = (item: BackendHomeChefMenuItem): Meal => ({
    id: `home-chef-${item.id}`,
    title: item.title,
    description: item.description,
    price: Number(item.price),
    image: item.image_url || DEFAULT_CHEF_PROFILE.image,
    rating: "Home Chef",
    tag: item.category,
  });

  const loadChefState = async (userId: number) => {
    const [dashboard, orders, menu, profile] = await Promise.all([
      apiGetChefDashboard(userId),
      apiGetChefOrders(userId),
      apiGetChefMenu(userId),
      apiGetChefProfile(userId),
    ]);

    setChefOrders(orders.map(mapChefOrder));
    setChefMenuItems(menu.map(mapChefMenuItem));
    setChefProfile({
      kitchenName: profile.kitchen_name,
      ownerName: profile.owner_name || profile.chef_name,
      area: profile.area,
      city: profile.city,
      cuisineTag: profile.cuisine_tag,
      bio: profile.bio || "",
      rating: `${Number(profile.rating || dashboard.stats.rating).toFixed(1)}★`,
      reviewCount: Number(profile.review_count || 0),
      payout: `Total earnings ₹${Number(dashboard.stats.earnings).toLocaleString("en-IN")}`,
      onlineHours: profile.is_active ? "Kitchen is accepting orders" : "Kitchen is offline",
      image: profile.image_url || DEFAULT_CHEF_PROFILE.image,
    });
    setChefOnline(Boolean(profile.is_active));
  };

  const loadFeaturedHomeMeals = async () => {
    try {
      const chefs = await apiGetHomeChefs({});
      const topChefs = chefs.slice(0, 3);
      const menus = await Promise.all(topChefs.map((chef) => apiGetHomeChefMenu(chef.id).catch(() => [])));
      const nextMeals = menus.flat().slice(0, 6).map(mapFeaturedMeal);
      if (nextMeals.length > 0) {
        setFeaturedHomeMeals(nextMeals);
      }
    } catch {
      setFeaturedHomeMeals([]);
    }
  };

  const loadBackendState = async (userId: number) => {
    let usedFallback = false;

    const meals = await apiFetchMeals().catch(() => {
      usedFallback = true;
      return MEALS.map((meal) => ({
        id: Number(meal.id.replace(/\D/g, "")) || Date.now(),
        title: meal.title,
        description: meal.description,
        price: meal.price,
        image_url: meal.image,
        rating: meal.rating,
        tag: meal.tag ?? null,
      })) as BackendMeal[];
    });

    const addresses = await apiListAddresses(userId).catch(() => {
      usedFallback = true;
      return [];
    });

    const wallet = await apiGetWallet(userId).catch(() => {
      usedFallback = true;
      return {
        wallet: { id: 0, user_id: userId, balance: walletBalance, gold_points: walletPoints, updated_at: new Date().toISOString() },
        transactions: [],
        goldHistory: [],
      };
    });

    const orders = await apiGetOrders(userId).catch(() => {
      usedFallback = true;
      return readLocalOrderHistory();
    });

    const plans = await apiGetSubscriptionPlans().catch(() => {
      usedFallback = true;
      return [];
    });

    const mealMap = new Map<string, BackendMeal>();
    meals.forEach((meal) => mealMap.set(meal.title, meal));

    let nextAddresses = addresses.map((address) => ({
      id: String(address.id),
      type: (address.type as SavedAddress["type"]) || "Home",
      fullAddress: address.full_address,
      name: address.name,
      phone: address.phone,
      city: address.city,
      pincode: address.pincode,
      isDefault: Boolean(address.is_default),
    }));

    if (nextAddresses.length === 0 && !usedFallback) {
      const createdAddresses = [];
      for (const address of DEFAULT_ADDRESSES) {
        const created = await apiCreateAddress(userId, {
          type: address.type,
          fullAddress: address.fullAddress,
          name: address.name,
          phone: address.phone,
          city: address.city,
          pincode: address.pincode,
          isDefault: address.isDefault,
        });
        createdAddresses.push({
          id: String(created.id),
          type: (created.type as SavedAddress["type"]) || "Home",
          fullAddress: created.full_address,
          name: created.name,
          phone: created.phone,
          city: created.city,
          pincode: created.pincode,
          isDefault: Boolean(created.is_default),
        });
      }
      nextAddresses = createdAddresses;
    }

    setBackendUserId(userId);
    setBackendMealsByTitle(mealMap);
    setSavedAddresses(nextAddresses.length > 0 ? nextAddresses : DEFAULT_ADDRESSES);
    setSelectedAddressId(
      nextAddresses.find((address) => address.isDefault)?.id ?? nextAddresses[0]?.id ?? null
    );
    setBackendReady(true);
    setBackendError(usedFallback ? "Backend unavailable right now. Using local demo order mode." : "");
    setSubscriptionPlans(plans);
    const localOrders = readLocalOrderHistory();
    setBackendOrders(orders.length > 0 ? orders : localOrders);

    const walletRow = wallet.wallet;
    setWalletBalance(Number(walletRow.balance));
    setWalletPoints(Number(walletRow.gold_points));
    setWalletTransactions(
      wallet.transactions.map((tx) => ({
        id: String(tx.id),
        title: tx.title,
        dateTime: new Date(tx.created_at).toLocaleString(),
        amount: Number(tx.amount),
        status: tx.status as WalletTransaction["status"],
        kind: tx.kind,
      }))
    );
    setGoldHistory(
      wallet.goldHistory.map((tx) => ({
        id: String(tx.id),
        title: tx.title,
        dateTime: new Date(tx.created_at).toLocaleString(),
        points: Number(tx.points),
        kind: tx.kind,
      }))
    );

    const localDeliveryHistory = readLocalDeliveryHistory();
    const latestOrderCode = (orders[0]?.order_code ?? localOrders[0]?.order_code) || "";
    const latestDelivery = localDeliveryHistory[latestOrderCode];
    if (latestDelivery) {
      setDeliverySnapshot(latestDelivery);
    }

    return {
      userId,
      mealsByTitle: mealMap,
      addresses: nextAddresses.length > 0 ? nextAddresses : DEFAULT_ADDRESSES,
    };
  };

  useEffect(() => {
    let cancelled = false;

    const syncBackendState = async () => {
      try {
        if (!authUser) return;
        await loadBackendState(authUser.id);
        if (!cancelled) {
          setBackendReady(true);
          setBackendError("");
        }
      } catch (error) {
        if (!cancelled) {
          setBackendError(error instanceof Error ? error.message : "Backend sync failed.");
          setBackendReady(false);
        }
      }
    };

    void syncBackendState();

    return () => {
      cancelled = true;
    };
  }, [authUser]);

  useEffect(() => {
    void loadFeaturedHomeMeals();
  }, [chefMenuItems.length]);

  useEffect(() => {
    if (!authUser || authUser.role === "chef") return;
    if (!["#order-history", "#tracking", "#order-confirmation", "#home"].includes(route)) return;

    let cancelled = false;
    const refreshCustomerOrders = async () => {
      try {
        const orders = await apiGetOrders(authUser.id);
        if (cancelled) return;
        setBackendOrders(orders);
        if (orders[0]) {
          setDeliverySnapshot(buildDeliverySnapshotFromOrder(orders[0]));
        }
      } catch {
        if (!cancelled) {
          setBackendOrders(readLocalOrderHistory());
        }
      }
    };

    void refreshCustomerOrders();
    const interval = window.setInterval(refreshCustomerOrders, 3000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [authUser, route, deliveryInstruction, deliveryNote]);

  useEffect(() => {
    let cancelled = false;

    const syncChefState = async () => {
      if (!authUser || authUser.role !== "chef") return;
      try {
        await loadChefState(authUser.id);
      } catch (error) {
        if (!cancelled) {
          setBackendError(error instanceof Error ? error.message : "Chef backend sync failed.");
        }
      }
    };

    void syncChefState();

    return () => {
      cancelled = true;
    };
  }, [authUser]);

  const addToCart = (meal: Meal) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === meal.id);
      if (existing) {
        return prev.map((item) =>
          item.id === meal.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: meal.id,
          title: meal.title,
          price: meal.price,
          quantity: 1,
        },
      ];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const getCouponDiscount = (total: number, coupon: Coupon | null) => {
    if (!coupon || total <= 0) {
      return 0;
    }
    if (coupon.min && total < coupon.min) {
      return 0;
    }
    if (coupon.type === "flat") {
      return Math.min(coupon.value, total);
    }
    const raw = Math.round((total * coupon.value) / 100);
    if (coupon.max) {
      return Math.min(raw, coupon.max);
    }
    return raw;
  };

  const discount = getCouponDiscount(cartTotal, appliedCoupon);
  const couponNotApplicable =
    !!appliedCoupon && cartTotal > 0 && discount === 0 && appliedCoupon.min !== undefined;

  const handleCouponChange = (value: string) => {
    setCouponInput(value);
    if (couponError) {
      setCouponError("");
    }
    if (appliedCoupon && value.trim().toUpperCase() !== appliedCoupon.code) {
      setAppliedCoupon(null);
    }
  };

  const handleApplyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setCouponError("Please enter a coupon code.");
      setAppliedCoupon(null);
      return;
    }
    const match = COUPONS.find((coupon) => coupon.code === trimmed);
    if (!match) {
      setCouponError("Invalid coupon code.");
      setAppliedCoupon(null);
      return;
    }
    setCouponInput(trimmed);
    setAppliedCoupon(match);
    setCouponError("");
    setWalletPoints((prev) => prev + 5);
    setGoldHistory((prev) => [
      {
        id: `GLD-OFFER-${Date.now()}`,
        title: "Offer Usage Bonus",
        dateTime: new Date().toLocaleString(),
        points: 5,
        kind: "earned",
      },
      ...prev,
    ]);
  };

  const handleClearCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    setCouponInput("");
  };

  const handlePlaceOrder = async (address: string, payment: string, walletUsed: number) => {
    let userId = authUser?.id ?? backendUserId;
    const resolvedUserId = userId ?? authUser?.id ?? 0;
    let mealLookup = backendMealsByTitle;
    let addressList = savedAddresses;
    const fallbackAddressId = Number(selectedAddressId ?? addressList[0]?.id ?? Date.now());
    const createdDeliverySnapshot = buildDeliverySnapshot(`ORD-${Date.now()}`);

    if (!backendReady || !userId || mealLookup.size === 0 || addressList.length === 0) {
      try {
        const backendState = await loadBackendState(resolvedUserId);
        userId = backendState.userId;
        mealLookup = backendState.mealsByTitle;
        addressList = backendState.addresses;
      } catch (error) {
        setBackendError(error instanceof Error ? error.message : "Backend sync failed.");
        setBackendReady(false);
      }
    }

    const addressRecord = addressList.find((item) => {
      const displayAddress = `${item.fullAddress}, ${item.city} - ${item.pincode}`;
      return displayAddress === address || item.fullAddress === address;
    });

    const addressId = Number(selectedAddressId ?? addressRecord?.id ?? fallbackAddressId);
    const hasValidBackendAddressId = Number.isFinite(addressId) && addressId > 0;

    try {
      const backendItems = cartItems.map((item) => {
        const meal = mealLookup.get(item.title);
        if (!meal) {
          const fallbackMeal = MEALS.find((entry) => entry.title === item.title);
          if (!fallbackMeal) {
            throw new Error(`Missing meal mapping for "${item.title}".`);
          }
          return {
            mealId: Number(fallbackMeal.id.replace(/\D/g, "")) || Date.now(),
            quantity: item.quantity,
          };
        }
        return {
          mealId: meal.id,
          quantity: item.quantity,
        };
      });

      if (!hasValidBackendAddressId || !backendReady) {
        throw new Error("Falling back to local order mode.");
      }

      const created = await apiPlaceOrder(userId ?? resolvedUserId, {
        items: backendItems,
        addressId,
        paymentMethod: payment,
        couponCode: appliedCoupon?.code ?? couponInput.trim(),
        walletUsed,
      });

      const deliveryForOrder = {
        ...createdDeliverySnapshot,
        trackingId: created.order_code,
        orderStatus: "Chef preparing your food",
      };
      const nextOrder: Order = {
        id: created.order_code,
        items: cartItems,
        total: Number(created.total),
        address,
        payment,
        placedAt: new Date(created.created_at).toLocaleString(),
        delivery: deliveryForOrder,
      };
      const deliveryHistory = readLocalDeliveryHistory();
      deliveryHistory[created.order_code] = deliveryForOrder;
      writeLocalDeliveryHistory(deliveryHistory);
      setDeliverySnapshot(deliveryForOrder);
      setOrder(nextOrder);
      setCartItems([]);
      await loadBackendState(userId ?? resolvedUserId);
      setBackendError("");
      window.location.hash = "#order-confirmation";
    } catch (error) {
      const fallbackOrderCode = `ORD-LOCAL-${Date.now()}`;
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const fallbackDiscount = discount;
      const fallbackTotal = Math.max(0, subtotal - fallbackDiscount);
      const fallbackItems = cartItems.map((item) => {
        const meal = MEALS.find((entry) => entry.title === item.title);
        return {
          mealId: meal ? Number(meal.id.replace(/\D/g, "")) || Date.now() : Date.now(),
          quantity: item.quantity,
          price: item.price,
          title: item.title,
        };
      });
      const localOrderRecord = makeLocalOrder({
        orderCode: fallbackOrderCode,
        addressId: hasValidBackendAddressId ? addressId : Number(Date.now() % 100000),
        paymentMethod: payment,
        subtotal,
        discount: fallbackDiscount,
        total: fallbackTotal,
        items: fallbackItems,
        delivery: {
          ...createdDeliverySnapshot,
          trackingId: fallbackOrderCode,
        },
      });
      const existingOrders = readLocalOrderHistory();
      writeLocalOrderHistory([localOrderRecord, ...existingOrders]);
      const deliveryHistory = readLocalDeliveryHistory();
      deliveryHistory[fallbackOrderCode] = localOrderRecord.delivery ?? createdDeliverySnapshot;
      writeLocalDeliveryHistory(deliveryHistory);
      setOrder({
        id: fallbackOrderCode,
        items: cartItems,
        total: fallbackTotal,
        address,
        payment,
        placedAt: new Date().toLocaleString(),
        delivery: localOrderRecord.delivery,
      });
      setDeliverySnapshot(localOrderRecord.delivery ?? createdDeliverySnapshot);
      setBackendOrders([localOrderRecord, ...existingOrders]);
      setCartItems([]);
      setBackendError("Backend is offline right now. Your order was saved in demo mode.");
      window.location.hash = "#order-confirmation";
    }
  };

  const handleWalletAddMoney = async (amount: number, method: WalletPaymentMethod) => {
    if (!authUser && !backendUserId) return;
    const userId = authUser?.id ?? backendUserId;
    if (!userId) return;
    await apiAddMoney(userId, { amount, method });
    await loadBackendState(userId);
  };

  const handleRedeemGold = async (reward: "discount50" | "freeDelivery" | "cashback") => {
    const userId = authUser?.id ?? backendUserId;
    if (!userId) {
      return { ok: false, message: "Please log in first." };
    }
    try {
      await apiRedeemGold(userId, { reward });
      await loadBackendState(userId);
      return { ok: true, message: "Reward redeemed successfully!" };
    } catch (error) {
      return {
        ok: false,
        message: error instanceof Error ? error.message : "Failed to redeem reward.",
      };
    }
  };

  const handleSaveAddress = async (address: SavedAddress) => {
    const userId = authUser?.id ?? backendUserId;
    if (!userId) {
      throw new Error("Backend user is not ready yet.");
    }

    const created = await apiCreateAddress(userId, {
      type: address.type,
      fullAddress: address.fullAddress,
      name: address.name,
      phone: address.phone,
      city: address.city,
      pincode: address.pincode,
      isDefault: address.isDefault,
    });

    const nextAddress: SavedAddress = {
      id: String(created.id),
      type: (created.type as SavedAddress["type"]) || "Home",
      fullAddress: created.full_address,
      name: created.name,
      phone: created.phone,
      city: created.city,
      pincode: created.pincode,
      isDefault: Boolean(created.is_default),
    };

    setSavedAddresses((prev) => {
      const exists = prev.some((item) => item.id === nextAddress.id);
      if (exists) {
        return prev.map((item) => (item.id === nextAddress.id ? { ...item, ...nextAddress } : item));
      }
      return [nextAddress, ...prev];
    });
    setSelectedAddressId(nextAddress.id);
  };

  const handleDeleteAddress = (id: string) => {
    const userId = authUser?.id ?? backendUserId;
    if (userId && Number.isFinite(Number(id))) {
      void apiDeleteAddress(userId, Number(id));
    }
    setSavedAddresses((prev) => prev.filter((item) => item.id !== id));
    setSelectedAddressId((prev) => (prev === id ? null : prev));
  };

  const handleClaimReferralReward = async (cash: number, gold: number, source: string) => {
    const userId = authUser?.id ?? backendUserId;
    if (!userId) return;
    await apiApplyReferralReward(userId, { source, cash, gold });
    await loadBackendState(userId);
  };

  const handleCreateSubscription = async () => {
    const userId = authUser?.id ?? backendUserId;
    if (!userId) {
      setSubscriptionError("Please log in first.");
      return;
    }
    if (!subscriptionPlan) {
      setSubscriptionError("Please choose a subscription plan.");
      return;
    }

    const selectedPaymentMethod = subscriptionPayment || "UPI";
    const backendPlan = subscriptionPlans.find((plan) => plan.name === subscriptionPlan.title);
    const selectedAddress = savedAddresses.find((address) => address.id === selectedAddressId) ?? null;
    const numericAddressId = Number(selectedAddressId ?? savedAddresses[0]?.id);
    const hasBackendAddressId = Number.isFinite(numericAddressId) && numericAddressId > 0;
    const addressIdForResult = hasBackendAddressId ? numericAddressId : Number(Date.now() % 100000);

    let created: BackendCreatedSubscription | LocalSubscriptionSnapshot;
    if (backendPlan && hasBackendAddressId) {
      try {
        created = await apiCreateSubscription(userId, {
          planId: backendPlan.id,
          addressId: numericAddressId,
          paymentMethod: selectedPaymentMethod,
        });
        await loadBackendState(userId);
      } catch {
        created = buildLocalSubscriptionResult(
          userId,
          subscriptionPlan,
          addressIdForResult,
          selectedPaymentMethod,
          backendPlan.id
        );
        writeLocalSubscriptionHistory([
          ...readLocalSubscriptionHistory().filter((item) => item.id !== created.id),
          created,
        ]);
      }
    } else {
      created = buildLocalSubscriptionResult(
        userId,
        subscriptionPlan,
        addressIdForResult,
        selectedPaymentMethod,
        backendPlan?.id ?? 0
      );
      writeLocalSubscriptionHistory([
        ...readLocalSubscriptionHistory().filter((item) => item.id !== created.id),
        created,
      ]);
    }

    setSubscriptionResult(created);
    if (!subscriptionAddress.trim() && selectedAddress) {
      setSubscriptionAddress(selectedAddress.fullAddress);
    }
    setSubscriptionError("");
    window.location.hash = "#subscription-confirmation";
  };

  const handleLogout = () => {
    window.localStorage.removeItem("dabba_user");
    window.localStorage.removeItem(ENTRY_MODE_KEY);
    window.localStorage.removeItem(LOCAL_ORDER_HISTORY_KEY);
    window.localStorage.removeItem(LOCAL_DELIVERY_HISTORY_KEY);
    window.localStorage.removeItem(LOCAL_SUBSCRIPTION_HISTORY_KEY);
    setAuthUser(null);
    setBackendReady(false);
    setBackendUserId(null);
    setBackendMealsByTitle(new Map());
    setSubscriptionPlans([]);
    setBackendOrders([]);
    setSubscriptionPlan(null);
    setSubscriptionAddress("");
    setSubscriptionPayment("");
    setSubscriptionResult(null);
    setSubscriptionError("");
    setSubscriptionDelivery(null);
    setSavedAddresses(DEFAULT_ADDRESSES);
    setSelectedAddressId(DEFAULT_ADDRESSES[0]?.id ?? null);
    setWalletBalance(500);
    setWalletPoints(1200);
    setWalletTransactions([]);
    setGoldHistory([]);
    setChefOrders([]);
    setChefMenuItems([]);
    setChefOnline(true);
    setChefProfile(DEFAULT_CHEF_PROFILE);
    setFeaturedHomeMeals([]);
    setCartItems([]);
    setOrder(null);
    setDeliverySnapshot(null);
    window.location.hash = "#login";
  };

  const handleChefOrderAction = async (orderId: string, nextStatus: ChefOrderStatus) => {
    const userId = authUser?.id ?? backendUserId;
    const chefUserId = typeof userId === "number" ? userId : null;
    const orderIdNumber = Number(orderId);
    const canSyncBackend = chefUserId !== null && authUser?.role === "chef" && Number.isFinite(orderIdNumber);

    setChefOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order))
    );

    if (canSyncBackend && chefUserId !== null) {
      try {
        await apiUpdateChefOrderStatus(chefUserId, orderIdNumber, { status: nextStatus });
        await loadChefState(chefUserId);
        return;
      } catch (error) {
        setBackendError(error instanceof Error ? error.message : "Failed to update chef order.");
        setChefOrders((prev) =>
          prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order))
        );
      }
    }
  };

  const handleChefToggleMenuItem = async (itemId: string) => {
    const current = chefMenuItems.find((item) => item.id === itemId);
    const userId = authUser?.id ?? backendUserId;
    if (current && userId && authUser?.role === "chef" && Number.isFinite(Number(itemId))) {
      try {
        await apiUpdateChefMenuItem(userId, Number(itemId), { isAvailable: !current.available });
      } catch (error) {
        setBackendError(error instanceof Error ? error.message : "Failed to update menu item.");
      }
    }
    setChefMenuItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, available: !item.available } : item))
    );
  };

  const handleChefAddMenuItem = async (
    name: string,
    category: string,
    price: string,
    description: string,
    image: string
  ) => {
    const trimmedName = name.trim();
    if (!trimmedName || !price.trim()) {
      return;
    }
    const normalizedPrice = Number(price.replace(/[^\d.]/g, ""));
    const userId = authUser?.id ?? backendUserId;
    if (userId && authUser?.role === "chef" && Number.isFinite(normalizedPrice) && normalizedPrice > 0) {
      try {
        const created = await apiCreateChefMenuItem(userId, {
          title: trimmedName,
          category: category.trim() || "General",
          price: normalizedPrice,
          description: description.trim() || trimmedName,
          image_url: image || null,
        });
        setChefMenuItems((prev) => [
          mapChefMenuItem(created),
          ...prev,
        ]);
        return;
      } catch (error) {
        setBackendError(error instanceof Error ? error.message : "Failed to create menu item.");
      }
    }
    setChefMenuItems((prev) => [
      {
        id: `menu-${Date.now()}`,
        name: trimmedName,
        description: description.trim() || trimmedName,
        price: price.trim().startsWith("₹") ? price.trim() : `₹${price.trim()}`,
        stock: 10,
        category: category.trim() || "General",
        available: true,
        image: image || DEFAULT_CHEF_PROFILE.image,
      },
      ...prev,
    ]);
  };

  const handleChefUpdateMenuItem = async (
    itemId: string,
    updates: { name: string; category: string; price: string; description: string; image: string }
  ) => {
    const normalizedPrice = Number(updates.price.replace(/[^\d.]/g, ""));
    const userId = authUser?.id ?? backendUserId;
    if (userId && authUser?.role === "chef" && Number.isFinite(Number(itemId))) {
      try {
        const updated = await apiUpdateChefMenuItem(userId, Number(itemId), {
          title: updates.name.trim(),
          category: updates.category.trim() || "General",
          price: normalizedPrice,
          description: updates.description.trim() || updates.name.trim(),
          image_url: updates.image || null,
        });
        setChefMenuItems((prev) =>
          prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  name: updated.title ?? updates.name,
                  description: updated.description ?? updates.description,
                  category: updated.category ?? updates.category,
                  price: `₹${Number(updated.price ?? normalizedPrice)}`,
                  image: updated.image_url ?? (updates.image || item.image),
                  available: updated.is_available !== undefined ? Boolean(updated.is_available) : item.available,
                }
              : item
          )
        );
        return;
      } catch (error) {
        setBackendError(error instanceof Error ? error.message : "Failed to update menu item.");
      }
    }

    setChefMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              name: updates.name,
              description: updates.description,
              category: updates.category,
              price: updates.price.startsWith("₹") ? updates.price : `₹${updates.price}`,
              image: updates.image || item.image,
            }
          : item
      )
    );
  };

  const handleChefDeleteMenuItem = async (itemId: string) => {
    const userId = authUser?.id ?? backendUserId;
    if (userId && authUser?.role === "chef" && Number.isFinite(Number(itemId))) {
      try {
        await apiDeleteChefMenuItem(userId, Number(itemId));
      } catch (error) {
        setBackendError(error instanceof Error ? error.message : "Failed to delete menu item.");
      }
    }
    setChefMenuItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleChefSaveProfile = async (payload: {
    ownerName: string;
    kitchenName: string;
    area: string;
    city: string;
    cuisineTag: string;
    bio: string;
    image: string;
  }) => {
    const userId = authUser?.id ?? backendUserId;
    if (!userId) return;

    const nextProfile = {
      ...chefProfile,
      ownerName: payload.ownerName,
      kitchenName: payload.kitchenName,
      area: payload.area,
      city: payload.city,
      cuisineTag: payload.cuisineTag,
      bio: payload.bio,
      image: payload.image || chefProfile.image,
    };

    if (authUser?.role === "chef") {
      try {
        const updated: BackendChefProfile = await apiUpdateChefProfile(userId, {
          chefName: payload.ownerName,
          kitchenName: payload.kitchenName,
          area: payload.area,
          city: payload.city,
          cuisineTag: payload.cuisineTag,
          bio: payload.bio,
          image_url: payload.image || null,
        });
        setChefProfile({
          ...nextProfile,
          ownerName: updated.owner_name || updated.chef_name,
          kitchenName: updated.kitchen_name,
          area: updated.area,
          city: updated.city,
          cuisineTag: updated.cuisine_tag,
          bio: updated.bio || "",
          image: updated.image_url || nextProfile.image,
          rating: `${Number(updated.rating || 0).toFixed(1)}★`,
          reviewCount: Number(updated.review_count || 0),
        });
        setAuthUser((prev) => (prev ? { ...prev, name: payload.ownerName, role: "chef" } : prev));
      } catch (error) {
        setBackendError(error instanceof Error ? error.message : "Failed to save chef profile.");
      }
    } else {
      setChefProfile(nextProfile);
    }

    window.location.hash = "#chef-dashboard";
  };

  const chefRoutes = new Set([
    "#chef-welcome",
    "#chef-dashboard",
    "#chef-orders",
    "#chef-menu",
    "#chef-nearby",
    "#chef-profile",
  ]);

  const renderHome = () => (
    <Home
      onSelectMeal={(meal) => {
        setSelectedMeal(meal);
        window.location.hash = "#meal-detail";
      }}
      onNavigateMeals={() => {
        window.location.hash = "#meals";
      }}
      meals={MEALS}
      featuredHomeMeals={featuredHomeMeals}
      activeOrder={order}
    />
  );

  const renderPage = () => {
    switch (route) {
      case "#home":
        return renderHome();
      case "#customize-meal":
        return (
          <div className="section" id="customize-meal">
            <DailyMealCustomizer />
          </div>
        );
      case "#meals":
        return (
          <Meals
            meals={MEALS}
            onSelectMeal={(meal) => {
              setSelectedMeal(meal);
              window.location.hash = "#meal-detail";
            }}
          />
        );
      case "#meal-detail":
        return (
          <MealDetail
            meal={selectedMeal}
            onAddToCart={(meal) => {
              addToCart(meal);
              window.location.hash = "#cart";
            }}
          />
        );
      case "#subscriptions":
        return (
          <Subscriptions
            backendPlans={subscriptionPlans}
            onSelectPlan={(plan) => {
              setSubscriptionPlan(plan);
              setSubscriptionAddress("");
              setSubscriptionPayment("");
              setSubscriptionResult(null);
              setSubscriptionError("");
              window.location.hash = "#subscription-details";
            }}
          />
        );
      case "#subscription-details":
        return (
          <SubscriptionDetails
            plan={subscriptionPlan}
            onBack={() => {
              window.location.hash = "#subscriptions";
            }}
            onContinue={() => {
              window.location.hash = "#subscription-address";
            }}
          />
        );
      case "#subscription-address":
        return (
          <SubscriptionAddress
            address={subscriptionAddress}
            onAddressChange={setSubscriptionAddress}
            onBack={() => {
              window.location.hash = "#subscription-details";
            }}
            onContinue={() => {
              window.location.hash = "#subscription-payment";
            }}
          />
        );
      case "#subscription-payment":
        return (
          <SubscriptionPayment
            paymentMethod={subscriptionPayment}
            onSelectPayment={setSubscriptionPayment}
            onBack={() => {
              window.location.hash = "#subscription-address";
            }}
            onContinue={async () => {
              await handleCreateSubscription();
            }}
          />
        );
      case "#subscription-confirmation":
        return (
          <SubscriptionConfirmation
            plan={subscriptionPlan}
            address={subscriptionAddress}
            paymentMethod={subscriptionPayment}
            subscriptionResult={subscriptionResult}
            subscriptionError={subscriptionError}
            subscriptionDelivery={subscriptionDelivery}
            onBackToPlans={() => {
              window.location.hash = "#subscriptions";
            }}
          />
        );
      case "#near-me":
        return <NearMe />;
      case "#search":
        return <Search />;
      case "#big-promo":
        return <BigPromo />;
      case "#best-seller":
        return <BestSeller />;
      case "#budget-meal":
        return <BudgetMeal />;
      case "#healthy-food":
        return <HealthyFood />;
      case "#open-24-hours":
        return <Open24Hours />;
      case "#popular":
        return <Popular />;
      case "#more-filters":
        return <MoreFilters />;
      case "#cart":
        return (
          <Cart
            items={cartItems}
            total={cartTotal}
            discount={discount}
            couponCode={couponInput}
            couponError={couponError}
            couponApplied={appliedCoupon}
            couponNotApplicable={couponNotApplicable}
            onCouponChange={handleCouponChange}
            onApplyCoupon={handleApplyCoupon}
            onClearCoupon={handleClearCoupon}
            onIncrease={(id) => updateCartQty(id, 1)}
            onDecrease={(id) => updateCartQty(id, -1)}
            onRemove={removeFromCart}
          />
        );
      case "#tracking":
        return <LiveTrackingPage order={order} delivery={deliverySnapshot} />;
      case "#health":
        return <HealthDashboardPage />;
      case "#corporate":
        return <Corporate />;
      case "#partner":
        return <Partner />;
      case "#chef-welcome":
        return (
          <ChefWelcome
            profile={chefProfile}
            onSave={handleChefSaveProfile}
            onChangeRole={() => {
              window.location.hash = "#choose-role";
            }}
          />
        );
      case "#chef-dashboard":
        return (
          <ChefDashboard
            online={chefOnline}
            orders={chefOrders}
            onToggleOnline={() => setChefOnline((prev) => !prev)}
            onAccept={(orderId) => handleChefOrderAction(orderId, "Accepted")}
            onReject={(orderId) => handleChefOrderAction(orderId, "Rejected")}
            onPreparing={(orderId) => handleChefOrderAction(orderId, "Preparing")}
            onShip={(orderId) => handleChefOrderAction(orderId, "Shipped")}
            onOutForDelivery={(orderId) => handleChefOrderAction(orderId, "Out for Delivery")}
            onDelivered={(orderId) => handleChefOrderAction(orderId, "Delivered")}
            onOpenOrders={() => {
              window.location.hash = "#chef-orders";
            }}
            onOpenMenu={() => {
              window.location.hash = "#chef-menu";
            }}
            onOpenProfile={() => {
              window.location.hash = "#chef-profile";
            }}
            menuItems={chefMenuItems.slice(0, 3)}
            onEditMenuItem={() => {
              window.location.hash = "#chef-menu";
            }}
            onDeleteMenuItem={handleChefDeleteMenuItem}
          />
        );
      case "#chef-orders":
        return (
          <ChefOrders
            orders={chefOrders}
            onAccept={(orderId) => handleChefOrderAction(orderId, "Accepted")}
            onReject={(orderId) => handleChefOrderAction(orderId, "Rejected")}
            onPreparing={(orderId) => handleChefOrderAction(orderId, "Preparing")}
            onShip={(orderId) => handleChefOrderAction(orderId, "Shipped")}
            onOutForDelivery={(orderId) => handleChefOrderAction(orderId, "Out for Delivery")}
            onDelivered={(orderId) => handleChefOrderAction(orderId, "Delivered")}
          />
        );
      case "#chef-menu":
        return (
          <ChefMenu
            items={chefMenuItems}
            onToggleAvailability={handleChefToggleMenuItem}
            onAddItem={handleChefAddMenuItem}
            onUpdateItem={handleChefUpdateMenuItem}
            onDeleteItem={handleChefDeleteMenuItem}
          />
        );
      case "#chef-nearby":
        return <ChefNearby areas={chefAreas} />;
      case "#chef-profile":
        return <ChefProfile profile={chefProfile} online={chefOnline} />;
      case "#order-home-made-food":
        return (
          <OrderHomemadeFood
            userId={authUser?.id ?? backendUserId}
            addresses={savedAddresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
          />
        );
      case "#profile":
        return <Profile />;
      case "#addresses":
        return (
          <ManageAddress
            addresses={savedAddresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
            onSaveAddress={handleSaveAddress}
            onDeleteAddress={handleDeleteAddress}
          />
        );
      case "#favourites":
        return (
          <Favourites
            onAddToCart={(meal) => {
              addToCart(meal);
            }}
          />
        );
      case "#offers":
        return (
          <OffersCoupons
            coupons={COUPONS}
            cartTotal={cartTotal}
            appliedCoupon={appliedCoupon}
            couponCode={couponInput}
            onCouponChange={handleCouponChange}
            onApplyCoupon={handleApplyCoupon}
            onClearCoupon={handleClearCoupon}
          />
        );
      case "#gold":
        return (
          <GharKaGold
            goldPoints={walletPoints}
            history={goldHistory}
            onRedeem={handleRedeemGold}
          />
        );
      case "#refer-earn":
        return <ReferEarn onClaimReward={handleClaimReferralReward} />;
      case "#wallet":
        return (
          <GharKaWallet
            balance={walletBalance}
            points={walletPoints}
            transactions={walletTransactions}
            onAddMoney={handleWalletAddMoney}
          />
        );
      case "#login":
        return (
          <Login
            onSuccess={(user) => {
              setAuthUser(user);
              window.localStorage.setItem("dabba_user", JSON.stringify(user));
              const entryMode = window.localStorage.getItem(ENTRY_MODE_KEY);
              window.location.hash =
                entryMode === "homemade"
                  ? "#order-home-made-food"
                  : entryMode === "chef" || user.role === "chef"
                    ? "#chef-welcome"
                    : "#home";
            }}
          />
        );
      case "#choose-role":
        return (
          <RoleSelect
            onSelectCustomer={() => {
              window.localStorage.removeItem(ENTRY_MODE_KEY);
              window.location.hash = "#login";
            }}
            onSelectHomeChef={() => {
              window.localStorage.setItem(ENTRY_MODE_KEY, "chef");
              if (authUser?.role === "chef") {
                window.location.hash = "#chef-welcome";
                return;
              }
              window.location.hash = "#login";
            }}
            onSelectHomemadeFood={() => {
              window.localStorage.setItem(ENTRY_MODE_KEY, "homemade");
              if (authUser) {
                window.location.hash = "#order-home-made-food";
                return;
              }
              window.location.hash = "#login";
            }}
            onGoBack={() => {
              window.location.hash = "#login";
            }}
          />
        );
      case "#location":
        return (
          <Location
            location={location}
            onSave={(value) => {
              setLocation(value);
              window.location.hash = "#home";
            }}
          />
        );
      case "#notifications":
        return <Notifications />;
      case "#edit-profile":
        return <EditProfile />;
      case "#checkout":
        return (
          <Checkout
            items={cartItems}
            total={cartTotal}
            discount={discount}
            coupons={COUPONS}
            couponCode={couponInput}
            couponError={couponError}
            couponApplied={appliedCoupon}
            couponNotApplicable={couponNotApplicable}
            onCouponChange={handleCouponChange}
            onApplyCoupon={handleApplyCoupon}
            onClearCoupon={handleClearCoupon}
            addresses={savedAddresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
            walletBalance={walletBalance}
            deliveryPartner="Porter"
            estimatedDeliveryTime={deliverySnapshot?.eta ?? "25-35 min"}
            deliveryFee={deliverySnapshot?.fee ?? 29}
            deliveryInstruction={deliveryInstruction}
            deliveryNote={deliveryNote}
            deliveryInstructions={DELIVERY_INSTRUCTIONS}
            deliveryNotes={DELIVERY_NOTES}
            onDeliveryInstructionChange={setDeliveryInstruction}
            onDeliveryNoteChange={setDeliveryNote}
            onPlaceOrder={handlePlaceOrder}
            backendError={backendError}
          />
        );
      case "#order-confirmation":
        return (
          <OrderConfirmation
            order={order}
            delivery={deliverySnapshot}
            onGoHome={() => {
              window.location.hash = "#home";
            }}
          />
        );
      case "#order-history":
        return <OrderHistory orders={backendOrders} delivery={deliverySnapshot} />;
      default:
        return renderHome();
    }
  };

  if (showSplash) {
    return <Splash />;
  }

  const desktopFullWidthRoutes = [
    "#profile",
    "#order-history",
    "#wallet",
    "#favourites",
    "#addresses",
    "#offers",
    "#gold",
    "#edit-profile",
    "#refer-earn",
    "#choose-role",
    "#partner",
    "#chef-welcome",
    "#chef-dashboard",
    "#chef-orders",
    "#chef-menu",
    "#chef-nearby",
    "#chef-profile",
    "#order-home-made-food",
  ];
  const isDesktopFullWidthPage = desktopFullWidthRoutes.includes(route);
  const isChefRoute = chefRoutes.has(route);

  return (
    <div className="app">
      {chefRoutes.has(route) ? (
        <ChefNavbar onLogout={handleLogout} />
      ) : route !== "#login" && route !== "#choose-role" ? (
        <Navbar loggedIn={Boolean(authUser)} />
      ) : null}
      <main
        className={`page ${isDesktopFullWidthPage ? "page--profile-full" : ""} ${
          isChefRoute ? "page--chef-full" : ""
        }`}
      >
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
