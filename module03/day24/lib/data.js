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

/** Mock user accounts with distinct roles — passwords stored as modular PBKDF2-SHA256 salted hashes */
export const users = [
  {
    id: "user_abebe_001",
    name: "Abebe Kebede",
    email: "abebe@mesobhouse.et",
    passwordHash: "$pbkdf2-sha256$i=210000$1f870d9d238ac87535db5550fdd2c3a9$ae08825fcc9f2ad135fd31ce7c5f448c80cece6a0b4644ccb02b1413efa7f4b8",
    role: "customer",
  },
  {
    id: "user_chala_002",
    name: "Chala Tadesse",
    email: "chala@mesobhouse.et",
    passwordHash: "$pbkdf2-sha256$i=210000$25904cde90bc6f86bb4674c61805ff1c$54c8486c6f7503d3e3f8e6e935ef3e71f447652cd1106eb97e19de04cf6ef071",
    role: "customer",
  },
  {
    id: "staff_tigist_001",
    name: "Chef Tigist Mengistu",
    email: "chef@mesobhouse.et",
    passwordHash: "$pbkdf2-sha256$i=210000$57034f1f9460b42338373b1a7205df04$13e7ddf0abb8488be13351e1c8808b0ea01a4066fb25878036ea8af8ed6cc7c7",
    role: "staff",
  },
  {
    id: "user_sara_003",
    name: "Sara Haile",
    email: "sara@mesobhouse.et",
    passwordHash: "$pbkdf2-sha256$i=210000$b8ab8b83ba04153c19634ec49e37a22b$5c212d30e8d768649102edc0767ea802ca7de3e0cea570febb6b379c636899fe",
    role: "customer",
  },
];

/**
 * In-memory orders store seeded with records for multiple accounts to test isolation,
 * multi-neighbourhood distribution, daily volume curves, and pagination.
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
    createdAt: "2026-10-20T11:30:00.000Z",
  },
  {
    id: "ord_002",
    userId: "user_abebe_001",
    dish: dishes[1], // Tibs
    quantity: 3,
    total: 600,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Kazanchis",
    notes: "Spicy lamb tibs with rosemary",
    status: "preparing",
    createdAt: "2026-10-20T09:15:00.000Z",
  },
  {
    id: "ord_003",
    userId: "user_chala_002",
    dish: dishes[3], // Kitfo
    quantity: 2,
    total: 440,
    currency: "ETB",
    customerName: "Chala Tadesse",
    phone: "0922334455",
    area: "Kazanchis",
    notes: "Medium lebleb with kocho",
    status: "pending",
    createdAt: "2026-10-19T18:40:00.000Z",
  },
  {
    id: "ord_004",
    userId: "user_abebe_001",
    dish: dishes[2], // Shiro Wat
    quantity: 2,
    total: 240,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Piassa",
    notes: "Extra garlic and fresh chilies",
    status: "completed",
    createdAt: "2026-10-19T12:20:00.000Z",
  },
  {
    id: "ord_005",
    userId: "user_abebe_001",
    dish: dishes[4], // Injera Firfir
    quantity: 1,
    total: 90,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Sarbet",
    notes: "Traditional morning firfir",
    status: "completed",
    createdAt: "2026-10-18T08:30:00.000Z",
  },
  {
    id: "ord_006",
    userId: "user_chala_002",
    dish: dishes[1], // Tibs
    quantity: 4,
    total: 800,
    currency: "ETB",
    customerName: "Chala Tadesse",
    phone: "0922334455",
    area: "CMC",
    notes: "Corporate dinner platter",
    status: "completed",
    createdAt: "2026-10-18T19:00:00.000Z",
  },
  {
    id: "ord_007",
    userId: "user_abebe_001",
    dish: dishes[3], // Kitfo
    quantity: 3,
    total: 660,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Old Airport",
    notes: "Well seasoned with mitmita",
    status: "completed",
    createdAt: "2026-10-17T14:15:00.000Z",
  },
  {
    id: "ord_008",
    userId: "user_abebe_001",
    dish: dishes[0], // Doro Wat
    quantity: 1,
    total: 180,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Bole Rwanda",
    notes: "Include boiled egg",
    status: "completed",
    createdAt: "2026-10-17T11:00:00.000Z",
  },
  {
    id: "ord_009",
    userId: "user_chala_002",
    dish: dishes[0], // Doro Wat
    quantity: 2,
    total: 360,
    currency: "ETB",
    customerName: "Chala Tadesse",
    phone: "0922334455",
    area: "Gerji",
    notes: "Family weekend lunch",
    status: "completed",
    createdAt: "2026-10-16T13:45:00.000Z",
  },
  {
    id: "ord_010",
    userId: "user_abebe_001",
    dish: dishes[1], // Tibs
    quantity: 2,
    total: 400,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Mexico",
    notes: "Beef tibs with onion and pepper",
    status: "completed",
    createdAt: "2026-10-16T20:10:00.000Z",
  },
  {
    id: "ord_011",
    userId: "user_abebe_001",
    dish: dishes[2], // Shiro Wat
    quantity: 3,
    total: 360,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Sarbet",
    notes: "Clay pot serving requested",
    status: "completed",
    createdAt: "2026-10-15T12:00:00.000Z",
  },
  {
    id: "ord_012",
    userId: "user_chala_002",
    dish: dishes[4], // Injera Firfir
    quantity: 2,
    total: 180,
    currency: "ETB",
    customerName: "Chala Tadesse",
    phone: "0922334455",
    area: "Piassa",
    notes: "Extra spicy sauce",
    status: "completed",
    createdAt: "2026-10-15T09:20:00.000Z",
  },
  {
    id: "ord_013",
    userId: "user_abebe_001",
    dish: dishes[0], // Doro Wat
    quantity: 4,
    total: 720,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Bole Rwanda",
    notes: "Holiday banquet order",
    status: "completed",
    createdAt: "2026-10-14T17:30:00.000Z",
  },
  {
    id: "ord_014",
    userId: "user_abebe_001",
    dish: dishes[5], // Macchiato
    quantity: 3,
    total: 120,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Kazanchis",
    notes: "Hot layered coffee",
    status: "completed",
    createdAt: "2026-10-14T14:10:00.000Z",
  },
  {
    id: "ord_015",
    userId: "user_chala_002",
    dish: dishes[1], // Tibs
    quantity: 1,
    total: 200,
    currency: "ETB",
    customerName: "Chala Tadesse",
    phone: "0922334455",
    area: "Old Airport",
    notes: "Mild tibs",
    status: "completed",
    createdAt: "2026-10-13T19:25:00.000Z",
  },
  {
    id: "ord_016",
    userId: "user_abebe_001",
    dish: dishes[3], // Kitfo
    quantity: 1,
    total: 220,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "CMC",
    notes: "Special ayib on side",
    status: "completed",
    createdAt: "2026-10-13T13:00:00.000Z",
  },
  {
    id: "ord_017",
    userId: "user_abebe_001",
    dish: dishes[1], // Tibs
    quantity: 5,
    total: 1000,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Bole Rwanda",
    notes: "Office catering feast",
    status: "completed",
    createdAt: "2026-10-12T12:45:00.000Z",
  },
  {
    id: "ord_018",
    userId: "user_chala_002",
    dish: dishes[2], // Shiro Wat
    quantity: 2,
    total: 240,
    currency: "ETB",
    customerName: "Chala Tadesse",
    phone: "0922334455",
    area: "Mexico",
    notes: "Garlic shiro with fresh salad",
    status: "completed",
    createdAt: "2026-10-12T11:15:00.000Z",
  },
  {
    id: "ord_019",
    userId: "user_abebe_001",
    dish: dishes[4], // Injera Firfir
    quantity: 2,
    total: 180,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Gerji",
    notes: "Breakfast meetup",
    status: "completed",
    createdAt: "2026-10-11T09:00:00.000Z",
  },
  {
    id: "ord_020",
    userId: "user_abebe_001",
    dish: dishes[0], // Doro Wat
    quantity: 3,
    total: 540,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Piassa",
    notes: "Simmered doro wat with 3 eggs",
    status: "completed",
    createdAt: "2026-10-11T18:20:00.000Z",
  },
  {
    id: "ord_021",
    userId: "user_chala_002",
    dish: dishes[3], // Kitfo
    quantity: 2,
    total: 440,
    currency: "ETB",
    customerName: "Chala Tadesse",
    phone: "0922334455",
    area: "Sarbet",
    notes: "Kitfo roll with gomen",
    status: "completed",
    createdAt: "2026-10-10T20:00:00.000Z",
  },
  {
    id: "ord_022",
    userId: "user_abebe_001",
    dish: dishes[2], // Shiro Wat
    quantity: 1,
    total: 120,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Old Airport",
    notes: "Quick lunch",
    status: "completed",
    createdAt: "2026-10-10T12:30:00.000Z",
  },
  {
    id: "ord_023",
    userId: "user_abebe_001",
    dish: dishes[1], // Tibs
    quantity: 2,
    total: 400,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911223344",
    area: "Kazanchis",
    notes: "Lamb awaze tibs",
    status: "completed",
    createdAt: "2026-10-10T10:15:00.000Z",
  },
];

let nextOrderId = 24;

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

export const DEFAULT_PBKDF2_ITERATIONS = 210000;

/**
 * Derives a PBKDF2-SHA256 password hash in Modular Crypt Format
 * @param {string} password
 * @param {{ salt?: string | Uint8Array, iterations?: number }} [options]
 * @returns {Promise<string>} Format: "$pbkdf2-sha256$i=<iterations>$<saltHex>$<hashHex>"
 */
export async function hashPassword(
  password,
  { salt = null, iterations = DEFAULT_PBKDF2_ITERATIONS } = {}
) {
  const enc = new TextEncoder();
  let saltBytes;
  let saltHex;

  if (salt) {
    if (typeof salt === "string") {
      saltHex = salt;
      const bytes = new Uint8Array(saltHex.length / 2);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(saltHex.substr(i * 2, 2), 16);
      }
      saltBytes = bytes;
    } else {
      saltBytes = salt;
      saltHex = Array.from(saltBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } else {
    saltBytes = crypto.getRandomValues(new Uint8Array(16));
    saltHex = Array.from(saltBytes).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hashHex = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `$pbkdf2-sha256$i=${iterations}$${saltHex}$${hashHex}`;
}

/**
 * Verifies a candidate password against a stored PBKDF2 hash (modular format or legacy)
 * @param {string} password
 * @param {string} storedHash
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== "string") {
    return false;
  }

  // Format 1: Modular Crypt Format ($pbkdf2-sha256$i=...$salt$hash)
  if (storedHash.startsWith("$pbkdf2-sha256$")) {
    const parts = storedHash.split("$").filter(Boolean);
    if (parts.length !== 4) return false;
    const [, iterStr, saltHex, expectedHashHex] = parts;
    const iterMatch = iterStr.match(/^i=(\d+)$/);
    if (!iterMatch) return false;
    const iterations = parseInt(iterMatch[1], 10);
    if (isNaN(iterations) || iterations <= 0) return false;

    const computed = await hashPassword(password, { salt: saltHex, iterations });
    return computed === storedHash;
  }

  // Format 2: Backward-compatible legacy format (<saltHex>:<hashHex> at 10000 iters)
  if (storedHash.includes(":")) {
    const [saltHex, expectedHash] = storedHash.split(":");
    if (!saltHex || !expectedHash) return false;
    const computed = await hashPassword(password, { salt: saltHex, iterations: 10000 });
    const computedHashHex = computed.split("$")[4];
    return computedHashHex === expectedHash;
  }

  return false;
}

/**
 * Authentication lookup with cryptographic PBKDF2 hash verification
 * @param {string} email
 * @param {string} password
 */
export async function authenticateUser(email, password) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user || !user.passwordHash) return null;

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return null;

  // Strip password hash from returned session object
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

/** @param {string} id */
export function findUserById(id) {
  const user = users.find((u) => u.id === id);
  if (!user) return null;
  const { passwordHash: _, ...safeUser } = user;
  return safeUser;
}

/**
 * Register a brand-new user account with PBKDF2 password hashing
 * @param {{ name: string, email: string, phone?: string, password: string }} param0
 */
export async function registerUser({ name, email, phone, password }) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error("An account with this email address already exists.");
  }

  // Hash password with unique salt prior to persistence
  const passwordHash = await hashPassword(password);

  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: (name || "").trim(),
    email: normalizedEmail,
    phone: (phone || "").trim(),
    passwordHash,
    role: "customer",
  };
  users.push(newUser);
  const { passwordHash: _, ...safeUser } = newUser;
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

/**
 * Server-side Aggregation for Addis Eats Dashboard
 * Requirement 1: Aggregate order data in a server component and pass only the summary to client.
 * Returns summarized rows only — raw order rows NEVER cross the network for charts.
 * @param {Array} ordersList
 */
export function aggregateDashboardData(ordersList = []) {
  const totalOrders = ordersList.length;
  const totalRevenue = ordersList.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // 1. Revenue by Neighbourhood summary
  const neighbourhoodMap = new Map();
  for (const order of ordersList) {
    const area = order.area || "Unknown";
    const current = neighbourhoodMap.get(area) || { area, revenue: 0, orderCount: 0 };
    current.revenue += Number(order.total) || 0;
    current.orderCount += 1;
    neighbourhoodMap.set(area, current);
  }

  const revenueByNeighbourhood = Array.from(neighbourhoodMap.values()).sort(
    (a, b) => b.revenue - a.revenue
  );

  // 2. Orders per day line chart summary
  const dateMap = new Map();
  for (const order of ordersList) {
    const d = new Date(order.createdAt);
    const dateKey = !isNaN(d.getTime()) ? d.toISOString().split("T")[0] : "2026-10-20";
    const current = dateMap.get(dateKey) || { date: dateKey, count: 0, revenue: 0 };
    current.count += 1;
    current.revenue += Number(order.total) || 0;
    dateMap.set(dateKey, current);
  }

  const sortedDates = Array.from(dateMap.keys()).sort();
  const ordersPerDay = sortedDates.map((dateKey) => {
    const entry = dateMap.get(dateKey);
    const dateObj = new Date(dateKey + "T00:00:00Z");
    const label = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
      : dateKey;
    return {
      date: dateKey,
      label,
      count: entry.count,
      revenue: entry.revenue,
    };
  });

  const rangeStart = sortedDates[0] || "2026-10-10";
  const rangeEnd = sortedDates[sortedDates.length - 1] || "2026-10-20";
  const rangeLabel =
    ordersPerDay.length > 0
      ? `${ordersPerDay[0]?.label} – ${ordersPerDay[ordersPerDay.length - 1]?.label}, 2026`
      : "Current Period";

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    neighbourhoodCount: revenueByNeighbourhood.length,
    revenueByNeighbourhood,
    ordersPerDay,
    range: {
      start: rangeStart,
      end: rangeEnd,
      label: rangeLabel,
      unit: "Orders / Day",
      currency: "ETB",
    },
  };
}

/**
 * Server-side Order Pagination and Sorting
 * Requirement 6 & 7: Sorting via searchParams, paging with Link elements.
 * Scoped and sliced server-side — only current page items cross the network.
 * @param {Array} ordersList
 * @param {{ page?: number|string, pageSize?: number|string, sort?: string, order?: 'asc'|'desc' }} options
 */
export function paginateAndSortOrders(
  ordersList = [],
  { page = 1, pageSize = 6, sort = "createdAt", order = "desc" } = {}
) {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safePageSize = Math.max(1, parseInt(pageSize, 10) || 6);
  const direction = order === "asc" ? 1 : -1;

  const sorted = [...ordersList].sort((a, b) => {
    switch (sort) {
      case "total":
        return direction * ((Number(a.total) || 0) - (Number(b.total) || 0));
      case "quantity":
        return direction * ((Number(a.quantity) || 0) - (Number(b.quantity) || 0));
      case "customerName":
      case "customer":
        return direction * (a.customerName || "").localeCompare(b.customerName || "");
      case "area":
      case "neighbourhood":
        return direction * (a.area || "").localeCompare(b.area || "");
      case "dish":
        return direction * (a.dish?.name || "").localeCompare(b.dish?.name || "");
      case "status":
        return direction * (a.status || "").localeCompare(b.status || "");
      case "id":
        return direction * (a.id || "").localeCompare(b.id || "");
      case "createdAt":
      case "date":
      default:
        return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
  });

  const totalOrders = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalOrders / safePageSize));
  const activePage = Math.min(safePage, totalPages);
  const startIndex = (activePage - 1) * safePageSize;
  const items = sorted.slice(startIndex, startIndex + safePageSize);

  return {
    items,
    totalOrders,
    totalPages,
    currentPage: activePage,
    pageSize: safePageSize,
    startIndex: totalOrders > 0 ? startIndex + 1 : 0,
    endIndex: Math.min(startIndex + safePageSize, totalOrders),
    sort,
    order: order === "asc" ? "asc" : "desc",
  };
}

