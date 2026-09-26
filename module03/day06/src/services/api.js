// Addis Eats & Mesob House Menu API Service
const BASE_URL = 'https://addis-eats-backend.onrender.com';

// Primary dish image mappings by slug
export const DISH_IMAGES = {
  'doro-wat': '/dishes/doro-wat.jpg',
  'siga-wat': '/dishes/siga-wat.jpg',
  'beg-alicha-wat': '/dishes/beg-alicha-wat.jpg',
  'shiro-tegamino': '/dishes/shiro.jpg',
  'shiro-bozena': '/dishes/shiro.jpg',
  'siga-derek-tibs': '/dishes/tibs.jpg',
  'awaze-lamb-tibs': '/dishes/tibs.jpg',
  'quanta-firfir': '/dishes/tibs.jpg',
  'chornake-fish-tibs': '/dishes/tibs.jpg',
  'prime-beef-kitfo': '/dishes/kitfo.jpg',
  'gored-gored': '/dishes/kitfo.jpg',
  'kitfo-dulet': '/dishes/kitfo.jpg',
  'full-vegan-beyaynetu': '/dishes/beyaynetu.jpg',
  'misir-wat': '/dishes/beyaynetu.jpg',
  'kik-alicha-wat': '/dishes/beyaynetu.jpg',
  'gomen-collards': '/dishes/beyaynetu.jpg',
  'fresh-timatim-fitfit': '/dishes/beyaynetu.jpg',
  'house-tej-carafe': '/dishes/tej.jpg',
  'jebena-spiced-coffee': '/dishes/coffee.jpg',
  'spiced-habesha-chai': '/dishes/coffee.jpg',
  'great-mesob-feast': '/hero-cover.png'
};

export const DEFAULT_FALLBACK_IMAGE = '/dishes/doro-wat.jpg';

export function getDishImage(dish) {
  if (!dish) return DEFAULT_FALLBACK_IMAGE;

  // 1. Direct slug match
  if (dish.slug && DISH_IMAGES[dish.slug]) return DISH_IMAGES[dish.slug];

  // 2. Direct custom image property match (if non-svg valid photo)
  if (dish.image && dish.image !== DEFAULT_FALLBACK_IMAGE && !dish.image.endsWith('.svg')) return dish.image;
  if (dish.imageUrl && !dish.imageUrl.endsWith('.svg')) return dish.imageUrl;

  // 3. Name & text search (English & Amharic keywords)
  const searchText = `${dish.slug || ''} ${dish.nameEn || ''} ${dish.nameAm || ''} ${dish.name || ''} ${dish.title || ''} ${dish.category || ''}`.toLowerCase();

  if (searchText.includes('doro') || searchText.includes('የዶሮ')) return DISH_IMAGES['doro-wat'];
  if (searchText.includes('beg') || searchText.includes('alicha') || searchText.includes('የበግ')) return DISH_IMAGES['beg-alicha-wat'];
  if (searchText.includes('siga wat') || searchText.includes('የስጋ ወጥ') || (searchText.includes('siga') && searchText.includes('wat'))) return DISH_IMAGES['siga-wat'];

  if (searchText.includes('bozena') || searchText.includes('ቦዘና')) return DISH_IMAGES['shiro-bozena'];
  if (searchText.includes('tegamino') || searchText.includes('ተጋሚኖ')) return DISH_IMAGES['shiro-tegamino'];
  if (searchText.includes('shiro') || searchText.includes('ሽሮ')) return DISH_IMAGES['shiro-tegamino'];

  if (searchText.includes('derek') || searchText.includes('ደረቅ')) return DISH_IMAGES['siga-derek-tibs'];
  if (searchText.includes('awaze') || searchText.includes('አዋዜ')) return DISH_IMAGES['awaze-lamb-tibs'];
  if (searchText.includes('quanta') || searchText.includes('ቋንጣ')) return DISH_IMAGES['quanta-firfir'];
  if (searchText.includes('fish') || searchText.includes('tilapia') || searchText.includes('ዓሳ')) return DISH_IMAGES['chornake-fish-tibs'];
  if (searchText.includes('tibs') || searchText.includes('ጥብስ')) return DISH_IMAGES['siga-derek-tibs'];

  if (searchText.includes('gored') || searchText.includes('ጎረድ')) return DISH_IMAGES['gored-gored'];
  if (searchText.includes('dulet') || searchText.includes('ዱለት')) return DISH_IMAGES['kitfo-dulet'];
  if (searchText.includes('kitfo') || searchText.includes('ክትፎ')) return DISH_IMAGES['prime-beef-kitfo'];

  if (searchText.includes('misir') || searchText.includes('ምስር')) return DISH_IMAGES['misir-wat'];
  if (searchText.includes('kik') || searchText.includes('ክክ')) return DISH_IMAGES['kik-alicha-wat'];
  if (searchText.includes('gomen') || searchText.includes('ጎመን')) return DISH_IMAGES['gomen-collards'];
  if (searchText.includes('fitfit') || searchText.includes('timatim') || searchText.includes('ፍትፍት')) return DISH_IMAGES['fresh-timatim-fitfit'];
  if (searchText.includes('beyaynetu') || searchText.includes('በያይነቱ') || searchText.includes('vegan') || searchText.includes('fasting')) return DISH_IMAGES['full-vegan-beyaynetu'];

  if (searchText.includes('tej') || searchText.includes('ጠጅ') || searchText.includes('mead')) return DISH_IMAGES['house-tej-carafe'];
  if (searchText.includes('coffee') || searchText.includes('jebena') || searchText.includes('ቡና')) return DISH_IMAGES['jebena-spiced-coffee'];
  if (searchText.includes('tea') || searchText.includes('chai') || searchText.includes('shai') || searchText.includes('ሻይ')) return DISH_IMAGES['spiced-habesha-chai'];

  return DEFAULT_FALLBACK_IMAGE;
}

// Fallback seed data in case Render API has a cold-start delay
export const FALLBACK_MENU = [
  {
    id: "menu-1",
    slug: "doro-wat",
    nameEn: "Classic Doro Wat",
    nameAm: "የዶሮ ወጥ",
    category: "Traditional Stews & Wat",
    priceETB: 650,
    spiceLevel: "Fiery Berbere (3/3)",
    isFasting: false,
    isSpecial: true,
    description: "Slow-simmered highland chicken simmered in rich caramelized shallots, 12-spice berbere, and organic niter kibbeh with a hard-boiled egg.",
    ingredients: ["Free-range chicken", "Berbere", "Niter Kibbeh", "Farm Egg", "Red Onions", "Garlic", "Ginger"],
    servings: "Serves 1-2 generously"
  },
  {
    id: "menu-2",
    slug: "siga-wat",
    nameEn: "Prime Siga Wat (Beef Stew)",
    nameAm: "የስጋ ወጥ",
    category: "Traditional Stews & Wat",
    priceETB: 580,
    spiceLevel: "Medium-Hot (2/3)",
    isFasting: false,
    isSpecial: false,
    description: "Tender grass-fed beef chuck cubes slowly braised in deep berbere gravy until meltingly tender.",
    ingredients: ["Prime Beef", "Highland Berbere", "Niter Kibbeh", "Cardamom", "Garlic"],
    servings: "Serves 1"
  },
  {
    id: "menu-3",
    slug: "beg-alicha-wat",
    nameEn: "Beg Alicha Wat (Mild Lamb Stew)",
    nameAm: "የበግ አልጫ ወጥ",
    category: "Traditional Stews & Wat",
    priceETB: 620,
    spiceLevel: "Mild (Turmeric & Ginger)",
    isFasting: false,
    isSpecial: false,
    description: "Fragrant, mild highland lamb stew slow-cooked with fresh ginger, turmeric roots, garlic, and wild rosemary.",
    ingredients: ["Highland Lamb", "Fresh Turmeric", "Ginger", "Clarified Spiced Butter", "Garlic"],
    servings: "Serves 1-2"
  },
  {
    id: "menu-4",
    slug: "shiro-tegamino",
    nameEn: "Clay-Pot Shiro Tegamino",
    nameAm: "ሽሮ ተጋሚኖ",
    category: "Traditional Stews & Wat",
    priceETB: 420,
    spiceLevel: "Medium (1/3)",
    isFasting: true,
    isSpecial: false,
    description: "Spiced chickpea and broad bean stew whipped with herbs and extra virgin seed oil, served boiling hot in earthenware.",
    ingredients: ["Chickpea flour", "Cardamom", "Garlic", "Shallots", "Seed Oil", "Green Chili"],
    servings: "Serves 1"
  },
  {
    id: "menu-5",
    slug: "shiro-bozena",
    nameEn: "Shiro Bozena (Beef Enriched Shiro)",
    nameAm: "ሽሮ ቦዘና",
    category: "Traditional Stews & Wat",
    priceETB: 490,
    spiceLevel: "Medium-Hot (2/3)",
    isFasting: false,
    isSpecial: false,
    description: "Traditional spiced chickpea puree enriched with savoury diced prime beef morsels and fragrant niter kibbeh.",
    ingredients: ["Chickpea Flour", "Beef Bites", "Spiced Butter", "Berbere", "Garlic"],
    servings: "Serves 1"
  },
  {
    id: "menu-6",
    slug: "siga-derek-tibs",
    nameEn: "Crisp Siga Derek Tibs",
    nameAm: "የደረቅ ስጋ ጥብስ",
    tagline: "Crispy pan-fried prime beef with Awaze",
    category: "Tibs & Grills",
    priceETB: 620,
    spiceLevel: "Chef Signature Crisp",
    isFasting: false,
    isSpecial: true,
    description: "Pan-charred pasture beef chunks seared with garden rosemary sprigs, seared jalapeño rounds, served with house Awaze dip.",
    ingredients: ["Prime Tenderloin Beef", "Rosemary", "Jalapeño", "Garlic", "Awaze Paste"],
    servings: "Serves 1"
  },
  {
    id: "menu-7",
    slug: "awaze-lamb-tibs",
    nameEn: "Awaze Lamb Tibs",
    nameAm: "የበግ አዋዜ ጥብስ",
    category: "Tibs & Grills",
    priceETB: 680,
    spiceLevel: "Fiery Hot Awaze (3/3)",
    isFasting: false,
    isSpecial: false,
    description: "Succulent lamb tenderloin morsels wok-fried with our proprietary Awaze chili glaze, red shallots, and fresh thyme.",
    ingredients: ["Highland Lamb", "House Awaze", "Red Onions", "Rosemary", "Butter"],
    servings: "Serves 1"
  },
  {
    id: "menu-8",
    slug: "quanta-firfir",
    nameEn: "Spicy Quanta Firfir",
    nameAm: "የቋንጣ ፍርፍር",
    category: "Tibs & Grills",
    priceETB: 540,
    spiceLevel: "Robust Berbere (2/3)",
    isFasting: false,
    isSpecial: false,
    description: "Sun-dried house-cured highland beef jerky shredded and sautéed in rich berbere butter gravy, laced with shredded teff injera.",
    ingredients: ["House Quanta Jerky", "Teff Injera Pieces", "Berbere", "Niter Kibbeh", "Shallots"],
    servings: "Serves 1-2"
  },
  {
    id: "menu-9",
    slug: "chornake-fish-tibs",
    nameEn: "Lake Tana Crispy Fish Tibs",
    nameAm: "የዓሳ ጥብስ",
    category: "Tibs & Grills",
    priceETB: 560,
    spiceLevel: "Zesty Lemon & Chili (1/3)",
    isFasting: true,
    isSpecial: false,
    description: "Fresh golden pan-crisped freshwater tilapia chunks dusted with korarima and served with spicy mitmita salt and lime.",
    ingredients: ["Fresh Tilapia fillet", "Korarima", "Lime", "Garlic oil", "Mitmita"],
    servings: "Serves 1"
  },
  {
    id: "menu-10",
    slug: "prime-beef-kitfo",
    nameEn: "Prime Beef Kitfo",
    nameAm: "የከብት ስጋ ክትፎ",
    category: "Raw & Cured Delicacies / Kitfo",
    priceETB: 720,
    spiceLevel: "Choice: Leb-Leb or Raw",
    isFasting: false,
    isSpecial: true,
    description: "Finely minced extra-lean tenderloin beef steeped in warm aromatic herbal butter and fiery orange mitmita spice blend.",
    ingredients: ["Top sirloin", "Niter Kibbeh", "Mitmita", "Cardamom seed powder"],
    servings: "Serves 1"
  },
  {
    id: "menu-11",
    slug: "gored-gored",
    nameEn: "Highland Gored Gored",
    nameAm: "ጎረድ ጎረድ",
    category: "Raw & Cured Delicacies / Kitfo",
    priceETB: 750,
    spiceLevel: "Extra Hot Mitmita (3/3)",
    isFasting: false,
    isSpecial: false,
    description: "Succulent raw tenderloin beef cut into neat geometric bite-sized cubes, rolled in fiery mitmita chili and melted herbal butter.",
    ingredients: ["Raw Prime Tenderloin", "Melted Ghee", "Mitmita", "Awaze dip"],
    servings: "Serves 1"
  },
  {
    id: "menu-12",
    slug: "kitfo-dulet",
    nameEn: "Addis Style Dulet",
    nameAm: "ዱለት",
    category: "Raw & Cured Delicacies / Kitfo",
    priceETB: 580,
    spiceLevel: "Spicy & Tangy (2/3)",
    isFasting: false,
    isSpecial: false,
    description: "Traditional minced beef, tripe, and liver seasoned with finely chopped green peppers, shallots, and fragrant niter kibbeh.",
    ingredients: ["Minced Beef & Offal", "Jalapeño", "Red Onion", "Mitmita", "Niter Kibbeh"],
    servings: "Serves 1"
  },
  {
    id: "menu-13",
    slug: "full-vegan-beyaynetu",
    nameEn: "Full Vegan Beyaynetu Platter",
    nameAm: "የጾም በያይነቱ ድልድል",
    category: "Fasting & Vegan / Tsom",
    priceETB: 480,
    spiceLevel: "Varied Spices (1-2/3)",
    isFasting: true,
    isSpecial: true,
    description: "Grand rainbow tasting platter of Misir Wat, Kik Alicha, braised Gomen, sweet Fosolia with carrots, and Atakilt Wat.",
    ingredients: ["Lentils", "Split peas", "Collard greens", "Carrots & Green beans", "Cabbage & Potatoes"],
    servings: "Serves 1-2 generously"
  },
  {
    id: "menu-14",
    slug: "misir-wat",
    nameEn: "Highland Red Misir Wat",
    nameAm: "የምስር ወጥ",
    category: "Fasting & Vegan / Tsom",
    priceETB: 360,
    spiceLevel: "Warm Berbere (2/3)",
    isFasting: true,
    isSpecial: false,
    description: "Split red lentils simmered gently in rich spiced berbere sauce, caramelized red onions, and cold-pressed sunflower oil.",
    ingredients: ["Red lentils", "Berbere", "Shallots", "Garlic", "Sunflower oil"],
    servings: "Serves 1"
  },
  {
    id: "menu-15",
    slug: "kik-alicha-wat",
    nameEn: "Golden Kik Alicha",
    nameAm: "የክክ አልጫ ወጥ",
    category: "Fasting & Vegan / Tsom",
    priceETB: 340,
    spiceLevel: "Mild Herb Fragrant (1/3)",
    isFasting: true,
    isSpecial: false,
    description: "Yellow split peas slow-cooked to a buttery creaminess with garlic, ginger, and golden turmeric broth.",
    ingredients: ["Yellow split peas", "Turmeric", "Garlic", "Ginger", "White onions"],
    servings: "Serves 1"
  },
  {
    id: "menu-16",
    slug: "gomen-collards",
    nameEn: "Braised Ye'abesha Gomen",
    nameAm: "የሀበሻ ጎመን",
    category: "Fasting & Vegan / Tsom",
    priceETB: 320,
    spiceLevel: "Mild & Savory (1/3)",
    isFasting: true,
    isSpecial: false,
    description: "Tender young collard greens braised with sweet garlic, sliced shallots, and fresh green jalapeños.",
    ingredients: ["Collard greens", "Garlic cloves", "Green chilies", "Onions", "Cold-pressed oil"],
    servings: "Serves 1"
  },
  {
    id: "menu-17",
    slug: "fresh-timatim-fitfit",
    nameEn: "Fresh Timatim Fitfit",
    nameAm: "ቲማቲም ፍትፍት",
    category: "Fasting & Vegan / Tsom",
    priceETB: 280,
    spiceLevel: "Cooling & Tangy (1/3)",
    isFasting: true,
    isSpecial: false,
    description: "Crisp heirloom tomatoes, minced red shallots, and sliced green peppers tossed with torn cold injera and tangy mustard dressing.",
    ingredients: ["Fresh tomatoes", "Injera pieces", "Shallots", "Mustard dressing", "Jalapeño"],
    servings: "Serves 1 (Great as side)"
  },
  {
    id: "menu-18",
    slug: "house-tej-carafe",
    nameEn: "House Fermented Tej (500ml Carafe)",
    nameAm: "የማር ጠጅ",
    category: "Beverages & Tej",
    priceETB: 350,
    spiceLevel: "Pure Sweet Ferment",
    isFasting: true,
    isSpecial: true,
    description: "Traditional golden mead naturally fermented for 21 days with pure highland wildflower honey and bitter gesho wood.",
    ingredients: ["Pure Wild Honey", "Gesho Wood", "Spring Water"],
    servings: "500ml Flask (11% ABV)"
  },
  {
    id: "menu-19",
    slug: "jebena-spiced-coffee",
    nameEn: "Traditional Jebena Coffee",
    nameAm: "የጀበና ቡና",
    category: "Beverages & Tej",
    priceETB: 80,
    spiceLevel: "Smoky & Aromatic",
    isFasting: true,
    isSpecial: false,
    description: "Addis-style freshly roasted Yirgacheffe arabica beans boiled in clay Jebena with a hint of tenadam rue herb.",
    ingredients: ["Yirgacheffe Coffee Beans", "Tenadam Herb (optional)", "Cardamom"],
    servings: "Ceremonial Sini Cup"
  },
  {
    id: "menu-20",
    slug: "spiced-habesha-chai",
    nameEn: "Highland Spiced Shai",
    nameAm: "የቅመም ሻይ",
    category: "Beverages & Tej",
    priceETB: 80,
    spiceLevel: "Cardamom & Cinnamon Infusion",
    isFasting: true,
    isSpecial: false,
    description: "Slow-infused black highland tea leaves brewed with crushed cinnamon bark, fragrant cardamom pods, and cloves.",
    ingredients: ["Black tea leaves", "Cinnamon", "Cardamom", "Cloves", "Ginger root"],
    servings: "Served hot with raw cane sugar"
  }
];

export const FALLBACK_SPECIALS = FALLBACK_MENU.filter(item => item.isSpecial);

function normalizeDish(dish) {
  let ingredients = dish.ingredients;
  if (typeof ingredients === 'string') {
    if (ingredients.includes(',')) {
      ingredients = ingredients.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      const splitItems = ingredients.split(/(?<=[a-z])\s+(?=[A-Z])/).map(s => s.trim()).filter(Boolean);
      ingredients = splitItems.length > 0 ? splitItems : [ingredients];
    }
  } else if (!Array.isArray(ingredients)) {
    ingredients = [];
  }

  const image = dish.image || dish.imageUrl || (dish.slug && DISH_IMAGES[dish.slug]) || getDishImage(dish);

  return {
    ...dish,
    ingredients,
    image
  };
}

export const NORMALIZED_FALLBACK_MENU = FALLBACK_MENU.map(normalizeDish);
export const NORMALIZED_FALLBACK_SPECIALS = NORMALIZED_FALLBACK_MENU.filter(item => item.isSpecial);

// Fetch full menu from backend API with fallback
export async function fetchFullMenu() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(`${BASE_URL}/menu/`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Menu API responded with status ${response.status}`);
    }

    const json = await response.json();
    if (json && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map(normalizeDish);
    }
    return NORMALIZED_FALLBACK_MENU;
  } catch (err) {
    console.warn('Backend API request failed or timed out, using cached menu data:', err.message);
    return NORMALIZED_FALLBACK_MENU;
  }
}

// Fetch specials from backend API with fallback
export async function fetchSpecials() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`${BASE_URL}/menu/specials`, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Specials API responded with status ${response.status}`);
    }

    const json = await response.json();
    if (json && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map(normalizeDish);
    }
    return NORMALIZED_FALLBACK_SPECIALS;
  } catch (err) {
    console.warn('Backend API request failed or timed out, using cached specials data:', err.message);
    return NORMALIZED_FALLBACK_SPECIALS;
  }
}
