// Wok Rush — a Bangkok night-market cooking game.
// config.js: every number, ingredient and recipe the game uses. Nothing here draws or
// listens; world.js reads it for the rules, render.js for the pictures, input.js for keys.

export const FIELD = { width: 1280, height: 720 };

export const SHIFT_SECONDS = 150;
export const MAX_ORDERS = 3;
export const MAX_HEARTS = 3;
export const CHOP_SECONDS = 2.0;
export const COOK_SECONDS = 3.0;
export const STEP = 1 / 60;

// How fast new orders arrive and how long a customer waits, by level.
export const LEVEL = {
  spawnEvery: [14, 12, 10, 8, 7],
  patience: [50, 46, 42, 38, 34],
  servedPerLevel: 4,
};

// One prep step each ingredient needs before it can go on a plate.
export const PREP_NONE = 0;
export const PREP_CHOP = 1;
export const PREP_COOK = 2;

// The twelve ingredients on the counter, in the order they sit on the shelf.
export const INGREDIENTS = [
  { id: 'noodle', name: 'Noodles', prep: PREP_COOK, color: '#f2c14e', key: '1' },
  { id: 'rice', name: 'Rice', prep: PREP_COOK, color: '#f5f0e1', key: '2' },
  { id: 'egg', name: 'Egg', prep: PREP_NONE, color: '#fff3d6', key: '3' },
  { id: 'shrimp', name: 'Shrimp', prep: PREP_CHOP, color: '#ff8a6b', key: '4' },
  { id: 'chicken', name: 'Chicken', prep: PREP_CHOP, color: '#f2a594', key: '5' },
  { id: 'mushroom', name: 'Mushroom', prep: PREP_CHOP, color: '#c9a37e', key: '6' },
  { id: 'coconut', name: 'Coconut milk', prep: PREP_NONE, color: '#ffffff', key: '7' },
  { id: 'curry', name: 'Green curry', prep: PREP_NONE, color: '#7fb069', key: '8' },
  { id: 'basil', name: 'Basil', prep: PREP_NONE, color: '#4e9a51', key: '9' },
  { id: 'mango', name: 'Mango', prep: PREP_CHOP, color: '#ffb703', key: '0' },
  { id: 'peanut', name: 'Peanuts', prep: PREP_NONE, color: '#d9a066', key: '-' },
  { id: 'chilli', name: 'Chilli', prep: PREP_NONE, color: '#e63946', key: '=' },
];

export const INGREDIENT_BY_ID = Object.fromEntries(INGREDIENTS.map((item) => [item.id, item]));

// The five dishes on the menu. `needs` lists ingredient ids; the prep each one needs
// is looked up from INGREDIENTS, so a dish is only servable once everything is prepped.
export const RECIPES = [
  { id: 'padthai', name: 'Pad Thai', price: 120, needs: ['noodle', 'egg', 'shrimp', 'peanut'] },
  { id: 'greencurry', name: 'Green Curry', price: 140, needs: ['curry', 'coconut', 'chicken', 'basil'] },
  { id: 'tomyum', name: 'Tom Yum', price: 130, needs: ['shrimp', 'mushroom', 'chilli', 'coconut'] },
  { id: 'friedrice', name: 'Fried Rice', price: 110, needs: ['rice', 'egg', 'chicken', 'chilli'] },
  { id: 'mangorice', name: 'Mango Sticky Rice', price: 100, needs: ['mango', 'rice', 'coconut'] },
];

export const RECIPE_BY_ID = Object.fromEntries(RECIPES.map((dish) => [dish.id, dish]));

// Where things sit on the 1280x720 canvas. render.js and input.js share these boxes.
export const LAYOUT = {
  topBar: { x: 0, y: 0, width: 1280, height: 64 },
  orders: { x: 16, y: 76, width: 1248, height: 96 },
  orderSlot: { width: 400, height: 96, gap: 24 },
  board: { x: 40, y: 196, width: 300, height: 190 },
  wok: { x: 490, y: 196, width: 300, height: 190 },
  plate: { x: 940, y: 196, width: 300, height: 190 },
  bins: { x: 40, y: 416, width: 1200, height: 220, cols: 6, cell: 196, rowHeight: 108 },
  trash: { x: 1150, y: 640, width: 90, height: 60 },
  serve: { x: 990, y: 330, width: 200, height: 44 },
};
