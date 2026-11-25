// The game's loop: fixed-step simulation, mouse and keyboard input, screen switching
// (title -> play -> over), sounds for the world's events, and the screenshot scenes
// behind ?shot=. The canvas is 1280x720 inside and scales to the window.
import { FIELD, STEP } from './config.js';
import { mulberry32 } from './random.js';
import {
  EVENT_CHOP_DONE, EVENT_COOK_DONE, EVENT_LEVEL_UP, EVENT_ORDER_LOST, EVENT_OVER,
  EVENT_SERVED, EVENT_WRONG, createWorld,
} from './world.js';
import { handleClick, handleKey, orderSlotAt } from './input.js';
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE, drawGame } from './render.js';
import { createAudio } from './audio.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');

const params = new URLSearchParams(window.location.search);
const seedParam = Number(params.get('seed') || '1');
const random = mulberry32(Number.isFinite(seedParam) ? seedParam : 1);
const world = createWorld(random);
const audio = createAudio();

let screen = SCREEN_TITLE;
let time = 0;
let accumulator = 0;
let last = performance.now();
let best = 0;

function resize() {
  const scale = Math.min(window.innerWidth / FIELD.width, window.innerHeight / FIELD.height);
  canvas.width = Math.round(FIELD.width * scale * window.devicePixelRatio);
  canvas.height = Math.round(FIELD.height * scale * window.devicePixelRatio);
  canvas.style.width = `${Math.round(FIELD.width * scale)}px`;
  canvas.style.height = `${Math.round(FIELD.height * scale)}px`;
  ctx.setTransform(canvas.width / FIELD.width, 0, 0, canvas.height / FIELD.height, 0, 0);
}

function announce() {
  const { state } = world;
  status.textContent = `Score ${state.score}. ${state.orders.length} orders waiting. ${state.plate.length} ingredients on the plate. ${Math.ceil(state.timeLeft)} seconds left in the shift.`;
}

function playEvents(events) {
  if (events & EVENT_CHOP_DONE) audio.chop();
  if (events & EVENT_COOK_DONE) audio.sizzle();
  if (events & EVENT_SERVED) audio.served();
  if (events & EVENT_WRONG) audio.wrong();
  if (events & EVENT_ORDER_LOST) audio.lost();
  if (events & EVENT_LEVEL_UP) audio.levelUp();
  if (events & EVENT_OVER) audio.lost();
}

function startShift() {
  world.reset();
  screen = SCREEN_PLAY;
  announce();
}

function toCanvas(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * FIELD.width,
    y: ((event.clientY - rect.top) / rect.height) * FIELD.height,
  };
}

canvas.addEventListener('click', (event) => {
  if (screen === SCREEN_TITLE) { startShift(); return; }
  if (screen === SCREEN_OVER) { startShift(); return; }
  const { x, y } = toCanvas(event);
  const order = orderSlotAt(world, x, y);
  if (order) {
    // Clicking a ticket serves the plate straight to that order when it matches.
    playEvents(world.serve());
    announce();
    return;
  }
  playEvents(handleClick(world, x, y));
  announce();
});

window.addEventListener('keydown', (event) => {
  if ([' ', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) event.preventDefault();
  const result = handleKey(world, screen, event.key);
  if (result === 'start' || result === 'restart') { startShift(); return; }
  if (typeof result === 'number') playEvents(result);
  announce();
});

window.addEventListener('resize', resize);
resize();

// A ?shot= URL stages a deterministic scene for screenshots: the real rules, played
// forward from a fresh world by a scripted cook, so the frame is a genuine game state.
const shot = params.get('shot');
if (shot) {
  const staged = stageShot(shot, world);
  screen = staged.screen;
  best = staged.best;
} else {
  // Title screen backdrop: a quiet kitchen with orders already on the board.
  for (let index = 0; index < 5 / STEP; index += 1) world.step(STEP);
}

function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  time += dt;
  if (screen === SCREEN_PLAY) {
    accumulator += dt;
    while (accumulator >= STEP) {
      accumulator -= STEP;
      const events = world.step(STEP);
      playEvents(events);
      if (world.state.over) {
        screen = SCREEN_OVER;
        best = Math.max(best, world.state.score);
        announce();
        break;
      }
    }
  }
  drawGame(ctx, world, screen, time);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
