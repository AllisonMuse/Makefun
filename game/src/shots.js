// The screenshot scenes behind ?shot=start|play|serve|end. Each one drives the real
// world through its public actions (grab, chop, cook, add to plate, serve) with a fixed
// seed, so the frame is a genuine game state and the same seed always gives the same
// frame — never a mock-up drawn only for the screenshot.
import { RECIPES, STEP } from './config.js';
import { SCREEN_OVER, SCREEN_PLAY, SCREEN_TITLE } from './render.js';

const SAMPLE = STEP;

function stepFor(world, seconds) {
  for (let index = 0; index < seconds / SAMPLE; index += 1) world.step(SAMPLE);
}

function orderFor(dishId, patience) {
  const dish = RECIPES.find((recipe) => recipe.id === dishId);
  return { id: dishId === 'padthai' ? 1 : 2, dish, patience, maxPatience: 50 };
}

/** Chop one ingredient and leave it in the hand, ready for the plate. */
function chopToHand(world, id) {
  world.grab(id);
  world.useBoard();
  stepFor(world, 2.2);
  world.useBoard();
}

/** Cook one ingredient and leave it in the hand, ready for the plate. */
function cookToHand(world, id) {
  world.grab(id);
  world.useWok();
  stepFor(world, 3.2);
  world.useWok();
}

/**
 * Set `world` to the named scene and return the screen to draw over it.
 * start: the title over a live kitchen. play: a Pad Thai mid-assembly, shrimp still
 * being chopped. serve: the finished Pad Thai on the plate, SERVE glowing, score on
 * the board. end: the shift-complete screen with a final score.
 */
export function stageShot(name, world) {
  world.reset();
  if (name === 'play') {
    stepFor(world, 3);
    world.state.orders = [orderFor('padthai', 38), orderFor('greencurry', 44)];
    world.state.timeLeft = 128;
    world.state.score = 120;
    world.state.served = 1;
    world.state.combo = 1;
    cookToHand(world, 'noodle');
    world.addToPlate();
    world.grab('egg');
    world.addToPlate();
    world.grab('shrimp');
    world.useBoard();
    stepFor(world, 1.1);
    return { screen: SCREEN_PLAY, best: 0 };
  }
  if (name === 'serve') {
    stepFor(world, 3);
    world.state.orders = [orderFor('padthai', 41), orderFor('tomyum', 30)];
    world.state.timeLeft = 96;
    cookToHand(world, 'noodle');
    world.addToPlate();
    world.grab('egg');
    world.addToPlate();
    chopToHand(world, 'shrimp');
    world.addToPlate();
    world.grab('peanut');
    world.addToPlate();
    world.state.score = 340;
    world.state.served = 2;
    world.state.combo = 2;
    return { screen: SCREEN_PLAY, best: 0 };
  }
  if (name === 'end') {
    world.state.over = true;
    world.state.timeLeft = 0;
    world.state.hearts = 0;
    world.state.score = 1240;
    world.state.served = 9;
    world.state.missed = 2;
    world.state.bestCombo = 4;
    world.state.orders = [];
    return { screen: SCREEN_OVER, best: 1240 };
  }
  stepFor(world, 5);
  return { screen: SCREEN_TITLE, best: 0 };
}
