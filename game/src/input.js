// Mouse and keyboard input: where a click lands, and which key does what. It only
// translates a position or a key into a world action; the world decides if it is legal.
import { INGREDIENTS, LAYOUT } from './config.js';

function inside(box, x, y) {
  return x >= box.x && x < box.x + box.width && y >= box.y && y < box.y + box.height;
}

function binBox(index) {
  const { bins } = LAYOUT;
  const col = index % bins.cols;
  const row = Math.floor(index / bins.cols);
  return { x: bins.x + col * bins.cell + 4, y: bins.y + row * bins.rowHeight + 4, width: 188, height: 96 };
}

export function binAt(x, y) {
  for (let index = 0; index < INGREDIENTS.length; index += 1) {
    if (inside(binBox(index), x, y)) return INGREDIENTS[index].id;
  }
  return null;
}

export function zoneAt(x, y) {
  if (inside(LAYOUT.board, x, y)) return 'board';
  if (inside(LAYOUT.wok, x, y)) return 'wok';
  if (inside(LAYOUT.plate, x, y)) return 'plate';
  if (inside(LAYOUT.serve, x, y)) return 'serve';
  if (inside(LAYOUT.trash, x, y)) return 'trash';
  const bin = binAt(x, y);
  if (bin) return `bin:${bin}`;
  return null;
}

/**
 * Handle one click at canvas coordinates (x, y). Returns the world events it caused,
 * so the caller can play sounds. `onTicket` is called with an order id when a ticket
 * is clicked (the caller may serve straight to it); tickets sit in the order board.
 */
export function handleClick(world, x, y) {
  const zone = zoneAt(x, y);
  if (!zone) return 0;
  if (zone === 'board') return world.useBoard();
  if (zone === 'wok') return world.useWok();
  if (zone === 'plate') return world.addToPlate();
  if (zone === 'serve') return world.serve();
  if (zone === 'trash') return world.trashPlate();
  if (zone.startsWith('bin:')) {
    world.grab(zone.slice(4));
    return 0;
  }
  return 0;
}

export function orderSlotAt(world, x, y) {
  const { orders } = LAYOUT;
  const { orderSlot } = LAYOUT;
  for (let index = 0; index < world.state.orders.length; index += 1) {
    const box = { x: orders.x + index * (orderSlot.width + orderSlot.gap), y: orders.y, width: orderSlot.width, height: orderSlot.height };
    if (inside(box, x, y)) return world.state.orders[index];
  }
  return null;
}

/**
 * Handle one key. Returns the world events it caused, or the string 'start' /
 * 'restart' when the key is a screen control rather than a kitchen action.
 */
export function handleKey(world, screen, key) {
  if (screen === 'title' && (key === 'Enter' || key === ' ')) return 'start';
  if (screen === 'over' && (key === 'r' || key === 'R' || key === 'Enter')) return 'restart';
  if (screen !== 'play') return 0;
  const lowered = key.toLowerCase();
  if (lowered === 'q') return world.useBoard();
  if (lowered === 'w') return world.useWok();
  if (lowered === 'e') return world.addToPlate();
  if (key === ' ' || key === 'Enter') return world.serve();
  if (key === 'Backspace' || key === 'Delete') return world.trashPlate();
  const ingredient = INGREDIENTS.find((item) => item.key === key);
  if (ingredient) {
    world.grab(ingredient.id);
    return 0;
  }
  return 0;
}
