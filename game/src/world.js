// The game's rules and state, with no drawing and no browser in it: orders arriving and
// expiring, the chopping board and the wok, the plate being assembled, serving, score,
// combo, hearts and the shift timer. step() advances one fixed step and returns what
// happened as bit flags, so the caller can play a sound without the world knowing about
// screens or audio. Nothing here allocates after createWorld returns.

import {
  CHOP_SECONDS, COOK_SECONDS, INGREDIENT_BY_ID, LEVEL, MAX_HEARTS, MAX_ORDERS,
  PREP_CHOP, PREP_COOK, PREP_NONE, RECIPES, SHIFT_SECONDS,
} from './config.js';
import { pick } from './random.js';

export const EVENT_CHOP_DONE = 1;
export const EVENT_COOK_DONE = 2;
export const EVENT_SERVED = 4;
export const EVENT_WRONG = 8;
export const EVENT_ORDER_LOST = 16;
export const EVENT_LEVEL_UP = 32;
export const EVENT_OVER = 64;
export const EVENT_PICKUP = 128;

function sameDish(plate, needs) {
  if (plate.length !== needs.length) return false;
  const counts = {};
  for (const id of plate) counts[id] = (counts[id] || 0) + 1;
  for (const id of needs) {
    if (!counts[id]) return false;
    counts[id] -= 1;
  }
  return true;
}

function levelFor(served) {
  return Math.min(LEVEL.spawnEvery.length, 1 + Math.floor(served / LEVEL.servedPerLevel));
}

export function createWorld(random) {
  const state = {
    timeLeft: SHIFT_SECONDS,
    elapsed: 0,
    score: 0,
    combo: 0,
    bestCombo: 0,
    served: 0,
    missed: 0,
    hearts: MAX_HEARTS,
    level: 1,
    over: false,
    orders: [],
    plate: [],
    hand: null, // { id, prepped: boolean }
    board: null, // { id, progress }
    wok: null, // { id, progress }
    spawnTimer: 2,
    nextOrderId: 1,
    message: '',
    messageTimer: 0,
  };

  function spawnOrder() {
    if (state.orders.length >= MAX_ORDERS) return;
    const dish = pick(random, RECIPES);
    const patience = LEVEL.patience[state.level - 1];
    state.orders.push({ id: state.nextOrderId, dish, patience, maxPatience: patience });
    state.nextOrderId += 1;
  }

  function reset() {
    state.timeLeft = SHIFT_SECONDS;
    state.elapsed = 0;
    state.score = 0;
    state.combo = 0;
    state.bestCombo = 0;
    state.served = 0;
    state.missed = 0;
    state.hearts = MAX_HEARTS;
    state.level = 1;
    state.over = false;
    state.orders = [];
    state.plate = [];
    state.hand = null;
    state.board = null;
    state.wok = null;
    state.spawnTimer = 2;
    state.nextOrderId = 1;
    state.message = '';
    state.messageTimer = 0;
  }

  /** Take an ingredient from its counter bin into the hand. */
  function grab(ingredientId) {
    if (state.over) return false;
    const item = INGREDIENT_BY_ID[ingredientId];
    if (!item) return false;
    state.hand = { id: ingredientId, prepped: item.prep === PREP_NONE };
    return true;
  }

  /** Put the hand's raw ingredient on the chopping board, or pick up a finished one. */
  function useBoard() {
    if (state.over) return 0;
    if (state.board) {
      if (state.board.progress < 1) return 0;
      if (state.hand) return 0;
      state.hand = { id: state.board.id, prepped: true };
      state.board = null;
      return EVENT_PICKUP;
    }
    if (!state.hand || state.hand.prepped) return 0;
    if (INGREDIENT_BY_ID[state.hand.id].prep !== PREP_CHOP) return 0;
    state.board = { id: state.hand.id, progress: 0 };
    state.hand = null;
    return 0;
  }

  /** Put the hand's raw ingredient in the wok, or pick up a finished one. */
  function useWok() {
    if (state.over) return 0;
    if (state.wok) {
      if (state.wok.progress < 1) return 0;
      if (state.hand) return 0;
      state.hand = { id: state.wok.id, prepped: true };
      state.wok = null;
      return EVENT_PICKUP;
    }
    if (!state.hand || state.hand.prepped) return 0;
    if (INGREDIENT_BY_ID[state.hand.id].prep !== PREP_COOK) return 0;
    state.wok = { id: state.hand.id, progress: 0 };
    state.hand = null;
    return 0;
  }

  /** Add the hand's ready ingredient to the plate being assembled. */
  function addToPlate() {
    if (state.over || !state.hand || !state.hand.prepped) return 0;
    state.plate.push(state.hand.id);
    state.hand = null;
    return EVENT_PICKUP;
  }

  /** Empty the plate into the bin. Costs the combo, never points. */
  function trashPlate() {
    if (state.over || state.plate.length === 0) return 0;
    state.plate = [];
    state.combo = 0;
    state.message = 'Tossed it — combo lost';
    state.messageTimer = 1.5;
    return 0;
  }

  /** Serve the plate to the first order it matches exactly. */
  function serve() {
    if (state.over || state.plate.length === 0) return 0;
    for (let index = 0; index < state.orders.length; index += 1) {
      const order = state.orders[index];
      if (!sameDish(state.plate, order.dish.needs)) continue;
      const tip = Math.round((order.patience / order.maxPatience) * 60);
      const comboBonus = state.combo * 10;
      const earned = order.dish.price + tip + comboBonus;
      state.score += earned;
      state.served += 1;
      state.combo += 1;
      state.bestCombo = Math.max(state.bestCombo, state.combo);
      state.plate = [];
      state.orders.splice(index, 1);
      state.message = `Served ${order.dish.name}! +${earned}`;
      state.messageTimer = 2;
      const nextLevel = levelFor(state.served);
      let events = EVENT_SERVED;
      if (nextLevel > state.level) {
        state.level = nextLevel;
        events |= EVENT_LEVEL_UP;
      }
      return events;
    }
    state.combo = 0;
    state.message = 'No order wants that dish';
    state.messageTimer = 1.5;
    return EVENT_WRONG;
  }

  function step(dt) {
    let events = 0;
    if (state.over) return events;
    state.elapsed += dt;
    state.timeLeft -= dt;
    if (state.messageTimer > 0) state.messageTimer -= dt;

    if (state.board && state.board.progress < 1) {
      state.board.progress = Math.min(1, state.board.progress + dt / CHOP_SECONDS);
      if (state.board.progress >= 1) events |= EVENT_CHOP_DONE;
    }
    if (state.wok && state.wok.progress < 1) {
      state.wok.progress = Math.min(1, state.wok.progress + dt / COOK_SECONDS);
      if (state.wok.progress >= 1) events |= EVENT_COOK_DONE;
    }

    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      spawnOrder();
      state.spawnTimer = LEVEL.spawnEvery[state.level - 1];
    }

    for (let index = state.orders.length - 1; index >= 0; index -= 1) {
      const order = state.orders[index];
      order.patience -= dt;
      if (order.patience <= 0) {
        state.orders.splice(index, 1);
        state.missed += 1;
        state.hearts -= 1;
        state.combo = 0;
        state.message = `${order.dish.name} walked away!`;
        state.messageTimer = 2;
        events |= EVENT_ORDER_LOST;
      }
    }

    if (state.hearts <= 0 || state.timeLeft <= 0) {
      state.over = true;
      state.timeLeft = Math.max(0, state.timeLeft);
      events |= EVENT_OVER;
    }
    return events;
  }

  reset();
  return { state, reset, step, grab, useBoard, useWok, addToPlate, trashPlate, serve, levelFor };
}
