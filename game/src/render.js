// Every picture the game draws, and nothing else: the night-market kitchen, the order
// board, the chopping board, the wok, the plate, the ingredient bins and both end
// screens. All art is drawn with canvas paths (no images, no fonts beyond the system
// sans), so the game renders the same in any desktop browser, offline.

import { FIELD, INGREDIENTS, INGREDIENT_BY_ID, LAYOUT, PREP_CHOP, PREP_COOK } from './config.js';

export const SCREEN_TITLE = 0;
export const SCREEN_PLAY = 1;
export const SCREEN_OVER = 2;

const CREAM = '#fff8e7';
const INK = '#2b2118';

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function text(ctx, value, x, y, size, color, weight = '700', align = 'left') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(value, x, y);
}

/** One ingredient's vector icon, drawn at (cx, cy) inside a circle of radius r. */
export function drawIngredient(ctx, id, cx, cy, r) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.lineWidth = Math.max(1.5, r * 0.08);
  if (id === 'noodle') {
    ctx.strokeStyle = '#f2c14e';
    for (let i = -1; i <= 1; i += 1) {
      ctx.beginPath();
      for (let x = -r; x <= r; x += 2) ctx.lineTo(x, i * r * 0.45 + Math.sin((x / r) * 3 + i) * r * 0.18);
      ctx.stroke();
    }
  } else if (id === 'rice') {
    ctx.fillStyle = '#f5f0e1';
    ctx.beginPath(); ctx.arc(0, r * 0.25, r * 0.85, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.1, r * 0.28, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.25, -r * 0.25, r * 0.3, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'egg') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(0, 0, r * 0.95, r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffb703';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'shrimp') {
    ctx.strokeStyle = '#ff8a6b'; ctx.lineWidth = r * 0.42; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, r * 0.1, r * 0.62, Math.PI * 0.15, Math.PI * 1.25); ctx.stroke();
    ctx.fillStyle = '#e63946';
    ctx.beginPath(); ctx.arc(r * 0.55, -r * 0.45, r * 0.16, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'chicken') {
    ctx.fillStyle = '#f2a594';
    ctx.beginPath(); ctx.arc(-r * 0.1, -r * 0.1, r * 0.62, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff8e7'; ctx.lineWidth = r * 0.16; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(r * 0.35, r * 0.35); ctx.lineTo(r * 0.85, r * 0.85); ctx.stroke();
  } else if (id === 'mushroom') {
    ctx.fillStyle = '#c9a37e';
    ctx.beginPath(); ctx.arc(0, -r * 0.15, r * 0.8, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#a67c52';
    ctx.beginPath(); ctx.arc(0, -r * 0.15, r * 0.8, Math.PI, 0); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f5f0e1';
    ctx.fillRect(-r * 0.22, -r * 0.15, r * 0.44, r * 0.75);
  } else if (id === 'coconut') {
    ctx.fillStyle = '#8b5e3c';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, -r * 0.1, r * 0.62, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'curry') {
    ctx.fillStyle = '#7fb069';
    ctx.beginPath(); ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#4e9a51'; ctx.lineWidth = r * 0.12;
    ctx.beginPath(); ctx.arc(0, 0, r * 0.45, 0.5, Math.PI * 1.6); ctx.stroke();
  } else if (id === 'basil') {
    ctx.fillStyle = '#4e9a51';
    ctx.beginPath(); ctx.ellipse(-r * 0.3, 0, r * 0.5, r * 0.75, -0.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(r * 0.35, -r * 0.1, r * 0.5, r * 0.75, 0.5, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'mango') {
    ctx.fillStyle = '#ffb703';
    ctx.beginPath(); ctx.ellipse(0, 0, r * 0.7, r * 0.9, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fb8500';
    ctx.beginPath(); ctx.ellipse(r * 0.15, r * 0.1, r * 0.45, r * 0.6, 0.4, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'peanut') {
    ctx.fillStyle = '#d9a066';
    ctx.beginPath(); ctx.ellipse(-r * 0.3, 0, r * 0.42, r * 0.6, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(r * 0.3, 0, r * 0.42, r * 0.6, -0.3, 0, Math.PI * 2); ctx.fill();
  } else if (id === 'chilli') {
    ctx.strokeStyle = '#e63946'; ctx.lineWidth = r * 0.34; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-r * 0.7, -r * 0.4); ctx.quadraticCurveTo(0, r * 0.7, r * 0.7, -r * 0.5); ctx.stroke();
    ctx.strokeStyle = '#4e9a51'; ctx.lineWidth = r * 0.14;
    ctx.beginPath(); ctx.moveTo(r * 0.7, -r * 0.5); ctx.lineTo(r * 0.95, -r * 0.85); ctx.stroke();
  }
  ctx.restore();
}

function drawProgressRing(ctx, cx, cy, r, progress, color) {
  ctx.strokeStyle = 'rgba(43,33,24,0.25)';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = color;
  ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2); ctx.stroke();
}

function drawPatienceBar(ctx, x, y, width, fraction) {
  ctx.fillStyle = 'rgba(43,33,24,0.2)';
  roundRect(ctx, x, y, width, 10, 5); ctx.fill();
  const color = fraction > 0.5 ? '#4e9a51' : fraction > 0.25 ? '#ffb703' : '#e63946';
  ctx.fillStyle = color;
  if (fraction > 0.01) { roundRect(ctx, x, y, width * fraction, 10, 5); ctx.fill(); }
}

function drawOrderTicket(ctx, order, x, y, width, height, time) {
  const urgent = order.patience / order.maxPatience < 0.3;
  ctx.fillStyle = urgent && Math.floor(time * 4) % 2 === 0 ? '#ffe3d6' : CREAM;
  roundRect(ctx, x, y, width, height, 12); ctx.fill();
  ctx.strokeStyle = '#d9a066'; ctx.lineWidth = 2; ctx.stroke();
  text(ctx, order.dish.name, x + 14, y + 28, 20, INK);
  text(ctx, `$${order.dish.price}`, x + width - 14, y + 28, 18, '#8b5e3c', '700', 'right');
  order.dish.needs.forEach((id, index) => {
    drawIngredient(ctx, id, x + 30 + index * 44, y + 58, 15);
  });
  drawPatienceBar(ctx, x + 14, y + height - 20, width - 28, Math.max(0, order.patience / order.maxPatience));
}

function drawKitchenBackdrop(ctx, time) {
  // Wall, awning stripes and floor tiles: the night-market stall.
  ctx.fillStyle = '#3d2c1e';
  ctx.fillRect(0, 0, FIELD.width, 400);
  ctx.fillStyle = '#5a3d24';
  for (let x = 0; x < FIELD.width; x += 80) ctx.fillRect(x, 0, 40, 400);
  for (let x = 0; x < FIELD.width; x += 160) {
    ctx.fillStyle = x % 320 === 0 ? '#e63946' : '#f2c14e';
    ctx.fillRect(x, 0, 80, 46);
  }
  // String lights.
  for (let i = 0; i < 12; i += 1) {
    const x = 60 + i * 106;
    const bob = Math.sin(time * 1.5 + i) * 3;
    ctx.fillStyle = i % 2 === 0 ? '#ffd166' : '#ff8a6b';
    ctx.beginPath(); ctx.arc(x, 58 + bob, 7, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#7a5a3a';
  ctx.fillRect(0, 400, FIELD.width, 320);
  ctx.fillStyle = '#8b6a45';
  for (let y = 400; y < FIELD.height; y += 64) ctx.fillRect(0, y, FIELD.width, 3);
  for (let x = 0; x < FIELD.width; x += 128) ctx.fillRect(x, 400, 3, 320);
}

function drawTopBar(ctx, world) {
  const { state } = world;
  ctx.fillStyle = 'rgba(20,12,6,0.85)';
  ctx.fillRect(0, 0, FIELD.width, 64);
  text(ctx, 'WOK RUSH', 20, 42, 30, '#ffd166');
  text(ctx, 'Bangkok night market', 190, 40, 15, '#f5f0e1', '400');
  const fraction = Math.max(0, state.timeLeft / 150);
  text(ctx, 'SHIFT', 560, 26, 13, '#f5f0e1', '700');
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  roundRect(ctx, 560, 32, 220, 16, 8); ctx.fill();
  ctx.fillStyle = fraction > 0.3 ? '#4e9a51' : '#e63946';
  roundRect(ctx, 560, 32, 220 * fraction, 16, 8); ctx.fill();
  const mm = Math.floor(state.timeLeft / 60);
  const ss = Math.floor(state.timeLeft % 60).toString().padStart(2, '0');
  text(ctx, `${mm}:${ss}`, 790, 46, 20, '#ffffff', '700');
  text(ctx, `SCORE ${state.score}`, 880, 42, 22, '#ffffff');
  text(ctx, state.combo > 1 ? `COMBO x${state.combo}` : '', 1060, 42, 18, '#ffd166');
  for (let i = 0; i < 3; i += 1) {
    ctx.fillStyle = i < state.hearts ? '#e63946' : 'rgba(255,255,255,0.25)';
    ctx.beginPath(); ctx.arc(1210 + i * 24, 32, 9, 0, Math.PI * 2); ctx.fill();
  }
  text(ctx, `LV ${state.level}`, 1150, 60, 13, '#ffd166', '700', 'right');
}

function drawStation(ctx, box, title, hint, body) {
  ctx.fillStyle = 'rgba(20,12,6,0.55)';
  roundRect(ctx, box.x, box.y, box.width, box.height, 14); ctx.fill();
  ctx.strokeStyle = '#d9a066'; ctx.lineWidth = 2; ctx.stroke();
  text(ctx, title, box.x + 16, box.y + 28, 17, '#ffd166');
  text(ctx, hint, box.x + box.width - 16, box.y + 28, 13, '#f5f0e1', '400', 'right');
  body();
}

function drawBoard(ctx, world, time) {
  const { board } = LAYOUT;
  drawStation(ctx, board, 'CHOPPING BOARD', 'click · Q', () => {
    ctx.fillStyle = '#c9a37e';
    roundRect(ctx, board.x + 30, board.y + 56, 240, 90, 10); ctx.fill();
    ctx.strokeStyle = '#8b6a45'; ctx.lineWidth = 3; ctx.stroke();
    if (world.state.board) {
      const item = world.state.board;
      drawIngredient(ctx, item.id, board.x + 150, board.y + 96, 34);
      drawProgressRing(ctx, board.x + 150, board.y + 96, 46, item.progress, '#4e9a51');
      text(ctx, item.progress >= 1 ? 'READY — click to take' : 'chopping…', board.x + 150, board.y + 172, 14, CREAM, '700', 'center');
    } else {
      text(ctx, 'Put a raw ingredient here', board.x + 150, board.y + 100, 14, '#f5f0e1', '400', 'center');
      text(ctx, 'shrimp · chicken · mushroom · mango', board.x + 150, board.y + 126, 13, '#d9c9a8', '400', 'center');
    }
  });
}

function drawWok(ctx, world, time) {
  const { wok } = LAYOUT;
  drawStation(ctx, wok, 'WOK', 'click · W', () => {
    ctx.fillStyle = '#1d1a17';
    ctx.beginPath(); ctx.arc(wok.x + 150, wok.y + 82, 62, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#5a5348'; ctx.lineWidth = 4; ctx.stroke();
    if (world.state.wok) {
      const item = world.state.wok;
      drawIngredient(ctx, item.id, wok.x + 150, wok.y + 82, 30);
      drawProgressRing(ctx, wok.x + 150, wok.y + 82, 48, item.progress, '#ff8a6b');
      text(ctx, item.progress >= 1 ? 'READY — click to take' : 'sizzling…', wok.x + 150, wok.y + 172, 14, CREAM, '700', 'center');
      // Steam.
      ctx.strokeStyle = 'rgba(255,248,231,0.7)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i += 1) {
        const sx = wok.x + 120 + i * 30 + Math.sin(time * 3 + i * 2) * 6;
        ctx.beginPath(); ctx.moveTo(sx, wok.y + 40); ctx.quadraticCurveTo(sx + 8, wok.y + 22, sx - 4, wok.y + 6); ctx.stroke();
      }
    } else {
      text(ctx, 'Noodles & rice cook here', wok.x + 150, wok.y + 100, 14, '#f5f0e1', '400', 'center');
      text(ctx, '3 seconds on the flame', wok.x + 150, wok.y + 126, 13, '#d9c9a8', '400', 'center');
    }
  });
}

function drawPlate(ctx, world) {
  const { plate, serve } = LAYOUT;
  drawStation(ctx, plate, 'PLATE', 'click · E to add', () => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.ellipse(plate.x + 150, plate.y + 100, 110, 62, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#d9c9a8'; ctx.lineWidth = 3; ctx.stroke();
    const items = world.state.plate;
    items.forEach((id, index) => {
      const x = plate.x + 150 + (index - (items.length - 1) / 2) * 46;
      drawIngredient(ctx, id, x, plate.y + 100, 17);
    });
    if (items.length === 0) {
      text(ctx, 'Build a dish here', plate.x + 150, plate.y + 104, 14, '#8b7a5e', '400', 'center');
    }
  });
  // Serve button, glowing when the plate matches an order.
  const ready = world.state.plate.length > 0 && world.state.orders.some((order) => {
    if (order.dish.needs.length !== world.state.plate.length) return false;
    const counts = {};
    for (const id of world.state.plate) counts[id] = (counts[id] || 0) + 1;
    return order.dish.needs.every((id) => counts[id]);
  });
  ctx.fillStyle = ready ? '#4e9a51' : '#8b7a5e';
  roundRect(ctx, serve.x, serve.y, serve.width, serve.height, 10); ctx.fill();
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2; ctx.stroke();
  text(ctx, ready ? 'SERVE IT!  ✓' : 'SERVE  (Space)', serve.x + serve.width / 2, serve.y + 29, 17, '#ffffff', '700', 'center');
  if (world.state.hand) {
    const item = INGREDIENT_BY_ID[world.state.hand.id];
    text(ctx, `In hand: ${item.name}${world.state.hand.prepped ? ' ✓' : ' (raw)'}`, plate.x + 150, plate.y + 178, 13, '#ffd166', '700', 'center');
  }
}

function drawBins(ctx, world) {
  const { bins } = LAYOUT;
  text(ctx, 'INGREDIENTS — click a bin, or press its key', bins.x + 4, bins.y - 8, 15, '#ffd166');
  INGREDIENTS.forEach((item, index) => {
    const col = index % bins.cols;
    const row = Math.floor(index / bins.cols);
    const x = bins.x + col * bins.cell + 4;
    const y = bins.y + row * bins.rowHeight + 4;
    const inHand = world.state.hand && world.state.hand.id === item.id;
    ctx.fillStyle = inHand ? '#ffe9a8' : '#fff8e7';
    roundRect(ctx, x, y, 188, 96, 10); ctx.fill();
    ctx.strokeStyle = inHand ? '#e63946' : '#d9a066'; ctx.lineWidth = inHand ? 3 : 2; ctx.stroke();
    drawIngredient(ctx, item.id, x + 34, y + 48, 24);
    text(ctx, item.name, x + 66, y + 42, 15, INK);
    const prep = item.prep === PREP_CHOP ? 'chop it' : item.prep === PREP_COOK ? 'cook it' : 'ready';
    text(ctx, prep, x + 66, y + 66, 12, '#8b7a5e', '400');
    text(ctx, `[${item.key}]`, x + 66, y + 86, 12, '#8b5e3c', '700');
  });
  // Trash bin.
  const trash = LAYOUT.trash;
  ctx.fillStyle = '#5a3d24';
  roundRect(ctx, trash.x, trash.y, trash.width, trash.height, 8); ctx.fill();
  text(ctx, 'TRASH', trash.x + trash.width / 2, trash.y + 26, 13, '#ffffff', '700', 'center');
  text(ctx, 'Bksp', trash.x + trash.width / 2, trash.y + 46, 11, '#d9c9a8', '400', 'center');
}

export function drawGame(ctx, world, screen, time) {
  drawKitchenBackdrop(ctx, time);
  drawTopBar(ctx, world);
  // Order board.
  const { orders, orderSlot } = LAYOUT;
  text(ctx, 'ORDER BOARD', orders.x + 2, orders.y - 8, 15, '#ffd166');
  world.state.orders.forEach((order, index) => {
    drawOrderTicket(ctx, order, orders.x + index * (orderSlot.width + orderSlot.gap), orders.y, orderSlot.width, orderSlot.height, time);
  });
  for (let index = world.state.orders.length; index < 3; index += 1) {
    ctx.fillStyle = 'rgba(255,248,231,0.12)';
    roundRect(ctx, orders.x + index * (orderSlot.width + orderSlot.gap), orders.y, orderSlot.width, orderSlot.height, 12); ctx.fill();
    text(ctx, 'waiting for a customer…', orders.x + index * (orderSlot.width + orderSlot.gap) + 20, orders.y + 54, 15, 'rgba(255,248,231,0.6)', '400');
  }
  drawBoard(ctx, world, time);
  drawWok(ctx, world, time);
  drawPlate(ctx, world);
  drawBins(ctx, world);
  if (world.state.message && world.state.messageTimer > 0) {
    ctx.fillStyle = 'rgba(20,12,6,0.8)';
    const width = 420;
    roundRect(ctx, (FIELD.width - width) / 2, 176, width, 34, 17); ctx.fill();
    text(ctx, world.state.message, FIELD.width / 2, 199, 16, '#ffd166', '700', 'center');
  }
  if (screen === SCREEN_TITLE) drawTitle(ctx, world, time);
  if (screen === SCREEN_OVER) drawOver(ctx, world);
}

function drawTitle(ctx, world, time) {
  ctx.fillStyle = 'rgba(20,12,6,0.72)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  text(ctx, 'WOK RUSH', FIELD.width / 2, 190, 84, '#ffd166', '800', 'center');
  text(ctx, 'a Bangkok night-market cooking game', FIELD.width / 2, 232, 24, '#fff8e7', '400', 'center');
  const lines = [
    'Customers order off the board — build each dish on the plate.',
    'Click an ingredient, chop it on the board or cook it in the wok,',
    'then add it to the plate and SERVE before patience runs out.',
    'Keys: 1–0 pick ingredients · Q chop · W wok · E add · Space serve · Bksp trash',
  ];
  lines.forEach((line, index) => text(ctx, line, FIELD.width / 2, 300 + index * 32, 19, '#f5f0e1', '400', 'center'));
  const pulse = 0.7 + Math.sin(time * 3) * 0.3;
  ctx.fillStyle = `rgba(255,209,102,${pulse})`;
  ctx.font = '700 26px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Press ENTER or click to start the shift', FIELD.width / 2, 480);
  text(ctx, '150 seconds · 3 hearts · 5 dishes on the menu', FIELD.width / 2, 520, 16, '#d9c9a8', '400', 'center');
}

function drawOver(ctx, world) {
  const { state } = world;
  ctx.fillStyle = 'rgba(20,12,6,0.78)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  text(ctx, state.hearts <= 0 ? 'SHIFT OVER — the stall is closed!' : 'SHIFT COMPLETE!', FIELD.width / 2, 200, 52, '#ffd166', '800', 'center');
  text(ctx, `Final score: ${state.score}`, FIELD.width / 2, 280, 32, '#ffffff', '700', 'center');
  text(ctx, `Dishes served: ${state.served}   ·   Walked away: ${state.missed}   ·   Best combo: x${state.bestCombo}`, FIELD.width / 2, 330, 20, '#f5f0e1', '400', 'center');
  const verdict = state.score >= 1500 ? 'Head chef material — the night market loves you.' : state.score >= 800 ? 'Solid service. The wok is getting hot.' : 'A quiet night. Practice the rush and come back.';
  text(ctx, verdict, FIELD.width / 2, 380, 19, '#ffd166', '400', 'center');
  text(ctx, 'Press R to cook another shift', FIELD.width / 2, 450, 22, '#ffffff', '700', 'center');
}
