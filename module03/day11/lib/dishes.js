// Addis Eats Menu Data Repository
export const dishes = [
  {
    id: "doro-wat",
    name: "Royal Doro Wat",
    amharic: "የዶሮ ወጥ",
    price: 350,
    category: "Signature Stews",
    spicy: true,
    spiceLevel: "Spicy 🔥🔥🔥",
    dietary: ["Traditional Heritage", "Slow-Cooked"],
    description: "The national pride of Ethiopian festive dining. Slow-simmered tender chicken leg steeped in rich caramelized red onion kibbeh stew, aromatic berbere spices, and served with a hard-boiled egg and fresh sourdough teff injera.",
    ingredients: ["Free-range chicken drumstick", "Organic farm egg", "Single-origin berbere", "Niter kibbeh clarified butter", "Caramelized red shallots"],
    prepTime: "Slow-cooked for 4 hours"
  },
  {
    id: "kitfo",
    name: "Special Gurage Kitfo",
    amharic: "ልዩ የጉራጌ ክትፎ",
    price: 380,
    category: "Tibs & Grills",
    spicy: true,
    spiceLevel: "Medium-Hot 🔥🔥",
    dietary: ["High Protein", "Grass-Fed"],
    description: "Finely minced prime lean beef warmed gently with fragrant spiced clarified butter (niter kibbeh) and cardamom-rich mitmita chili. Served with homemade fresh ayib curd cheese, seasoned gomen greens, and kocho.",
    ingredients: ["Hand-minced prime beef tenderloin", "Mitmita chili blend", "Kosoret herbal butter", "Fresh ayib cheese", "Steamed spiced gomen"],
    prepTime: "Freshly prepared to order (leb-leb or cooked)"
  },
  {
    id: "beyaynetu",
    name: "Grand Fasting Beyaynetu",
    amharic: "የፆም በያይነቱ",
    price: 220,
    category: "Vegetarian",
    spicy: false,
    spiceLevel: "Mild to Medium 🔥",
    dietary: ["100% Vegan", "Fasting Tradition", "Gluten-Free Injera"],
    description: "A vibrant rainbow feast of authentic vegetarian dishes artistically arranged over teff injera: misir wat, yellow split pea alicha, cabbage and carrot fosolia, collard gomen, and tangy beetroot fitfit.",
    ingredients: ["Red split lentils", "Yellow kik peas", "Braised gomen", "Carrots & green beans", "Spiced beetroot salad", "Fresh teff injera"],
    prepTime: "Freshly simmered daily"
  },
  {
    id: "tibs",
    name: "Zilzil Sizzling Tibs",
    amharic: "ዝልዝል ጥብስ",
    price: 340,
    category: "Tibs & Grills",
    spicy: true,
    spiceLevel: "Medium 🔥🔥",
    dietary: ["High Protein", "Signature"],
    description: "Tender strips of premium beef seared over volcanic fire with sweet red onions, garlic, fresh rosemary sprigs, and green jalapeños. Served sizzling hot on a traditional clay burner stove.",
    ingredients: ["Strip loin ribbons", "Fresh highland rosemary", "Green jalapeño chilies", "Red onion", "Awaze reduction sauce"],
    prepTime: "Sizzled to order in iron skillet"
  },
  {
    id: "shiro",
    name: "Claypot Shiro Tegabino",
    amharic: "ሽሮ ተጋቢኖ",
    price: 180,
    category: "Vegetarian",
    spicy: true,
    spiceLevel: "Medium 🔥🔥",
    dietary: ["100% Vegan", "Comfort Food"],
    description: "Stone-ground roasted chickpea flour slow-whisked with garlic, ginger, and berbere in an earthenware clay pot until bubbling thick and velvety. Served piping hot straight from the flame.",
    ingredients: ["Roasted chickpea flour", "Ginger & garlic paste", "Berbere spice blend", "Olive oil / kibbeh", "Fresh green chili"],
    prepTime: "Simmered continuously in clay pot"
  },
  {
    id: "injera-firfir",
    name: "Spiced Injera Firfir",
    amharic: "እንጀራ ፍርፍር",
    price: 160,
    category: "Breakfast & Fasting",
    spicy: true,
    spiceLevel: "Spicy 🔥🔥🔥",
    dietary: ["Vegetarian", "Traditional"],
    description: "Torn pieces of fresh sourdough teff injera tossed into a tangy, simmering berbere sauce with caramelized onions and garlic, absorbing the rich spicy broth.",
    ingredients: ["Teff injera shreds", "Rich berbere sauce", "Garlic & red onions", "Spiced oil"],
    prepTime: "Flash-simmered in skillet"
  },
  {
    id: "buna",
    name: "Traditional Jebena Buna",
    amharic: "የጀበና ቡና",
    price: 60,
    category: "Beverages",
    spicy: false,
    spiceLevel: "Aromatic ☕",
    dietary: ["Single-Origin", "Ceremonial"],
    description: "Authentic Ethiopian coffee ceremony featuring wild highland Yirgacheffe beans pan-roasted to deep aroma, freshly ground, and triple-boiled in a black clay jebena with fresh popcorn and frankincense.",
    ingredients: ["Single-origin green coffee beans", "Pure spring water", "Fresh salted popcorn", "Natural frankincense aroma"],
    prepTime: "Roasted and boiled tableside"
  }
];

export async function getDishes({ delay = 0, error = false } = {}) {
  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  if (error) {
    throw new Error("Failed to load Addis Eats menu. Simulated network/server fault.");
  }
  return dishes;
}

export async function getDishById(id) {
  // Simulating async server data access
  return dishes.find((d) => d.id === id) || null;
}
