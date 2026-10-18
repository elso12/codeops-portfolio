/**
 * lib/data.js
 * In-memory data store for dishes, users, and orders.
 * Simulates a relational database with foreign keys (order.userId -> user.id).
 */

export const dishes = [
  {
    id: "dish_001",
    name: "Doro Wat",
    description: "Slow-cooked tender chicken in rich berbere spice sauce with a hard-boiled egg.",
    price: 180,
    currency: "ETB",
    category: "Main",
    image: "/images/doro-wat.jpg",
    available: true,
  },
  {
    id: "dish_002",
    name: "Tibs",
    description: "Pan-fried beef or lamb with onions, rosemary, tomatoes and jalapenos.",
    price: 200,
    currency: "ETB",
    category: "Main",
    image: "/images/tibs.jpg",
    available: true,
  },
  {
    id: "dish_003",
    name: "Shiro Wat",
    description: "Smooth chickpea stew simmered with garlic and Ethiopian spices — vegan.",
    price: 120,
    currency: "ETB",
    category: "Main",
    image: "/images/shiro.jpg",
    available: true,
  },
  {
    id: "dish_004",
    name: "Kitfo",
    description: "Ethiopian steak tartare seasoned with mitmita and spiced herbal butter (niter kibbeh).",
    price: 220,
    currency: "ETB",
    category: "Main",
    image: "/images/kitfo.jpg",
    available: true,
  },
  {
    id: "dish_005",
    name: "Injera Firfir",
    description: "Torn fermented teff injera tossed with savory berbere stew — classic hearth breakfast.",
    price: 90,
    currency: "ETB",
    category: "Breakfast",
    image: "/images/firfir.jpg",
    available: true,
  },
  {
    id: "dish_006",
    name: "Macchiato",
    description: "Layered Ethiopian espresso pulled with sweet velvety steamed milk foam.",
    price: 40,
    currency: "ETB",
    category: "Drinks",
    image: "/images/macchiato.jpg",
    available: true,
  },
];

/** Mock user accounts with distinct roles */
export const users = [
  {
    id: "user_abebe_001",
    name: "Abebe Kebede",
    email: "abebe@mesobhouse.et",
    password: "customer123",
    role: "customer",
  },
  {
    id: "user_chala_002",
    name: "Chala Tadesse",
    email: "chala@mesobhouse.et",
    password: "customer123",
    role: "customer",
  },
  {
    id: "staff_tigist_001",
    name: "Chef Tigist Mengistu",
    email: "chef@mesobhouse.et",
    password: "kitchen123",
    role: "staff",
  },
];

/**
 * In-memory orders store seeded with records for multiple accounts to test isolation.
 */
let orders = [
  {
    id: "ord_001",
    userId: "user_abebe_001",
    dish: dishes[0], // Doro Wat
    quantity: 2,
    total: 360,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Bole Rwanda",
    notes: "Please add extra injera",
    status: "pending",
    createdAt: "2026-10-15T10:00:00.000Z",
  },
  {
    id: "ord_002",
    userId: "user_abebe_001",
    dish: dishes[2], // Shiro Wat
    quantity: 1,
    total: 120,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Bole Rwanda",
    notes: "Mild spice please",
    status: "completed",
    createdAt: "2026-10-14T15:30:00.000Z",
  },
  {
    id: "ord_003",
    userId: "user_chala_002",
    dish: dishes[3], // Kitfo
    quantity: 1,
    total: 220,
    currency: "ETB",
    customerName: "Chala Tadesse",
    phone: "0922334455",
    area: "Kazanchis",
    notes: "Medium lebleb with kocho",
    status: "pending",
    createdAt: "2026-10-15T11:15:00.000Z",
  },
  {
    id: "ord_004",
    userId: "user_chala_002",
    dish: dishes[1], // Tibs
    quantity: 2,
    total: 400,
    currency: "ETB",
    customerName: "Chala Tadesse",
    phone: "0922334455",
    area: "Kazanchis",
    notes: "Well done lamb tibs",
    status: "preparing",
    createdAt: "2026-10-15T11:45:00.000Z",
  },
];

let nextOrderId = 5;

/** @param {string} id */
export function getDishById(id) {
  return dishes.find((d) => d.id === id) ?? null;
}

/** @param {string} [category] */
export function getDishes(category) {
  if (category) return dishes.filter((d) => d.category === category);
  return dishes;
}

/**
 * Search dishes by query term and optional category
 * @param {string} q
 * @param {string} [category]
 */
export function searchDishes(q, category) {
  const query = (q || "").trim().toLowerCase();
  let list = dishes;
  if (category && category !== "All") {
    list = list.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }
  if (!query) return list;
  return list.filter(
    (d) =>
      d.name.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query) ||
      d.category.toLowerCase().includes(query)
  );
}

/**
 * Authentication lookup
 * @param {string} email
 * @param {string} password
 */
export function authenticateUser(email, password) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const user = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );
  if (!user) return null;
  // Strip password from returned session object
  const { password: _, ...safeUser } = user;
  return safeUser;
}

/** @param {string} id */
export function findUserById(id) {
  const user = users.find((u) => u.id === id);
  if (!user) return null;
  const { password: _, ...safeUser } = user;
  return safeUser;
}

/**
 * @param {{ name: string; phone: string; dishId: string; quantity: number; area: string; notes?: string }} data
 * @param {string} userId
 */
export function createOrder(data, userId) {
  const dish = getDishById(data.dishId);
  if (!dish) throw new Error("Dish not found");

  const order = {
    id: `ord_${String(nextOrderId++).padStart(3, "0")}`,
    userId,
    dish,
    quantity: data.quantity,
    total: dish.price * data.quantity,
    currency: "ETB",
    customerName: data.name,
    phone: data.phone,
    area: data.area,
    notes: data.notes ?? "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  orders.unshift(order);
  return order;
}

/** @param {string} id */
export function getOrderById(id) {
  return orders.find((o) => o.id === id) ?? null;
}

/**
 * Scoped query: returns ONLY orders belonging to the specified userId.
 * Proves isolation between accounts.
 * @param {string} userId
 */
export function getOrdersByUser(userId) {
  return orders.filter((o) => o.userId === userId);
}

/**
 * Kitchen staff query: returns all orders regardless of user.
 * Restricted to staff server-side.
 */
export function getAllOrders() {
  return [...orders];
}

/**
 * Cancels an order. Ownership must already be verified by caller.
 * @param {string} id
 */
export function cancelOrderById(id) {
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found");
  order.status = "cancelled";
  order.updatedAt = new Date().toISOString();
  return order;
}

/**
 * Updates order cooking status (for kitchen staff).
 * @param {string} id
 * @param {'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'} status
 */
export function updateOrderStatusById(id, status) {
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found");
  order.status = status;
  order.updatedAt = new Date().toISOString();
  return order;
}
