/**
 * lib/data.js
 * In-memory data store — stands in for a real database (Prisma, Drizzle, etc.).
 * In production this module would be replaced by actual DB calls.
 */

export const dishes = [
  {
    id: "dish_001",
    name: "Doro Wat",
    description: "Slow-cooked chicken in rich berbere spice sauce with a whole egg.",
    price: 180,
    currency: "ETB",
    category: "Main",
    image: "/images/doro-wat.jpg",
    available: true,
  },
  {
    id: "dish_002",
    name: "Tibs",
    description: "Pan-fried beef or lamb with onions, tomatoes and jalapeños.",
    price: 200,
    currency: "ETB",
    category: "Main",
    image: "/images/tibs.jpg",
    available: true,
  },
  {
    id: "dish_003",
    name: "Shiro Wat",
    description: "Smooth chickpea stew simmered with Ethiopian spices — vegan.",
    price: 120,
    currency: "ETB",
    category: "Main",
    image: "/images/shiro.jpg",
    available: true,
  },
  {
    id: "dish_004",
    name: "Kitfo",
    description: "Ethiopian steak tartare seasoned with mitmita and spiced butter.",
    price: 220,
    currency: "ETB",
    category: "Main",
    image: "/images/kitfo.jpg",
    available: true,
  },
  {
    id: "dish_005",
    name: "Injera Firfir",
    description: "Torn injera tossed with leftover stew — a classic breakfast.",
    price: 90,
    currency: "ETB",
    category: "Breakfast",
    image: "/images/firfir.jpg",
    available: true,
  },
  {
    id: "dish_006",
    name: "Macchiato",
    description: "Ethiopian espresso pulled with a splash of milk foam.",
    price: 40,
    currency: "ETB",
    category: "Drinks",
    image: "/images/macchiato.jpg",
    available: true,
  },
];

/** Simple in-memory orders store (lost on server restart in dev). */
let orders = [];
let nextOrderId = 1;

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
  return order;
}
