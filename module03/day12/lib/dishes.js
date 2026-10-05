export const dishes = [
  {
    id: 'doro-wat',
    name: 'Royal Doro Wat',
    amharic: 'የንጉሥ ዶሮ ወጥ',
    price: 24.00,
    category: 'Signature Wats',
    spiceLevel: 'Spicy 🔥🔥🔥',
    dietary: ['Halal', 'Traditional Heritage'],
    description: 'The crown jewel of Habesha feast tables. Tender free-range chicken legs slow-simmered for hours in caramelized red onions, infused with fiery berbere and spiced herbal butter (niter kibbeh). Served with an organic hard-boiled egg and fresh teff injera.',
    ingredients: ['Free-range chicken drumsticks', 'Single-origin berbere spices', 'Niter kibbeh clarified butter', 'Caramelized shallots', 'Pasture egg', 'Fresh teff injera'],
    preparation: 'Slow-cooked for 4 hours following traditional grandmother recipes from Gondar.'
  },
  {
    id: 'kitfo',
    name: 'Special Gurage Kitfo',
    amharic: 'የጉራጌ ልዩ ክትፎ',
    price: 26.50,
    category: 'Tibs & Grills',
    spiceLevel: 'Medium-Spicy 🔥🔥',
    dietary: ['High Protein', 'Gluten-Free Teff'],
    description: 'A legendary Ethiopian delicacy of hand-minced prime tenderloin warmed gently in herb-infused niter kibbeh and hot mitmita chili powder. Accompanied by fresh house-made ayib (mild curd cheese), steamed spiced gomen (collards), and kocho.',
    ingredients: ['Finely minced prime beef tenderloin', 'Kosoret & herb niter kibbeh', 'Cardamom-rich mitmita', 'Handmade ayib curd', 'Steamed gomen collard greens', 'Kocho flatbread'],
    preparation: 'Available Leb-leb (lightly warmed) or thoroughly cooked to order.'
  },
  {
    id: 'beyaynetu',
    name: 'Grand Yetsom Beyaynetu',
    amharic: 'የጾም በያይነቱ ድግስ',
    price: 21.00,
    category: 'Vegetarian & Fasting',
    spiceLevel: 'Mild to Spicy 🌶️',
    dietary: ['100% Vegan', 'Fasting Tradition', 'Gluten-Free'],
    description: 'A colorful culinary mandala spread across a massive round teff injera. Features misir wat (spicy red lentils), kik alicha (mild turmeric split peas), dinich wat (potato stew), gomen (braised greens), timatim fitfit (tangy tomato salad), and beetroot salad.',
    ingredients: ['Red split lentils', 'Yellow split peas', 'Highland collard greens', 'Cabbage & carrots', 'Spiced beetroot', 'Fresh teff injera'],
    preparation: 'Prepared fresh every morning in accordance with Ethiopian Orthodox fasting traditions.'
  },
  {
    id: 'zilzil-tibs',
    name: 'Zilzil Sizzling Tibs',
    amharic: 'ዝልዝል ጥብስ በሸክላ',
    price: 23.50,
    category: 'Tibs & Grills',
    spiceLevel: 'Mild / Medium 🔥',
    dietary: ['Halal', 'Chef Signature'],
    description: 'Long ribbon-cut tender beef tenderloin seared over roaring high heat with fresh highland rosemary, whole green jalapeños, garlic cloves, and sliced red onions. Delivered sizzling hot in a traditional clay tibs stove.',
    ingredients: ['Prime strip loin ribbons', 'Fresh rosemary sprigs', 'Whole green chili peppers', 'Red onions & garlic', 'Touch of awaze reduction', 'Fresh teff injera'],
    preparation: 'Charred quickly in a wok-like iron skillet to lock in moisture, finished over hot coals.'
  },
  {
    id: 'shiro-tegabino',
    name: 'Claypot Shiro Tegabino',
    amharic: 'ሽሮ ተጋቢኖ በሸክላ',
    price: 18.00,
    category: 'Vegetarian & Fasting',
    spiceLevel: 'Medium 🔥🔥',
    dietary: ['100% Vegan', 'Hearty Comfort'],
    description: 'Fine sun-dried spiced chickpea and broad bean flour slow-whisked with garlic, ginger, and berbere in a rustic clay pot until velvety and bubbling thick. Served intensely hot right from the fire.',
    ingredients: ['Stone-ground chickpea flour', 'Habesha berbere blend', 'Crushed garlic & ginger', 'Extra-virgin olive oil / kibbeh', 'Jalapeño garnish', 'Fresh teff injera'],
    preparation: 'Simmered directly in earthenware clay bowls to maintain bubbling temperature throughout the meal.'
  },
  {
    id: 'jebena-buna',
    name: 'Traditional Jebena Buna Ceremony',
    amharic: 'የጀበና ቡና ሥነ-ሥርዓት',
    price: 14.00,
    category: 'Coffee & Ceremonies',
    spiceLevel: 'Fragrant ☕',
    dietary: ['Ethically Sourced', 'Ceremonial'],
    description: 'The soul of Habesha communal hospitality. Raw Yirgacheffe and Sidamo green coffee beans washed, pan-roasted to deep perfection, freshly ground by hand, and triple-boiled in an authentic black clay jebena. Served with fresh popped corn and natural frankincense aroma.',
    ingredients: ['Single-origin Ethiopian Yirgacheffe beans', 'Highland spring water', 'Freshly popped maize', 'Aromatic frankincense resin', 'Traditional cini cups'],
    preparation: 'Performed tableside following the ancient three-round tradition (Abol, Tona, Baraka).'
  }
];

export async function getDishes() {
  return dishes;
}

export async function getDishById(id) {
  return dishes.find((d) => d.id === id);
}
