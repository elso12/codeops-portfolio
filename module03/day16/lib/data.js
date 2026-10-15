/**
 * lib/data.js
 * In-memory data store for Addis Eats.
 * Provides dishes, pagination, search, and live order tracking store.
 */

export const dishes = [
  {
    id: "dish_001",
    name: "Doro Wat",
    description: "Slow-cooked highland chicken in rich berbere spice sauce with a whole egg.",
    price: 180,
    currency: "ETB",
    category: "Main",
    image: "/images/doro-wat.jpg",
    available: true,
  },
  {
    id: "dish_002",
    name: "Tibs",
    description: "Pan-fried tender beef with rosemary, onions, tomatoes, and jalapeños.",
    price: 200,
    currency: "ETB",
    category: "Main",
    image: "/images/tibs.jpg",
    available: true,
  },
  {
    id: "dish_003",
    name: "Shiro Wat",
    description: "Smooth organic chickpea stew slow-simmered with cardamom and garlic.",
    price: 120,
    currency: "ETB",
    category: "Main",
    image: "/images/shiro.jpg",
    available: true,
  },
  {
    id: "dish_004",
    name: "Kitfo",
    description: "Lean minced beef seasoned with mitmita and herbal spiced niter kibbeh.",
    price: 220,
    currency: "ETB",
    category: "Main",
    image: "/images/kitfo.jpg",
    available: true,
  },
  {
    id: "dish_005",
    name: "Injera Firfir",
    description: "Torn fermented teff injera tossed with fragrant spiced tomato-berbere sauce.",
    price: 90,
    currency: "ETB",
    category: "Breakfast",
    image: "/images/firfir.jpg",
    available: true,
  },
  {
    id: "dish_006",
    name: "Macchiato",
    description: "Highland Yirgacheffe espresso pulled with silky steamed milk foam.",
    price: 40,
    currency: "ETB",
    category: "Drinks",
    image: "/images/macchiato.jpg",
    available: true,
  },
  {
    id: "dish_007",
    name: "Beyaynetu Platter",
    description: "Grand fasting platter: misir wat, gomen, tikil gomen, and beet salad on injera.",
    price: 210,
    currency: "ETB",
    category: "Vegetarian",
    image: "/images/shiro.jpg",
    available: true,
  },
  {
    id: "dish_008",
    name: "Gomen Wat",
    description: "Tender collard greens sautéed with mild ginger, garlic, and wild herbs.",
    price: 110,
    currency: "ETB",
    category: "Vegetarian",
    image: "/images/shiro.jpg",
    available: true,
  },
  {
    id: "dish_009",
    name: "Misir Wat",
    description: "Spiced red split lentils slowly braised in fiery mountain berbere.",
    price: 115,
    currency: "ETB",
    category: "Vegetarian",
    image: "/images/doro-wat.jpg",
    available: true,
  },
  {
    id: "dish_010",
    name: "Derek Tibs",
    description: "Crispy seared ribeye tips served sizzling with awaze dip and mitmita.",
    price: 250,
    currency: "ETB",
    category: "Main",
    image: "/images/tibs.jpg",
    available: true,
  },
  {
    id: "dish_011",
    name: "Spris Juice",
    description: "Fresh layered tropical smoothie with ripe avocado, mango, and papaya puree.",
    price: 75,
    currency: "ETB",
    category: "Drinks",
    image: "/images/macchiato.jpg",
    available: true,
  },
  {
    id: "dish_012",
    name: "Tej Honey Wine",
    description: "Traditional fermented acacia honey wine brewed with gesho leaves.",
    price: 95,
    currency: "ETB",
    category: "Drinks",
    image: "/images/macchiato.jpg",
    available: true,
  },
];

/** In-memory orders store seeded with realistic demo data */
let orders = [
  {
    id: "ord_001",
    userId: "user_demo_001",
    dish: dishes[0], // Doro Wat
    quantity: 2,
    total: 360,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911234567",
    area: "Bole",
    notes: "Extra boiled egg, please.",
    status: "preparing",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ord_002",
    userId: "user_demo_001",
    dish: dishes[1], // Tibs
    quantity: 1,
    total: 200,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911234567",
    area: "Kazanchis",
    notes: "Medium cooked, extra awaze.",
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ord_003",
    userId: "user_demo_001",
    dish: dishes[6], // Beyaynetu Platter
    quantity: 1,
    total: 210,
    currency: "ETB",
    customerName: "Abebe Kebede",
    phone: "0911234567",
    area: "Piassa",
    notes: "No spicy peppers.",
    status: "delivered",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let nextOrderId = 4;

/** @param {string} id */
export function getDishById(id) {
  return dishes.find((d) => d.id === id) ?? null;
}

/** @param {string} [category] */
export function getDishes(category) {
  if (category && category !== "All") {
    return dishes.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }
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
 * Paginated dishes helper
 * @param {{ category?: string, q?: string, page?: number, limit?: number }} options
 */
export function getDishesPaginated({ category, q, page = 1, limit = 4 } = {}) {
  const pageNum = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(1, Number(limit) || 4);

  let filtered = dishes;
  if (category && category !== "All") {
    filtered = filtered.filter((d) => d.category.toLowerCase() === category.toLowerCase());
  }
  if (q && q.trim()) {
    const term = q.trim().toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(term) ||
        d.description.toLowerCase().includes(term) ||
        d.category.toLowerCase().includes(term)
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const startIndex = (pageNum - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  return {
    dishes: items,
    items, // convenience alias
    page: pageNum,
    limit: pageSize,
    total,
    totalPages,
    hasMore: pageNum < totalPages,
  };
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
    updatedAt: new Date().toISOString(),
  };

  orders.push(order);
  return order;
}

/** @param {string} id */
export function getOrderById(id) {
  return orders.find((o) => o.id === id) ?? null;
}

/** @param {string} userId */
export function getOrdersByUser(userId) {
  return orders.filter((o) => o.userId === userId);
}

/** @param {string} id */
export function cancelOrderById(id) {
  const order = orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found");
  order.status = "cancelled";
  order.updatedAt = new Date().toISOString();
  return order;
}

/**
 * Simulate background progress of an order for demonstration of live SWR polling
 * pending -> preparing -> out_for_delivery -> delivered
 * @param {string} id
 */
export function advanceOrderStatus(id) {
  const order = orders.find((o) => o.id === id);
  if (!order || order.status === "cancelled" || order.status === "delivered") {
    return order;
  }
  const statusFlow = ["pending", "preparing", "out_for_delivery", "delivered"];
  const currentIdx = statusFlow.indexOf(order.status);
  if (currentIdx >= 0 && currentIdx < statusFlow.length - 1) {
    order.status = statusFlow[currentIdx + 1];
    order.updatedAt = new Date().toISOString();
  }
  return order;
}
