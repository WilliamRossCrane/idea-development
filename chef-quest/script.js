/* =========================================================
     RECIPE DATABASE — the "real" recipe + pricing data source.
     In a production build this would come from an API; here it's
     realistic demo data so every screen can be fully interactive.
  ========================================================= */
const recipesDB = {
  "choc-balls": {
    name: "Chocolate Biscuit Balls",
    icon: "🍫",
    tags: ["nut-free", "vegetarian"],
    time: "35 min",
    saved: true,
    savedDate: "Sunday, 30 Aug",
    desc: "A no-bake, 3-ingredient family favourite. Crush, mix, chill and roll — completely nut-free, so it's safe for the whole table.",
    ingredients: [
      {
        id: "ing1",
        name: "Arnott's Arrowroot biscuits (500g)",
        icon: "🍪",
        have: false,
        options: [
          { store: "Woolworths Ormeau", price: 2.5 },
          { store: "Coles Ormeau", price: 2.75 },
          { store: "IGA Ormeau", price: 2.95 },
        ],
      },
      {
        id: "ing2",
        name: "Condensed milk (320g)",
        icon: "🥫",
        have: false,
        options: [
          { store: "Woolworths Ormeau", price: 2.0 },
          { store: "Coles Ormeau", price: 2.2 },
          { store: "Aldi Ormeau", price: 1.85 },
        ],
      },
      {
        id: "ing3",
        name: "Cocoa powder (2 tbsp)",
        icon: "🍫",
        have: true,
        options: [
          { store: "Coles Ormeau", price: 3.5 },
          { store: "Woolworths Ormeau", price: 3.2 },
          { store: "IGA Ormeau", price: 3.8 },
        ],
      },
    ],
    steps: [
      {
        b: "Crush",
        t: "1.5 packets of biscuits into pea-sized pieces; crush the remaining 0.5 packet fine and add to the bowl.",
      },
      {
        b: "Mix",
        t: "stir in the cocoa powder, then pour in the condensed milk and stir until a thick, sticky dough forms.",
      },
      {
        b: "Chill",
        t: "rest the dough in the fridge for 15–20 minutes so it's easier to handle.",
      },
      {
        b: "Roll",
        t: "shape into tablespoon-sized balls, optionally rolling in extra cocoa or biscuit crumbs.",
      },
      { b: "Set", t: "chill for 30 minutes before serving. Store cold." },
    ],
    dietTips: {
      Vegan:
        "Swap condensed milk for coconut condensed milk to make this vegan.",
      "Dairy-free":
        "Use dairy-free condensed milk — the rest of the recipe is already dairy-free.",
      "Gluten-free":
        "Swap in gluten-free arrowroot biscuits — everything else stays the same.",
    },
  },
  "chicken-pesto": {
    name: "Chicken Pesto Pasta",
    icon: "🍝",
    tags: ["under30"],
    time: "25 min",
    saved: true,
    savedDate: "Friday, 28 Aug",
    desc: "A quick weeknight pasta — pan-seared chicken, penne and a bright basil pesto, ready in under 30 minutes.",
    ingredients: [
      {
        id: "p1",
        name: "Penne pasta (500g)",
        icon: "🍝",
        have: false,
        options: [
          { store: "Coles Ormeau", price: 2.9 },
          { store: "Woolworths Ormeau", price: 2.75 },
          { store: "IGA Ormeau", price: 3.1 },
        ],
      },
      {
        id: "p2",
        name: "Chicken breast (500g)",
        icon: "🍗",
        have: false,
        options: [
          { store: "Woolworths Ormeau", price: 8.5 },
          { store: "Coles Ormeau", price: 8.9 },
          { store: "Aldi Ormeau", price: 7.95 },
        ],
      },
      {
        id: "p3",
        name: "Basil pesto jar",
        icon: "🌿",
        have: true,
        options: [
          { store: "Coles Ormeau", price: 4.2 },
          { store: "Woolworths Ormeau", price: 4.5 },
          { store: "IGA Ormeau", price: 4.8 },
        ],
      },
    ],
    steps: [
      {
        b: "Cook",
        t: "boil the penne in salted water until al dente, reserving a splash of pasta water.",
      },
      {
        b: "Sear",
        t: "pan-fry sliced chicken breast until golden and cooked through.",
      },
      {
        b: "Combine",
        t: "toss the drained pasta and chicken through the pesto, loosening with the reserved pasta water.",
      },
    ],
    dietTips: {
      Vegan: "Swap chicken for chickpeas and use a dairy-free pesto.",
      "Dairy-free":
        "Check the pesto label — most jarred pestos contain parmesan, so look for a dairy-free version.",
      "Gluten-free":
        "Use a gluten-free penne — everything else stays the same.",
    },
  },
  "brown-butter-cookies": {
    name: "Brown Butter Cookies",
    icon: "🍪",
    tags: ["vegetarian"],
    time: "40 min",
    saved: true,
    savedDate: "Wednesday, 12 Aug",
    desc: "Classic cookies with a nutty, caramelised edge from browning the butter before mixing.",
    ingredients: [
      {
        id: "c1",
        name: "Butter (250g)",
        icon: "🧈",
        have: false,
        options: [
          { store: "Woolworths Ormeau", price: 5.5 },
          { store: "Coles Ormeau", price: 5.8 },
          { store: "Aldi Ormeau", price: 4.9 },
        ],
      },
      {
        id: "c2",
        name: "Plain flour (1kg)",
        icon: "🌾",
        have: true,
        options: [
          { store: "Coles Ormeau", price: 1.6 },
          { store: "Woolworths Ormeau", price: 1.55 },
          { store: "IGA Ormeau", price: 1.8 },
        ],
      },
      {
        id: "c3",
        name: "Brown sugar (500g)",
        icon: "🍯",
        have: false,
        options: [
          { store: "Woolworths Ormeau", price: 2.2 },
          { store: "Coles Ormeau", price: 2.35 },
          { store: "Aldi Ormeau", price: 1.95 },
        ],
      },
    ],
    steps: [
      {
        b: "Brown",
        t: "melt the butter in a pan until it turns golden and smells nutty, then cool slightly.",
      },
      {
        b: "Mix",
        t: "beat the brown butter with sugar, then fold through the flour to form a dough.",
      },
      {
        b: "Bake",
        t: "scoop onto a tray and bake at 180°C for 10–12 minutes until edges are golden.",
      },
    ],
    dietTips: {
      Vegan:
        "Use a plant-based butter block — the browning step works the same way.",
      "Dairy-free":
        "Same swap as vegan — a dairy-free butter alternative browns similarly.",
      "Gluten-free": "Use a 1:1 gluten-free flour blend.",
    },
  },
  "zucchini-slice": {
    name: "Zucchini Slice",
    icon: "🥒",
    tags: ["nut-free", "gluten-free"],
    time: "45 min",
    saved: true,
    savedDate: "Sunday, 2 Aug",
    desc: "A savoury baked slice packed with grated zucchini, cheese and egg — great hot or cold in lunchboxes.",
    ingredients: [
      {
        id: "z1",
        name: "Zucchini (3 medium)",
        icon: "🥒",
        have: true,
        options: [
          { store: "Woolworths Ormeau", price: 3.0 },
          { store: "Coles Ormeau", price: 3.2 },
          { store: "IGA Ormeau", price: 3.5 },
        ],
      },
      {
        id: "z2",
        name: "Eggs (6 pack)",
        icon: "🥚",
        have: false,
        options: [
          { store: "Coles Ormeau", price: 4.5 },
          { store: "Woolworths Ormeau", price: 4.3 },
          { store: "Aldi Ormeau", price: 3.95 },
        ],
      },
      {
        id: "z3",
        name: "Tasty cheese (250g)",
        icon: "🧀",
        have: false,
        options: [
          { store: "Woolworths Ormeau", price: 5.0 },
          { store: "Coles Ormeau", price: 5.3 },
          { store: "Aldi Ormeau", price: 4.4 },
        ],
      },
    ],
    steps: [
      {
        b: "Grate",
        t: "grate the zucchini and squeeze out excess moisture with a clean tea towel.",
      },
      { b: "Mix", t: "whisk eggs, fold through zucchini and grated cheese." },
      {
        b: "Bake",
        t: "pour into a lined tray and bake at 180°C for 30–35 minutes until set and golden.",
      },
    ],
    dietTips: {
      Vegan:
        "This one's tricky to fully veganise — try a chickpea-flour ('besan') version instead of eggs.",
      "Dairy-free": "Use a dairy-free cheese alternative.",
      "Gluten-free": "Already gluten-free as written.",
    },
  },
  gnocchi: {
    name: "Gnocchi & Sauce",
    icon: "🥟",
    tags: ["vegetarian"],
    time: "30 min",
    saved: false,
    match: "3 of 4 ingredients near you",
    desc: "Soft potato gnocchi tossed through a simple tomato sauce — a cosy, budget-friendly dinner.",
    ingredients: [
      {
        id: "g1",
        name: "Potato gnocchi (500g)",
        icon: "🥟",
        have: false,
        options: [
          { store: "Coles Ormeau", price: 3.5 },
          { store: "Woolworths Ormeau", price: 3.3 },
          { store: "IGA Ormeau", price: 3.8 },
        ],
      },
      {
        id: "g2",
        name: "Tomato passata (700g)",
        icon: "🍅",
        have: true,
        options: [
          { store: "Woolworths Ormeau", price: 2.1 },
          { store: "Coles Ormeau", price: 2.3 },
          { store: "Aldi Ormeau", price: 1.8 },
        ],
      },
      {
        id: "g3",
        name: "Parmesan (100g)",
        icon: "🧀",
        have: false,
        options: [
          { store: "Coles Ormeau", price: 4.8 },
          { store: "Woolworths Ormeau", price: 5.0 },
          { store: "IGA Ormeau", price: 5.3 },
        ],
      },
    ],
    steps: [
      {
        b: "Boil",
        t: "cook the gnocchi in salted boiling water until they float to the top.",
      },
      { b: "Simmer", t: "warm the passata with a pinch of salt and pepper." },
      {
        b: "Toss",
        t: "combine the gnocchi and sauce, topping with grated parmesan.",
      },
    ],
    dietTips: {
      Vegan: "Skip the parmesan or use a plant-based hard cheese.",
      "Dairy-free": "Skip the parmesan topping — the rest is dairy-free.",
      "Gluten-free":
        "Look for a gluten-free gnocchi (often rice or corn based).",
    },
  },
  "chocolate-cake": {
    name: "Chocolate Cake",
    icon: "🎂",
    tags: ["vegetarian"],
    time: "55 min",
    saved: false,
    match: "5 of 6 ingredients near you",
    desc: "A rich, moist chocolate cake for birthdays or a Sunday bake — simple pantry ingredients, big result.",
    ingredients: [
      {
        id: "k1",
        name: "Self-raising flour (500g)",
        icon: "🌾",
        have: true,
        options: [
          { store: "Woolworths Ormeau", price: 1.7 },
          { store: "Coles Ormeau", price: 1.85 },
          { store: "IGA Ormeau", price: 2.0 },
        ],
      },
      {
        id: "k2",
        name: "Cocoa powder (200g)",
        icon: "🍫",
        have: true,
        options: [
          { store: "Coles Ormeau", price: 3.5 },
          { store: "Woolworths Ormeau", price: 3.2 },
          { store: "IGA Ormeau", price: 3.8 },
        ],
      },
      {
        id: "k3",
        name: "Caster sugar (1kg)",
        icon: "🍚",
        have: false,
        options: [
          { store: "Woolworths Ormeau", price: 1.75 },
          { store: "Coles Ormeau", price: 1.9 },
          { store: "Aldi Ormeau", price: 1.55 },
        ],
      },
    ],
    steps: [
      {
        b: "Mix",
        t: "combine flour, cocoa and sugar, then whisk in eggs, milk and oil until smooth.",
      },
      {
        b: "Bake",
        t: "pour into a lined tin and bake at 170°C for about 35 minutes.",
      },
      { b: "Cool", t: "cool completely before icing." },
    ],
    dietTips: {
      Vegan: "Replace eggs with flax eggs and milk with a plant-based milk.",
      "Dairy-free": "Swap milk for a dairy-free alternative.",
      "Gluten-free": "Use a 1:1 gluten-free self-raising flour blend.",
    },
  },
  "butterfly-cupcakes": {
    name: "Butterfly Cupcakes",
    icon: "🧁",
    tags: ["vegetarian"],
    time: "40 min",
    saved: false,
    match: "4 of 5 ingredients near you",
    desc: "Classic vanilla cupcakes topped with cream, cut and arranged into 'butterfly wings'.",
    ingredients: [
      {
        id: "b1",
        name: "Vanilla cake mix / flour base",
        icon: "🧁",
        have: false,
        options: [
          { store: "Woolworths Ormeau", price: 3.5 },
          { store: "Coles Ormeau", price: 3.7 },
          { store: "IGA Ormeau", price: 3.9 },
        ],
      },
      {
        id: "b2",
        name: "Thickened cream (300ml)",
        icon: "🍦",
        have: false,
        options: [
          { store: "Coles Ormeau", price: 2.8 },
          { store: "Woolworths Ormeau", price: 2.7 },
          { store: "Aldi Ormeau", price: 2.4 },
        ],
      },
      {
        id: "b3",
        name: "Icing sugar (500g)",
        icon: "🍬",
        have: true,
        options: [
          { store: "Woolworths Ormeau", price: 1.9 },
          { store: "Coles Ormeau", price: 2.05 },
          { store: "IGA Ormeau", price: 2.2 },
        ],
      },
    ],
    steps: [
      { b: "Bake", t: "bake vanilla cupcakes and cool completely." },
      {
        b: "Cut",
        t: "slice a small circle from the top of each cupcake and halve it for 'wings'.",
      },
      {
        b: "Fill & finish",
        t: "pipe whipped cream into the centre and place the wings on top, dusting with icing sugar.",
      },
    ],
    dietTips: {
      Vegan: "Use a plant-based cake mix and coconut whipped cream.",
      "Dairy-free":
        "Swap thickened cream for a dairy-free whipped alternative.",
      "Gluten-free": "Use a gluten-free cake mix.",
    },
  },
  "spag-bol": {
    name: "Spaghetti Bolognese",
    icon: "🍝",
    tags: ["dairy-free"],
    time: "40 min",
    saved: false,
    match: "Matched from your cupboard scan",
    desc: "A hearty mince and tomato sauce over spaghetti — the ingredients Chef Quest found on your shelf, plus mince.",
    ingredients: [
      {
        id: "s1",
        name: "Spaghetti pasta (500g)",
        icon: "🍝",
        have: true,
        options: [
          { store: "Coles Ormeau", price: 2.6 },
          { store: "Woolworths Ormeau", price: 2.5 },
          { store: "IGA Ormeau", price: 2.9 },
        ],
      },
      {
        id: "s2",
        name: "Tomato passata (700g)",
        icon: "🍅",
        have: true,
        options: [
          { store: "Woolworths Ormeau", price: 2.1 },
          { store: "Coles Ormeau", price: 2.3 },
          { store: "Aldi Ormeau", price: 1.8 },
        ],
      },
      {
        id: "s3",
        name: "Beef mince (500g)",
        icon: "🥩",
        have: false,
        options: [
          { store: "Woolworths Ormeau", price: 7.0 },
          { store: "Coles Ormeau", price: 7.4 },
          { store: "Aldi Ormeau", price: 6.2 },
        ],
      },
    ],
    steps: [
      {
        b: "Brown",
        t: "brown the mince in a large pan with garlic and oregano.",
      },
      { b: "Simmer", t: "add the passata and simmer for 15–20 minutes." },
      {
        b: "Serve",
        t: "toss through cooked spaghetti or serve the sauce on top.",
      },
    ],
    dietTips: {
      Vegan: "Swap mince for a plant-based mince alternative or lentils.",
      "Dairy-free": "Already dairy-free as written.",
      "Gluten-free": "Use a gluten-free spaghetti.",
    },
  },
};

function catalogueIngredient(id, name, icon, have, options) {
  return { id, name, icon, have, options };
}

function catalogueRecipe(
  name,
  icon,
  category,
  tags,
  time,
  desc,
  ingredients,
  steps,
  dietTips,
  match,
) {
  return {
    name,
    icon,
    category,
    tags,
    time,
    saved: false,
    match,
    desc,
    ingredients,
    steps,
    dietTips,
  };
}

Object.assign(recipesDB, {
  "overnight-oats": catalogueRecipe(
    "Overnight Oats",
    "🥣",
    "Breakfast",
    ["vegetarian", "under30"],
    "10 min",
    "A creamy make-ahead breakfast with oats, yoghurt, fruit and a little honey.",
    [
      catalogueIngredient("o1", "Rolled oats (500g)", "🌾", false, [
        { store: "Woolworths Ormeau", price: 2.2 },
        { store: "Coles Ormeau", price: 2.4 },
        { store: "Aldi Ormeau", price: 1.9 },
      ]),
      catalogueIngredient("o2", "Greek yoghurt (500g)", "🥣", true, [
        { store: "Coles Ormeau", price: 4.5 },
        { store: "Woolworths Ormeau", price: 4.7 },
        { store: "Aldi Ormeau", price: 4.0 },
      ]),
      catalogueIngredient("o3", "Banana (1 bunch)", "🍌", false, [
        { store: "Woolworths Ormeau", price: 3.5 },
        { store: "Coles Ormeau", price: 3.5 },
        { store: "IGA Ormeau", price: 4.0 },
      ]),
    ],
    [
      {
        b: "Combine",
        t: "stir oats, yoghurt, sliced banana and a splash of milk in a jar.",
      },
      { b: "Chill", t: "cover and refrigerate overnight." },
      { b: "Serve", t: "top with fruit and enjoy cold." },
    ],
    {
      Vegan: "Use plant-based yoghurt and milk.",
      "Dairy-free": "Use a dairy-free yoghurt and milk alternative.",
      "Gluten-free": "Choose certified gluten-free oats.",
    },
    "Easy breakfast from pantry staples",
  ),
  "banana-pancakes": catalogueRecipe(
    "Banana Pancakes",
    "🥞",
    "Breakfast",
    ["vegetarian"],
    "25 min",
    "Soft banana pancakes with a golden edge, made for a relaxed weekend breakfast.",
    [
      catalogueIngredient("bp1", "Bananas (3)", "🍌", false, [
        { store: "Woolworths Ormeau", price: 3.5 },
        { store: "Coles Ormeau", price: 3.5 },
        { store: "Aldi Ormeau", price: 3.0 },
      ]),
      catalogueIngredient("bp2", "Plain flour (1kg)", "🌾", true, [
        { store: "Coles Ormeau", price: 1.6 },
        { store: "Woolworths Ormeau", price: 1.55 },
        { store: "IGA Ormeau", price: 1.8 },
      ]),
      catalogueIngredient("bp3", "Eggs (6 pack)", "🥚", false, [
        { store: "Coles Ormeau", price: 4.5 },
        { store: "Woolworths Ormeau", price: 4.3 },
        { store: "Aldi Ormeau", price: 3.95 },
      ]),
    ],
    [
      { b: "Mash", t: "mash ripe bananas in a mixing bowl." },
      {
        b: "Whisk",
        t: "add eggs, flour and milk and whisk until just combined.",
      },
      {
        b: "Cook",
        t: "cook spoonfuls in a lightly greased pan until golden on both sides.",
      },
    ],
    {
      Vegan: "Use a flax egg and plant-based milk.",
      "Dairy-free": "Use dairy-free milk and butter for the pan.",
      "Gluten-free": "Use a gluten-free flour blend.",
    },
    "A quick weekend breakfast",
  ),
  "egg-avocado-toast": catalogueRecipe(
    "Egg & Avocado Toast",
    "🥑",
    "Breakfast",
    ["vegetarian", "under30"],
    "15 min",
    "Smashed avocado and a jammy egg on crunchy toast with lemon and pepper.",
    [
      catalogueIngredient("eat1", "Avocado (2)", "🥑", false, [
        { store: "Woolworths Ormeau", price: 2.5 },
        { store: "Coles Ormeau", price: 2.8 },
        { store: "Aldi Ormeau", price: 2.2 },
      ]),
      catalogueIngredient("eat2", "Sourdough bread (loaf)", "🍞", false, [
        { store: "Coles Ormeau", price: 4.5 },
        { store: "Woolworths Ormeau", price: 4.8 },
        { store: "IGA Ormeau", price: 5.0 },
      ]),
      catalogueIngredient("eat3", "Eggs (6 pack)", "🥚", true, [
        { store: "Coles Ormeau", price: 4.5 },
        { store: "Woolworths Ormeau", price: 4.3 },
        { store: "Aldi Ormeau", price: 3.95 },
      ]),
    ],
    [
      { b: "Toast", t: "toast the sourdough until crisp." },
      { b: "Boil", t: "boil eggs for 6–7 minutes, then cool briefly." },
      { b: "Assemble", t: "smash avocado onto toast and top with sliced egg." },
    ],
    {
      Vegan: "Replace egg with seasoned chickpeas or tofu.",
      "Dairy-free": "Already dairy-free as written; check the bread label.",
      "Gluten-free": "Use gluten-free bread.",
    },
    "Fast breakfast with fresh ingredients",
  ),
  "chicken-wrap": catalogueRecipe(
    "Chicken Wrap",
    "🌯",
    "Lunch",
    ["under30"],
    "20 min",
    "A fresh chicken wrap with crunchy salad, creamy dressing and a soft tortilla.",
    [
      catalogueIngredient("cw1", "Chicken breast (500g)", "🍗", false, [
        { store: "Woolworths Ormeau", price: 8.5 },
        { store: "Coles Ormeau", price: 8.9 },
        { store: "Aldi Ormeau", price: 7.95 },
      ]),
      catalogueIngredient("cw2", "Tortilla wraps (8 pack)", "🌯", false, [
        { store: "Coles Ormeau", price: 3.5 },
        { store: "Woolworths Ormeau", price: 3.7 },
        { store: "Aldi Ormeau", price: 3.2 },
      ]),
      catalogueIngredient("cw3", "Salad leaves (bag)", "🥬", true, [
        { store: "Woolworths Ormeau", price: 3.0 },
        { store: "Coles Ormeau", price: 3.2 },
        { store: "IGA Ormeau", price: 3.5 },
      ]),
    ],
    [
      {
        b: "Cook",
        t: "season and pan-cook chicken until golden and cooked through.",
      },
      { b: "Slice", t: "rest the chicken, then slice it into strips." },
      {
        b: "Wrap",
        t: "fill wraps with chicken, salad and dressing, then roll tightly.",
      },
    ],
    {
      Vegan: "Use seasoned tofu or chickpeas instead of chicken.",
      "Dairy-free": "Choose a dairy-free dressing.",
      "Gluten-free": "Use gluten-free wraps.",
    },
    "Lunch-ready chicken and salad",
  ),
  "veggie-rice-bowl": catalogueRecipe(
    "Veggie Rice Bowl",
    "🍚",
    "Lunch",
    ["vegan", "vegetarian", "dairy-free", "gluten-free"],
    "30 min",
    "A colourful rice bowl with roasted vegetables, chickpeas and a lemon dressing.",
    [
      catalogueIngredient("vrb1", "Jasmine rice (1kg)", "🍚", false, [
        { store: "Woolworths Ormeau", price: 3.2 },
        { store: "Coles Ormeau", price: 3.5 },
        { store: "Aldi Ormeau", price: 2.8 },
      ]),
      catalogueIngredient("vrb2", "Chickpeas (400g can)", "🫘", true, [
        { store: "Coles Ormeau", price: 1.2 },
        { store: "Woolworths Ormeau", price: 1.3 },
        { store: "Aldi Ormeau", price: 1.0 },
      ]),
      catalogueIngredient("vrb3", "Seasonal vegetables (500g)", "🥦", false, [
        { store: "Woolworths Ormeau", price: 5.0 },
        { store: "Coles Ormeau", price: 5.5 },
        { store: "IGA Ormeau", price: 6.0 },
      ]),
    ],
    [
      {
        b: "Cook",
        t: "rinse and cook rice according to the packet instructions.",
      },
      {
        b: "Roast",
        t: "roast chopped vegetables until tender and lightly browned.",
      },
      {
        b: "Build",
        t: "layer rice, chickpeas and vegetables with lemon dressing.",
      },
    ],
    {
      Vegan: "Already vegan as written.",
      "Dairy-free": "Already dairy-free as written.",
      "Gluten-free": "Already gluten-free as written; check packaged sauces.",
    },
    "Colourful plant-based lunch",
  ),
  "tuna-pasta-salad": catalogueRecipe(
    "Tuna Pasta Salad",
    "🥗",
    "Lunch",
    ["dairy-free", "under30"],
    "25 min",
    "A bright pasta salad with tuna, corn, cucumber and a simple lemon dressing.",
    [
      catalogueIngredient("tps1", "Spiral pasta (500g)", "🍝", false, [
        { store: "Coles Ormeau", price: 2.5 },
        { store: "Woolworths Ormeau", price: 2.3 },
        { store: "Aldi Ormeau", price: 2.0 },
      ]),
      catalogueIngredient("tps2", "Tuna in springwater (425g)", "🐟", true, [
        { store: "Woolworths Ormeau", price: 5.5 },
        { store: "Coles Ormeau", price: 5.8 },
        { store: "Aldi Ormeau", price: 4.8 },
      ]),
      catalogueIngredient("tps3", "Cucumber (1)", "🥒", false, [
        { store: "Woolworths Ormeau", price: 1.8 },
        { store: "Coles Ormeau", price: 2.0 },
        { store: "IGA Ormeau", price: 2.2 },
      ]),
    ],
    [
      {
        b: "Boil",
        t: "cook pasta until al dente, then cool under running water.",
      },
      { b: "Mix", t: "toss pasta with drained tuna, cucumber and corn." },
      { b: "Dress", t: "finish with lemon juice, olive oil, salt and pepper." },
    ],
    {
      Vegan: "Replace tuna with chickpeas or white beans.",
      "Dairy-free": "Already dairy-free as written.",
      "Gluten-free": "Use gluten-free pasta.",
    },
    "Packable lunch with pantry tuna",
  ),
  "chicken-stir-fry": catalogueRecipe(
    "Chicken Stir Fry",
    "🥘",
    "Dinner",
    ["dairy-free", "under30"],
    "25 min",
    "Tender chicken and crisp vegetables tossed in a savoury stir-fry sauce.",
    [
      catalogueIngredient("csf1", "Chicken thigh (500g)", "🍗", false, [
        { store: "Woolworths Ormeau", price: 8.0 },
        { store: "Coles Ormeau", price: 8.5 },
        { store: "Aldi Ormeau", price: 7.5 },
      ]),
      catalogueIngredient("csf2", "Stir-fry vegetables (500g)", "🥦", false, [
        { store: "Coles Ormeau", price: 5.0 },
        { store: "Woolworths Ormeau", price: 5.5 },
        { store: "Aldi Ormeau", price: 4.5 },
      ]),
      catalogueIngredient("csf3", "Soy sauce (250ml)", "🥫", true, [
        { store: "Woolworths Ormeau", price: 2.5 },
        { store: "Coles Ormeau", price: 2.7 },
        { store: "IGA Ormeau", price: 3.0 },
      ]),
    ],
    [
      {
        b: "Slice",
        t: "cut chicken into thin strips and prepare the vegetables.",
      },
      {
        b: "Sear",
        t: "stir-fry chicken in a hot pan until browned and cooked through.",
      },
      {
        b: "Toss",
        t: "add vegetables and sauce, then cook until crisp-tender.",
      },
    ],
    {
      Vegan: "Swap chicken for tofu or mushrooms.",
      "Dairy-free": "Already dairy-free as written.",
      "Gluten-free": "Use gluten-free tamari instead of regular soy sauce.",
    },
    "Quick pan dinner for busy nights",
  ),
  "beef-tacos": catalogueRecipe(
    "Beef Tacos",
    "🌮",
    "Dinner",
    ["dairy-free", "under30"],
    "25 min",
    "Seasoned beef mince tucked into crisp taco shells with tomato and fresh herbs.",
    [
      catalogueIngredient("bt1", "Beef mince (500g)", "🥩", false, [
        { store: "Woolworths Ormeau", price: 7.0 },
        { store: "Coles Ormeau", price: 7.4 },
        { store: "Aldi Ormeau", price: 6.2 },
      ]),
      catalogueIngredient("bt2", "Taco shells (12 pack)", "🌮", false, [
        { store: "Coles Ormeau", price: 3.5 },
        { store: "Woolworths Ormeau", price: 3.7 },
        { store: "Aldi Ormeau", price: 3.0 },
      ]),
      catalogueIngredient("bt3", "Tomatoes (4)", "🍅", true, [
        { store: "Woolworths Ormeau", price: 4.0 },
        { store: "Coles Ormeau", price: 4.5 },
        { store: "IGA Ormeau", price: 5.0 },
      ]),
    ],
    [
      { b: "Brown", t: "cook beef mince with taco seasoning until browned." },
      {
        b: "Warm",
        t: "heat taco shells according to the packet instructions.",
      },
      {
        b: "Fill",
        t: "add beef, chopped tomato and your favourite fresh toppings.",
      },
    ],
    {
      Vegan: "Use black beans or plant-based mince.",
      "Dairy-free": "Skip sour cream and check the taco seasoning label.",
      "Gluten-free": "Use certified gluten-free taco shells and seasoning.",
    },
    "Build-your-own family dinner",
  ),
  "vegetable-curry": catalogueRecipe(
    "Vegetable Curry",
    "🍛",
    "Dinner",
    ["vegan", "vegetarian", "dairy-free", "gluten-free"],
    "40 min",
    "A warming vegetable curry with coconut milk, chickpeas and fragrant spices.",
    [
      catalogueIngredient("vc1", "Coconut milk (400ml)", "🥥", false, [
        { store: "Woolworths Ormeau", price: 2.5 },
        { store: "Coles Ormeau", price: 2.7 },
        { store: "Aldi Ormeau", price: 2.2 },
      ]),
      catalogueIngredient("vc2", "Chickpeas (400g can)", "🫘", true, [
        { store: "Coles Ormeau", price: 1.2 },
        { store: "Woolworths Ormeau", price: 1.3 },
        { store: "Aldi Ormeau", price: 1.0 },
      ]),
      catalogueIngredient("vc3", "Curry vegetables (600g)", "🥕", false, [
        { store: "Woolworths Ormeau", price: 5.0 },
        { store: "Coles Ormeau", price: 5.5 },
        { store: "IGA Ormeau", price: 6.0 },
      ]),
    ],
    [
      { b: "Soften", t: "cook onion and spices until fragrant." },
      {
        b: "Simmer",
        t: "add vegetables, chickpeas and coconut milk and simmer until tender.",
      },
      { b: "Serve", t: "serve with rice or warm flatbread." },
    ],
    {
      Vegan: "Already vegan as written.",
      "Dairy-free": "Already dairy-free as written.",
      "Gluten-free": "Serve with rice and check curry paste labels.",
    },
    "Comforting pantry-friendly curry",
  ),
  "homemade-pizza": catalogueRecipe(
    "Homemade Pizza",
    "🍕",
    "Dinner",
    ["vegetarian"],
    "45 min",
    "A simple homemade pizza with tomato passata, mozzarella and colourful vegetables.",
    [
      catalogueIngredient("hp1", "Pizza bases (2 pack)", "🍕", false, [
        { store: "Coles Ormeau", price: 4.0 },
        { store: "Woolworths Ormeau", price: 4.5 },
        { store: "Aldi Ormeau", price: 3.5 },
      ]),
      catalogueIngredient("hp2", "Mozzarella (250g)", "🧀", false, [
        { store: "Woolworths Ormeau", price: 5.0 },
        { store: "Coles Ormeau", price: 5.3 },
        { store: "Aldi Ormeau", price: 4.5 },
      ]),
      catalogueIngredient("hp3", "Tomato passata (700g)", "🍅", true, [
        { store: "Woolworths Ormeau", price: 2.1 },
        { store: "Coles Ormeau", price: 2.3 },
        { store: "Aldi Ormeau", price: 1.8 },
      ]),
    ],
    [
      {
        b: "Top",
        t: "spread passata over the bases and add mozzarella and vegetables.",
      },
      {
        b: "Bake",
        t: "bake at 220°C until the crust is crisp and cheese is bubbling.",
      },
      { b: "Slice", t: "rest for a few minutes before slicing and serving." },
    ],
    {
      Vegan: "Use dairy-free cheese or a cashew-free vegan cheese alternative.",
      "Dairy-free": "Use dairy-free mozzarella.",
      "Gluten-free": "Use gluten-free pizza bases.",
    },
    "Make-your-own Friday night pizza",
  ),
  "banana-muffins": catalogueRecipe(
    "Banana Muffins",
    "🧁",
    "Snack",
    ["vegetarian"],
    "35 min",
    "Moist banana muffins with a soft crumb, ideal for lunchboxes and afternoon tea.",
    [
      catalogueIngredient("bm1", "Bananas (3)", "🍌", false, [
        { store: "Woolworths Ormeau", price: 3.5 },
        { store: "Coles Ormeau", price: 3.5 },
        { store: "Aldi Ormeau", price: 3.0 },
      ]),
      catalogueIngredient("bm2", "Self-raising flour (500g)", "🌾", true, [
        { store: "Woolworths Ormeau", price: 1.7 },
        { store: "Coles Ormeau", price: 1.85 },
        { store: "IGA Ormeau", price: 2.0 },
      ]),
      catalogueIngredient("bm3", "Brown sugar (500g)", "🍯", false, [
        { store: "Woolworths Ormeau", price: 2.2 },
        { store: "Coles Ormeau", price: 2.35 },
        { store: "Aldi Ormeau", price: 1.95 },
      ]),
    ],
    [
      { b: "Mash", t: "mash bananas until mostly smooth." },
      { b: "Stir", t: "fold through flour, sugar, eggs and melted butter." },
      {
        b: "Bake",
        t: "divide into a muffin tray and bake at 180°C until risen and golden.",
      },
    ],
    {
      Vegan: "Use a flax egg and plant-based butter.",
      "Dairy-free": "Use dairy-free butter.",
      "Gluten-free": "Use a gluten-free self-raising flour blend.",
    },
    "Lunchbox-friendly banana bake",
  ),
  "fruit-yoghurt-cups": catalogueRecipe(
    "Fruit & Yoghurt Cups",
    "🍓",
    "Snack",
    ["vegetarian", "under30"],
    "10 min",
    "Layered yoghurt cups with seasonal fruit and crunchy toasted oats.",
    [
      catalogueIngredient("fyc1", "Greek yoghurt (500g)", "🥣", true, [
        { store: "Coles Ormeau", price: 4.5 },
        { store: "Woolworths Ormeau", price: 4.7 },
        { store: "Aldi Ormeau", price: 4.0 },
      ]),
      catalogueIngredient("fyc2", "Seasonal berries (250g)", "🍓", false, [
        { store: "Woolworths Ormeau", price: 5.0 },
        { store: "Coles Ormeau", price: 5.5 },
        { store: "IGA Ormeau", price: 6.0 },
      ]),
      catalogueIngredient("fyc3", "Granola (500g)", "🥣", false, [
        { store: "Coles Ormeau", price: 5.0 },
        { store: "Woolworths Ormeau", price: 5.5 },
        { store: "Aldi Ormeau", price: 4.5 },
      ]),
    ],
    [
      { b: "Prepare", t: "wash and slice the fruit." },
      { b: "Layer", t: "spoon yoghurt, fruit and granola into small cups." },
      { b: "Chill", t: "refrigerate until ready to serve." },
    ],
    {
      Vegan: "Use coconut or soy yoghurt.",
      "Dairy-free": "Use a dairy-free yoghurt.",
      "Gluten-free": "Choose gluten-free granola.",
    },
    "No-cook snack for busy afternoons",
  ),
});

const recipeCategories = {
  "choc-balls": "Dessert",
  "chicken-pesto": "Dinner",
  "brown-butter-cookies": "Snack",
  "zucchini-slice": "Lunch",
  gnocchi: "Dinner",
  "chocolate-cake": "Dessert",
  "butterfly-cupcakes": "Dessert",
  "spag-bol": "Dinner",
};
Object.entries(recipeCategories).forEach(([id, category]) => {
  recipesDB[id].category = category;
});

/* =========================================================
     GLOBAL STATE
  ========================================================= */
let currentRecipeId = "choc-balls";
let activeSavedFilter = "all";
let activeCategory = "all";
let searchTerm = "";
let activeMealAllergy = "all";
const priceIndex = {}; // per-ingredient selected store index, keyed by recipeId::ingId
const activeDietChips = new Set();
let profile = {
  name: "Mary Morales",
  location: "Ormeau QLD 4208",
  allergies: [],
};
const STORAGE_KEY = "chefQuestState";
const defaultProfile = {
  name: "Mary Morales",
  location: "Ormeau QLD 4208",
  allergies: [],
};
const defaultSaved = Object.fromEntries(
  Object.entries(recipesDB).map(([id, recipe]) => [id, recipe.saved]),
);
const defaultIngredientHave = Object.fromEntries(
  Object.entries(recipesDB).flatMap(([id, recipe]) =>
    recipe.ingredients.map((ingredient) => [
      id + "::" + ingredient.id,
      ingredient.have,
    ]),
  ),
);

function persistState() {
  const ingredientHave = {};
  Object.entries(recipesDB).forEach(([id, recipe]) => {
    recipe.ingredients.forEach(
      (ingredient) =>
        (ingredientHave[id + "::" + ingredient.id] = ingredient.have),
    );
  });
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      profile,
      saved: Object.fromEntries(
        Object.entries(recipesDB).map(([id, recipe]) => [id, recipe.saved]),
      ),
      ingredientHave,
      priceIndex,
      mealCursor,
      mealSelections,
    }),
  );
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!stored) return;
    profile = {
      ...defaultProfile,
      ...stored.profile,
      allergies: Array.isArray(stored.profile?.allergies)
        ? stored.profile.allergies
        : [],
    };
    Object.entries(stored.saved || {}).forEach(([id, saved]) => {
      if (recipesDB[id]) recipesDB[id].saved = Boolean(saved);
    });
    Object.entries(stored.ingredientHave || {}).forEach(([key, have]) => {
      const [recipeId, ingredientId] = key.split("::");
      const ingredient = recipesDB[recipeId]?.ingredients.find(
        (item) => item.id === ingredientId,
      );
      if (ingredient) ingredient.have = Boolean(have);
    });
    Object.assign(priceIndex, stored.priceIndex || {});
    Object.assign(mealCursor, stored.mealCursor || {});
    Object.assign(mealSelections, stored.mealSelections || {});
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2800);
}

function isRecipeSafe(recipe, allergies = profile.allergies) {
  return allergies.every((allergy) => recipe.tags.includes(allergy));
}

/* =========================================================
     NAVIGATION
  ========================================================= */
function goTo(name) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.toggle("active", s.dataset.screen === name));
  document
    .querySelectorAll("#navlist button")
    .forEach((b) => b.classList.toggle("active", b.dataset.screen === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
document.querySelectorAll("#navlist button").forEach((btn) => {
  btn.addEventListener("click", () => goTo(btn.dataset.screen));
});

document.querySelectorAll(".tab-pill").forEach((p) => {
  p.addEventListener("click", () => {
    p.parentElement
      .querySelectorAll(".tab-pill")
      .forEach((x) => x.classList.remove("active"));
    p.classList.add("active");
  });
});

/* =========================================================
     DASHBOARD — recent recipes table (clickable, from DB)
  ========================================================= */
function renderDashboard() {
  const planned = getPlannedRecipes();
  const shoppingItems = getShoppingItems();
  const needed = shoppingItems.filter((item) => !item.have);
  const savedCount = Object.values(recipesDB).filter(
    (recipe) => recipe.saved,
  ).length;
  const estimatedCost = needed.reduce(
    (total, item) => total + (item.cheapest?.price || 0),
    0,
  );
  document.getElementById("dashGreeting").textContent =
    "Welcome back, " + profile.name.split(" ")[0] + "!";
  document.getElementById("dashPlanned").textContent = planned.length;
  document.getElementById("dashShopping").textContent = needed.length;
  document.getElementById("dashCost").textContent =
    "$" + estimatedCost.toFixed(2);
  document.getElementById("dashSaved").textContent = savedCount;

  const currentDayIndex =
    new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const today = days[currentDayIndex];
  const todayEntry = planned.find((entry) => entry.day === today);
  const nextEntry =
    todayEntry ||
    days
      .slice(currentDayIndex + 1)
      .concat(days.slice(0, currentDayIndex))
      .map((day) => planned.find((entry) => entry.day === day))
      .find(Boolean);
  const tonightHeading = document.getElementById("tonightHeading");
  const tonightDay = document.getElementById("tonightDay");
  const tonightContent = document.getElementById("tonightContent");
  tonightHeading.textContent = todayEntry
    ? "Tonight's meal"
    : nextEntry
      ? "Next planned meal"
      : "Tonight's meal";
  tonightDay.textContent = nextEntry ? nextEntry.day : today;
  tonightContent.innerHTML = nextEntry
    ? `<div class="tonight-recipe"><div class="tonight-icon">${nextEntry.recipe.icon}</div><div class="tonight-copy"><b>${nextEntry.recipe.name}</b><span>${nextEntry.recipe.time} · ${nextEntry.recipe.category}</span><button class="text-link" onclick="openRecipe('${nextEntry.recipeId}')">View recipe →</button></div></div>`
    : '<div class="dashboard-empty"><b>No meal planned yet</b><button class="text-link" onclick="goTo(\'mealplan\')">Plan a meal →</button></div>';

  const plannedIds = new Set(planned.map((entry) => entry.recipeId));
  const recommendations = Object.entries(recipesDB)
    .filter(
      ([id, recipe]) =>
        !recipe.saved && !plannedIds.has(id) && isRecipeSafe(recipe),
    )
    .slice(0, 3);
  const recommendationList = document.getElementById(
    "dashboardRecommendations",
  );
  recommendationList.innerHTML = recommendations.length
    ? recommendations
        .map(
          ([id, recipe]) =>
            `<div class="dashboard-recipe-card"><div class="recipe-thumb">${recipe.icon}</div><div class="recipe-info"><div class="rname">${recipe.name}</div><div class="rmeta"><span class="recipe-category">${recipe.category}</span> · ${recipe.time}</div></div><button class="star-btn" aria-label="Save ${recipe.name}" onclick="toggleRecipeSave('${id}', event)">☆</button><button class="dashboard-view-btn" onclick="openRecipe('${id}')">View</button></div>`,
        )
        .join("")
    : '<div class="dashboard-empty">No new suggestions match your current profile.</div>';

  const dashboardShopping = document.getElementById("dashboardShopping");
  dashboardShopping.innerHTML = needed.length
    ? `<div class="snapshot-total"><b>${needed.length} ingredients still needed</b><span>Estimated demo cost: $${estimatedCost.toFixed(2)}</span></div><div class="snapshot-items">${needed
        .slice(0, 4)
        .map((item) => `<span>${item.icon} ${item.name}</span>`)
        .join("")}</div>`
    : '<div class="dashboard-empty"><b>Your shopping list is ready.</b><span>Everything needed is already marked as owned.</span></div>';

  const recent = [
    "choc-balls",
    "chicken-pesto",
    "brown-butter-cookies",
    "zucchini-slice",
  ];
  const tbl = document.getElementById("recentTable");
  let rows = "<thead><tr><th>Date</th><th>Item</th></tr></thead><tbody>";
  recent.forEach((id) => {
    const r = recipesDB[id];
    const tagBadge = r.tags.includes("nut-free")
      ? '<span class="allergy-tag">Nut-free</span>'
      : r.tags.includes("dairy-free")
        ? '<span class="allergy-tag">Dairy-free</span>'
        : r.tags.includes("gluten-free")
          ? '<span class="allergy-tag">Gluten-free</span>'
          : "";
    rows += `<tr onclick="openRecipe('${id}')"><td class="rlog-date">${r.savedDate || ""}</td><td>${r.name}${tagBadge}</td></tr>`;
  });
  rows += "</tbody>";
  tbl.innerHTML = rows;
}

/* =========================================================
     SAVED RECIPES — filtered + searchable, from DB
  ========================================================= */
function renderSavedRecipes() {
  const list = document.getElementById("recipeList");
  const suggestList = document.getElementById("suggestList");
  const emptyNote = document.getElementById("emptyNote");
  const suggestEmpty = document.getElementById("suggestEmpty");
  const hint = document.getElementById("filterHint");
  list.innerHTML = "";
  suggestList.innerHTML = "";

  if (profile.allergies.length && activeSavedFilter === "all" && !searchTerm) {
    hint.style.display = "block";
    hint.textContent =
      "Showing based on your profile: " + profile.allergies.join(", ");
  } else {
    hint.style.display = "none";
  }

  let shown = 0;
  Object.keys(recipesDB).forEach((id) => {
    const r = recipesDB[id];
    if (!r.saved) return;
    if (!isRecipeSafe(r)) return;
    const matchesFilter =
      activeSavedFilter === "all" || r.tags.includes(activeSavedFilter);
    const matchesCategory =
      activeCategory === "all" || r.category === activeCategory;
    const matchesSearch = recipeMatchesSearch(r);
    if (!matchesFilter || !matchesCategory || !matchesSearch) return;
    shown++;
    const row = document.createElement("div");
    row.className = "recipe-row";
    row.onclick = () => openRecipe(id);
    row.innerHTML = `
        <div class="recipe-thumb">${r.icon}</div>
        <div class="recipe-info">
          <div class="rname">${r.name}</div>
          <div class="rmeta"><span class="recipe-category">${r.category}</span> · ${r.time} · ${r.tags.join(" · ")}</div>
        </div>
        <button class="star-btn ${r.saved ? "saved" : ""}" aria-label="Remove ${r.name} from saved recipes" onclick="toggleRecipeSave('${id}', event)">★</button>`;
    list.appendChild(row);
  });
  emptyNote.style.display = shown === 0 ? "block" : "none";

  let suggestionsShown = 0;
  Object.keys(recipesDB).forEach((id) => {
    const r = recipesDB[id];
    if (r.saved) return;
    if (!isRecipeSafe(r)) return;
    if (activeSavedFilter !== "all" && !r.tags.includes(activeSavedFilter))
      return;
    if (activeCategory !== "all" && r.category !== activeCategory) return;
    if (!recipeMatchesSearch(r)) return;
    const row = document.createElement("div");
    row.className = "suggest-row";
    row.onclick = () => openRecipe(id);
    row.innerHTML = `
        <div class="recipe-thumb">${r.icon}</div>
        <div class="recipe-info">
          <div class="rname">${r.name}</div>
          <div class="rmeta"><span class="recipe-category">${r.category}</span> · ${r.time} · ${r.match}</div>
        </div>
        <div class="recipe-card-actions"><button class="mini-action" onclick="toggleRecipeSave('${id}', event)">☆ Save</button><button class="mini-action" onclick="openPlanAddDialog('${id}'); event.stopPropagation()">＋ Plan</button></div>`;
    suggestList.appendChild(row);
    suggestionsShown++;
  });
  suggestEmpty.style.display = suggestionsShown === 0 ? "block" : "none";
}

function recipeMatchesSearch(recipe) {
  if (!searchTerm) return true;
  const searchableText = [
    recipe.name,
    recipe.desc,
    recipe.category,
    ...recipe.tags,
    ...recipe.ingredients.map((ingredient) => ingredient.name),
  ]
    .join(" ")
    .toLowerCase();
  return searchableText.includes(searchTerm);
}

function toggleRecipeSave(id, event) {
  event?.stopPropagation();
  recipesDB[id].saved = !recipesDB[id].saved;
  persistState();
  renderSavedRecipes();
  renderDashboard();
  if (currentRecipeId === id) renderRecipeDetail(id);
  showToast(
    recipesDB[id].saved
      ? "Recipe saved to your collection."
      : "Recipe removed from your collection.",
  );
}
document.querySelectorAll("#filterRow .chip").forEach((c) => {
  c.addEventListener("click", () => {
    document
      .querySelectorAll("#filterRow .chip")
      .forEach((x) => x.classList.remove("active"));
    c.classList.add("active");
    activeSavedFilter = c.dataset.filter;
    renderSavedRecipes();
  });
});
document
  .getElementById("categoryFilter")
  .addEventListener("change", (event) => {
    activeCategory = event.target.value;
    renderSavedRecipes();
  });

/* ---- top search bar: filters Saved Recipes, jumps there if needed ---- */
const topSearch = document.getElementById("topSearch");
topSearch.addEventListener("input", () => {
  searchTerm = topSearch.value.trim().toLowerCase();
  if (searchTerm) goTo("saved");
  renderSavedRecipes();
});

/* =========================================================
     SCANNER (coming soon preview)
  ========================================================= */
let scanning = false;
function runScan() {
  if (scanning) return;
  scanning = true;
  const line = document.getElementById("scanLine");
  const hint = document.getElementById("scanHint");
  const btn = document.getElementById("scanBtn");
  const empty = document.getElementById("resultEmpty");
  const body = document.getElementById("resultBody");
  line.classList.add("on");
  hint.textContent = "Scanning shelf...";
  btn.textContent = "Scanning...";
  empty.style.display = "flex";
  body.classList.remove("on");
  setTimeout(() => {
    line.classList.remove("on");
    hint.textContent =
      "Open your cupboard and scan with a clear photo showing the ingredients clearly.";
    btn.textContent = "▶ Scan here · demo preview";
    empty.style.display = "none";
    body.classList.add("on");
    scanning = false;
  }, 1700);
}

/* =========================================================
     MEAL PLAN — allergy-aware weekly planner, linked to DB where possible
  ========================================================= */
const mealOptions = {
  Mon: [
    {
      name: "Spaghetti Bolognese",
      icon: "🍝",
      tags: ["dairy-free"],
      recipeId: "spag-bol",
    },
    {
      name: "Veggie Stir-fry",
      icon: "🥦",
      tags: ["nut-free", "dairy-free", "gluten-free"],
    },
    { name: "Chicken Wraps", icon: "🌯", tags: ["nut-free"] },
  ],
  Tue: [
    {
      name: "Chicken Pesto Pasta",
      icon: "🍝",
      tags: ["nut-free"],
      recipeId: "chicken-pesto",
    },
    {
      name: "Baked Salmon & Veg",
      icon: "🐟",
      tags: ["nut-free", "dairy-free", "gluten-free"],
    },
    { name: "Bean Tacos", icon: "🌮", tags: ["nut-free", "dairy-free"] },
  ],
  Wed: [
    {
      name: "Zucchini Slice",
      icon: "🥒",
      tags: ["nut-free", "gluten-free"],
      recipeId: "zucchini-slice",
    },
    { name: "Butter Chicken", icon: "🍛", tags: ["nut-free", "gluten-free"] },
    {
      name: "Gnocchi & Sauce",
      icon: "🥟",
      tags: ["nut-free"],
      recipeId: "gnocchi",
    },
  ],
  Thu: [
    {
      name: "Brown Butter Cookies (snack)",
      icon: "🍪",
      tags: ["nut-free"],
      recipeId: "brown-butter-cookies",
    },
    { name: "Veggie Frittata", icon: "🍳", tags: ["nut-free", "gluten-free"] },
    { name: "Beef Stir-fry", icon: "🥘", tags: ["dairy-free", "gluten-free"] },
  ],
  Fri: [
    { name: "Homemade Pizza Night", icon: "🍕", tags: ["nut-free"] },
    { name: "Fish Tacos", icon: "🌮", tags: ["nut-free", "dairy-free"] },
    {
      name: "Chocolate Biscuit Balls (dessert)",
      icon: "🍫",
      tags: ["nut-free"],
      recipeId: "choc-balls",
    },
  ],
  Sat: [
    {
      name: "Roast Chicken & Veg",
      icon: "🍗",
      tags: ["nut-free", "dairy-free", "gluten-free"],
    },
    {
      name: "Butterfly Cupcakes (dessert)",
      icon: "🧁",
      tags: ["nut-free"],
      recipeId: "butterfly-cupcakes",
    },
    {
      name: "BBQ Skewers",
      icon: "🍢",
      tags: ["nut-free", "dairy-free", "gluten-free"],
    },
  ],
  Sun: [
    { name: "Sunday Roast", icon: "🍖", tags: ["nut-free", "dairy-free"] },
    {
      name: "Chocolate Cake (dessert)",
      icon: "🎂",
      tags: ["nut-free"],
      recipeId: "chocolate-cake",
    },
    {
      name: "Slow-cooked Curry",
      icon: "🍛",
      tags: ["nut-free", "dairy-free", "gluten-free"],
    },
  ],
};
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const mealCursor = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
const defaultMealSelections = {
  Mon: "spag-bol",
  Tue: "chicken-pesto",
  Wed: "zucchini-slice",
  Thu: "brown-butter-cookies",
  Fri: "choc-balls",
  Sat: "butterfly-cupcakes",
  Sun: "chocolate-cake",
};
const mealSelections = { ...defaultMealSelections };
const weekGrid = document.getElementById("weekGrid");
loadState();

function resetDemo() {
  if (
    !window.confirm(
      "Reset your saved recipes, profile, pantry checks and meal plan to the demo state?",
    )
  )
    return;
  localStorage.removeItem(STORAGE_KEY);
  Object.entries(defaultSaved).forEach(
    ([id, saved]) => (recipesDB[id].saved = saved),
  );
  Object.entries(defaultIngredientHave).forEach(([key, have]) => {
    const [recipeId, ingredientId] = key.split("::");
    const ingredient = recipesDB[recipeId].ingredients.find(
      (item) => item.id === ingredientId,
    );
    ingredient.have = have;
  });
  profile = { ...defaultProfile, allergies: [] };
  Object.keys(priceIndex).forEach((key) => delete priceIndex[key]);
  Object.keys(mealCursor).forEach((day) => (mealCursor[day] = 0));
  Object.keys(mealSelections).forEach(
    (day) => (mealSelections[day] = defaultMealSelections[day]),
  );
  activeSavedFilter = "all";
  activeCategory = "all";
  activeMealAllergy = "all";
  searchTerm = "";
  document.getElementById("topSearch").value = "";
  document.getElementById("categoryFilter").value = "all";
  syncProfileUI();
  renderDashboard();
  renderSavedRecipes();
  renderWeek();
  renderRecipeDetail(currentRecipeId);
  showToast(
    "Demo reset. Your profile and recipes are back to the starting state.",
  );
}

function renderWeek() {
  const mpHint = document.getElementById("mealplanHint");
  if (profile.allergies.length && activeMealAllergy === "all") {
    mpHint.style.display = "block";
    mpHint.textContent =
      "Days that don\u2019t match your profile (" +
      profile.allergies.join(", ") +
      ") are dimmed.";
  } else {
    mpHint.style.display = "none";
  }
  weekGrid.innerHTML = "";
  days.forEach((day) => {
    const recipeId = mealSelections[day];
    const recipe = recipeId ? recipesDB[recipeId] : null;
    const matches = recipe ? recipeMatchesMealFilters(recipe) : true;
    const card = document.createElement("div");
    card.className = "day-card" + (matches ? "" : " dim");
    card.innerHTML = recipe
      ? `
        <div class="dayname">${day}</div>
        <div class="mealicon">${recipe.icon}</div>
        <div class="mealname">${recipe.name}</div>
        <div class="mealmeta">${recipe.time}</div>
        <div class="mealtags">${recipe.tags.map((tag) => "<span>" + tag + "</span>").join("")}</div>
        <div class="day-actions">
          <button class="swap-btn" onclick="openMealPicker('${day}')">Change meal</button>
          <div class="day-secondary-actions">
            <button class="view-recipe-link" onclick="openRecipe('${recipeId}')">View recipe</button>
            <button class="remove-meal-btn" onclick="removeMeal('${day}')">Remove</button>
          </div>
        </div>`
      : `
        <div class="dayname">${day}</div>
        <div class="meal-empty"><span>＋</span><b>No meal planned</b><small>Choose a recipe for this day.</small></div>
        <div class="day-actions"><button class="swap-btn" onclick="openMealPicker('${day}')">Add meal</button></div>`;
    weekGrid.appendChild(card);
  });
  if (typeof renderWeekSummary === "function") renderWeekSummary();
  if (typeof renderShoppingList === "function") renderShoppingList();
  if (typeof renderDashboard === "function") renderDashboard();
}

function recipeMatchesMealFilters(recipe) {
  const selectedFilter =
    activeMealAllergy === "all" || recipe.tags.includes(activeMealAllergy);
  return selectedFilter && isRecipeSafe(recipe);
}

function openMealPicker(day) {
  document.getElementById("mealPicker").classList.add("open");
  document.getElementById("mealPicker").setAttribute("aria-hidden", "false");
  document.getElementById("pickerDay").textContent = day;
  document.getElementById("pickerSearch").value = "";
  document.getElementById("unsafePickerToggle").checked = false;
  document.getElementById("mealPicker").dataset.day = day;
  renderMealPicker();
  document.getElementById("pickerSearch").focus();
}

function closeMealPicker() {
  document.getElementById("mealPicker").classList.remove("open");
  document.getElementById("mealPicker").setAttribute("aria-hidden", "true");
}

function openPlanAddDialog(recipeId) {
  const dialog = document.getElementById("planAddDialog");
  const daySelect = document.getElementById("planAddDay");
  daySelect.innerHTML = days
    .map(
      (day) =>
        `<option value="${day}">${day}${mealSelections[day] ? " · replace current meal" : " · empty"}</option>`,
    )
    .join("");
  daySelect.value = days.find((day) => !mealSelections[day]) || days[0];
  dialog.dataset.recipeId = recipeId;
  document.getElementById("planAddRecipeName").textContent =
    recipesDB[recipeId].name + " · choose a day for this recipe.";
  dialog.classList.add("open");
  dialog.setAttribute("aria-hidden", "false");
}

function closePlanAddDialog() {
  const dialog = document.getElementById("planAddDialog");
  dialog.classList.remove("open");
  dialog.setAttribute("aria-hidden", "true");
}

function addRecipeToPlan() {
  const dialog = document.getElementById("planAddDialog");
  const recipeId = dialog.dataset.recipeId;
  const day = document.getElementById("planAddDay").value;
  mealSelections[day] = recipeId;
  persistState();
  closePlanAddDialog();
  renderWeek();
  goTo("mealplan");
  showToast(recipesDB[recipeId].name + " added to " + day + ".");
}

function renderMealPicker() {
  const list = document.getElementById("mealPickerList");
  const query = document
    .getElementById("pickerSearch")
    .value.trim()
    .toLowerCase();
  const showUnsafe = document.getElementById("unsafePickerToggle").checked;
  list.innerHTML = "";
  Object.entries(recipesDB).forEach(([id, recipe]) => {
    if (query && !recipe.name.toLowerCase().includes(query)) return;
    const safe = isRecipeSafe(recipe);
    if (!safe && !showUnsafe) return;
    const card = document.createElement("button");
    card.className = "picker-recipe" + (safe ? "" : " unsafe");
    card.disabled = !safe;
    card.innerHTML = `<span class="picker-icon">${recipe.icon}</span><span class="picker-copy"><b>${recipe.name}</b><small>${recipe.time} · ${recipe.tags.join(" · ")}</small>${safe ? "" : "<em>Does not match your dietary settings</em>"}</span><span class="picker-arrow">${safe ? "Add" : "Unsafe"}</span>`;
    if (safe)
      card.onclick = () =>
        selectMeal(document.getElementById("mealPicker").dataset.day, id);
    list.appendChild(card);
  });
  if (!list.children.length)
    list.innerHTML =
      '<p class="picker-empty">No recipes match this search and your current dietary settings.</p>';
}

function selectMeal(day, recipeId) {
  mealSelections[day] = recipeId;
  persistState();
  closeMealPicker();
  renderWeek();
  showToast(recipesDB[recipeId].name + " added to " + day + ".");
}

function removeMeal(day) {
  mealSelections[day] = null;
  persistState();
  renderWeek();
  showToast("Meal removed from " + day + ".");
}

document
  .getElementById("pickerSearch")
  .addEventListener("input", renderMealPicker);
document
  .getElementById("unsafePickerToggle")
  .addEventListener("change", renderMealPicker);
document.getElementById("mealPicker").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closeMealPicker();
});
document.getElementById("planAddDialog").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) closePlanAddDialog();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    document.getElementById("mealPicker").classList.contains("open")
  )
    closeMealPicker();
  if (
    event.key === "Escape" &&
    document.getElementById("planAddDialog").classList.contains("open")
  )
    closePlanAddDialog();
});
document.querySelectorAll("#allergyFilterRow .chip").forEach((c) => {
  c.addEventListener("click", () => {
    document
      .querySelectorAll("#allergyFilterRow .chip")
      .forEach((x) => x.classList.remove("active"));
    c.classList.add("active");
    activeMealAllergy = c.dataset.allergy;
    renderWeek();
  });
});

/* =========================================================
     RECIPE DETAIL — fully dynamic per recipe
  ========================================================= */
function openRecipe(id) {
  currentRecipeId = id;
  renderRecipeDetail(id);
  goTo("detail");
}

const dietTemplates = {
  Vegan: "See the substitution note below for making this vegan.",
  "Dairy-free": "See the substitution note below for a dairy-free version.",
  "Gluten-free": "See the substitution note below for a gluten-free version.",
};

function renderRecipeDetail(id) {
  const r = recipesDB[id];
  document.getElementById("rdPhoto").textContent = r.icon;
  document.getElementById("rdTitle").textContent = r.name;
  document.getElementById("rdDesc").textContent = r.desc;
  document.getElementById("rdMeta").innerHTML =
    `<span>${r.category}</span><span>${r.time}</span>` +
    r.tags.map((t) => `<span>${t}</span>`).join("");
  const saveButton = document.getElementById("rdSaveBtn");
  saveButton.textContent = r.saved ? "★ Saved recipe" : "☆ Save recipe";
  saveButton.classList.toggle("saved", r.saved);
  saveButton.setAttribute(
    "aria-label",
    r.saved ? "Remove recipe from saved recipes" : "Save recipe",
  );

  const ingList = document.getElementById("ingList");
  ingList.innerHTML = "";
  r.ingredients.forEach((ing) => {
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" data-ing="${ing.id}" ${ing.have ? "checked" : ""} onchange="updatePrice()"> ${ing.name} <span class="have-note" data-note="${ing.id}"></span>`;
    ingList.appendChild(li);
  });

  const stepsList = document.getElementById("stepsList");
  stepsList.innerHTML = "";
  r.steps.forEach((s) => {
    const li = document.createElement("li");
    li.innerHTML = `<b>${s.b}</b> — ${s.t}`;
    stepsList.appendChild(li);
  });

  activeDietChips.clear();
  document
    .querySelectorAll(".diet-chip")
    .forEach((c) => c.classList.remove("active"));
  document.getElementById("dietNote").textContent = "";

  renderPriceItems();
}

document.querySelectorAll(".diet-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    chip.classList.toggle("active");
    const diet = chip.dataset.diet;
    if (chip.classList.contains("active")) activeDietChips.add(diet);
    else activeDietChips.delete(diet);
    const r = recipesDB[currentRecipeId];
    const notes = [...activeDietChips].map((d) =>
      r.dietTips && r.dietTips[d] ? r.dietTips[d] : dietTemplates[d],
    );
    document.getElementById("dietNote").textContent = notes.join(" ");
  });
});

/* ---- Price comparison: per-recipe, cycle stores + live total ---- */
const priceItemsEl = document.getElementById("priceItems");

function renderPriceItems() {
  const r = recipesDB[currentRecipeId];
  priceItemsEl.innerHTML = "";
  r.ingredients.forEach((ing) => {
    const key = currentRecipeId + "::" + ing.id;
    if (!(key in priceIndex)) priceIndex[key] = 0;
    const box = document.querySelector(
      '.ing-list input[data-ing="' + ing.id + '"]',
    );
    const have = box ? box.checked : ing.have;
    const opt = ing.options[priceIndex[key]];
    const row = document.createElement("div");
    row.className = "price-item" + (have ? " crossed" : "");
    row.innerHTML = `
        <div class="piname">${ing.name}</div>
        <div class="picompare">
          <div class="swatch-md">${ing.icon}</div>
          <div class="pinfo">
            <div class="pstore">${have ? "Already in your household" : "Cheapest: " + opt.store}</div>
            <div class="pcost ${have ? "have" : ""}">${have ? "On hand" : "$" + opt.price.toFixed(2)}</div>
            ${have ? '<span class="have-tag">DON&#39;T BUY</span>' : ""}
          </div>
          ${
            have
              ? ""
              : `<div class="store-arrows">
            <button onclick="cycleStore('${ing.id}',-1)">◀</button>
            <button onclick="cycleStore('${ing.id}',1)">▶</button>
          </div>`
          }
        </div>`;
    priceItemsEl.appendChild(row);
  });
  updateTotal();
}

function cycleStore(ingId, dir) {
  const r = recipesDB[currentRecipeId];
  const ing = r.ingredients.find((i) => i.id === ingId);
  const key = currentRecipeId + "::" + ingId;
  const n = ing.options.length;
  priceIndex[key] = ((priceIndex[key] || 0) + dir + n) % n;
  persistState();
  renderPriceItems();
}

function updateTotal() {
  const r = recipesDB[currentRecipeId];
  let total = 0;
  r.ingredients.forEach((ing) => {
    const box = document.querySelector(
      '.ing-list input[data-ing="' + ing.id + '"]',
    );
    const have = box ? box.checked : ing.have;
    const key = currentRecipeId + "::" + ing.id;
    if (!have) {
      total += ing.options[priceIndex[key] || 0].price;
    }
  });
  document.getElementById("priceTotal").textContent = "$" + total.toFixed(2);
  r.ingredients.forEach((ing) => {
    const box = document.querySelector(
      '.ing-list input[data-ing="' + ing.id + '"]',
    );
    const note = document.querySelector(
      '.have-note[data-note="' + ing.id + '"]',
    );
    if (box && note) note.textContent = box.checked ? "✓ already have" : "";
  });
}
function updatePrice() {
  const recipe = recipesDB[currentRecipeId];
  recipe.ingredients.forEach((ingredient) => {
    const box = document.querySelector(
      '.ing-list input[data-ing="' + ingredient.id + '"]',
    );
    if (box) ingredient.have = box.checked;
  });
  persistState();
  renderPriceItems();
  if (typeof renderShoppingList === "function") renderShoppingList();
}

function normalizeIngredientName(name) {
  return name
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getPlannedRecipes() {
  return days
    .filter((day) => mealSelections[day] && recipesDB[mealSelections[day]])
    .map((day) => ({
      day,
      recipeId: mealSelections[day],
      recipe: recipesDB[mealSelections[day]],
    }));
}

function getShoppingItems() {
  const items = new Map();
  getPlannedRecipes().forEach(({ day, recipeId, recipe }) => {
    recipe.ingredients.forEach((ingredient) => {
      const key = normalizeIngredientName(ingredient.name);
      if (!items.has(key)) {
        items.set(key, {
          key,
          name: ingredient.name.replace(/\s*\([^)]*\)/, ""),
          icon: ingredient.icon,
          sources: [],
          options: [],
        });
      }
      const item = items.get(key);
      item.sources.push({ day, recipeId, recipeName: recipe.name, ingredient });
      item.options.push(
        ...ingredient.options.map((option) => ({
          ...option,
          recipeId,
          ingredientId: ingredient.id,
        })),
      );
    });
  });
  return [...items.values()].map((item) => ({
    ...item,
    have: item.sources.every((source) => source.ingredient.have),
    cheapest: item.options.reduce(
      (best, option) => (!best || option.price < best.price ? option : best),
      null,
    ),
  }));
}

function setShoppingIngredientHave(key, have) {
  getShoppingItems()
    .find((item) => item.key === key)
    ?.sources.forEach((source) => {
      source.ingredient.have = have;
    });
  persistState();
  renderShoppingList();
  if (currentRecipeId && recipesDB[currentRecipeId])
    renderRecipeDetail(currentRecipeId);
}

function shoppingItemMarkup(item) {
  const uses = [
    ...new Set(
      item.sources.map((source) => source.day + " · " + source.recipeName),
    ),
  ];
  const useLabel =
    uses.length === 1
      ? "Used in " + uses[0]
      : "Used in " + uses.length + " meals";
  const useLinks = [
    ...new Map(
      item.sources.map((source) => [source.recipeId, source]),
    ).values(),
  ]
    .map(
      (source) =>
        `<button onclick="openRecipe('${source.recipeId}')">${source.day}: ${source.recipeName}</button>`,
    )
    .join("");
  const priceOptions = [
    ...new Map(item.options.map((option) => [option.store, option])).values(),
  ];
  const priceLabel = item.cheapest
    ? "Cheapest demo option: " +
      item.cheapest.store +
      " · $" +
      item.cheapest.price.toFixed(2)
    : "No demo price available";
  const encodedKey = encodeURIComponent(item.key).replace(/'/g, "%27");
  return `<div class="shopping-item"><label class="shopping-check"><input type="checkbox" aria-label="Mark ${item.name} as already have" ${item.have ? "checked" : ""} onchange="setShoppingIngredientHave(decodeURIComponent('${encodedKey}'), this.checked)" /><span class="checkmark"></span></label><div class="shopping-icon">${item.icon}</div><div class="shopping-item-copy"><b>${item.name}</b><span>${useLabel}</span><small>${priceLabel}</small><details class="used-in"><summary>View recipes</summary><div>${useLinks}</div></details></div>${priceOptions.length > 1 ? `<details class="price-options"><summary>Prices</summary><div>${priceOptions.map((option) => `<span class="${option.store === item.cheapest?.store ? "cheapest" : ""}">${option.store}: $${option.price.toFixed(2)}${option.store === item.cheapest?.store ? " · cheapest" : ""}</span>`).join("")}</div></details>` : ""}</div>`;
}

function renderShoppingList() {
  const items = getShoppingItems();
  const empty = document.getElementById("shoppingEmpty");
  const content = document.getElementById("shoppingContent");
  const noMeals = getPlannedRecipes().length === 0;
  empty.style.display = noMeals ? "block" : "none";
  content.style.display = noMeals ? "none" : "block";
  const need = items.filter((item) => !item.have);
  const have = items.filter((item) => item.have);
  document.getElementById("needToBuyList").innerHTML =
    need.map(shoppingItemMarkup).join("") ||
    '<div class="list-empty">Nothing to buy right now.</div>';
  document.getElementById("alreadyHaveList").innerHTML =
    have.map(shoppingItemMarkup).join("") ||
    '<div class="list-empty">No ingredients marked as already have.</div>';
  document.getElementById("shoppingNeedCount").textContent = need.length;
  document.getElementById("shoppingHaveCount").textContent = have.length;
  document.getElementById("shoppingTotal").textContent =
    "$" +
    need
      .reduce((total, item) => total + (item.cheapest?.price || 0), 0)
      .toFixed(2);
  document.getElementById("needSectionCount").textContent =
    need.length + (need.length === 1 ? " item" : " items");
  document.getElementById("haveSectionCount").textContent =
    have.length + (have.length === 1 ? " item" : " items");
  document.getElementById("allOwned").style.display =
    items.length > 0 && need.length === 0 ? "block" : "none";
  if (typeof renderWeekSummary === "function") renderWeekSummary();
  if (typeof renderDashboard === "function") renderDashboard();
}

function renderWeekSummary() {
  const planned = getPlannedRecipes();
  const items = getShoppingItems();
  const need = items.filter((item) => !item.have);
  const minutes = planned.reduce(
    (total, entry) => total + (parseInt(entry.recipe.time, 10) || 0),
    0,
  );
  const total = need.reduce(
    (sum, item) => sum + (item.cheapest?.price || 0),
    0,
  );
  document.getElementById("plannedCount").textContent = planned.length;
  document.getElementById("emptyCount").textContent =
    days.length - planned.length;
  document.getElementById("cookTime").textContent = minutes + " min";
  document.getElementById("buyCount").textContent = need.length;
  document.getElementById("mealCost").textContent = "$" + total.toFixed(2);
}

/* =========================================================
     PROFILE — editable, feeds the filters above
  ========================================================= */
document.querySelectorAll("#profileAllergyRow .chip").forEach((c) => {
  c.addEventListener("click", () => c.classList.toggle("active"));
});

function syncProfileUI() {
  const initial = profile.name.trim().charAt(0).toUpperCase() || "M";
  document.getElementById("profName").value = profile.name;
  document.getElementById("profLocation").value = profile.location;
  document
    .querySelectorAll("#profileAllergyRow .chip")
    .forEach((chip) =>
      chip.classList.toggle(
        "active",
        profile.allergies.includes(chip.dataset.diet),
      ),
    );
  document.getElementById("topName").textContent = profile.name;
  document.getElementById("topAvatar").textContent = initial;
  document.getElementById("profAvatar").textContent = initial;
  document.getElementById("dashGreeting").textContent =
    "Welcome back, " + profile.name.split(" ")[0] + " 👋";
}

function saveProfile() {
  profile.name =
    document.getElementById("profName").value.trim() || "Mary Morales";
  profile.location =
    document.getElementById("profLocation").value.trim() || "Ormeau QLD 4208";
  profile.allergies = [
    ...document.querySelectorAll("#profileAllergyRow .chip.active"),
  ].map((c) => c.dataset.diet);

  syncProfileUI();
  persistState();
  const initial = profile.name.trim().charAt(0).toUpperCase() || "M";
  document.getElementById("topName").textContent = profile.name;
  document.getElementById("topAvatar").textContent = initial;
  document.getElementById("profAvatar").textContent = initial;
  document.getElementById("dashGreeting").textContent =
    "Welcome back, " + profile.name.split(" ")[0] + " 👋";

  // reset filters to "all" so the profile-based default applies
  activeSavedFilter = "all";
  document
    .querySelectorAll("#filterRow .chip")
    .forEach((x) => x.classList.toggle("active", x.dataset.filter === "all"));
  activeMealAllergy = "all";
  document
    .querySelectorAll("#allergyFilterRow .chip")
    .forEach((x) => x.classList.toggle("active", x.dataset.allergy === "all"));

  renderSavedRecipes();
  renderWeek();

  const msg = document.getElementById("saveMsg");
  msg.classList.add("show");
  setTimeout(() => msg.classList.remove("show"), 2400);
}

/* =========================================================
     INIT
  ========================================================= */
renderDashboard();
renderSavedRecipes();
renderWeek();
renderRecipeDetail(currentRecipeId);
