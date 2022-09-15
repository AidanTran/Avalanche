/**
 * INSTANTIATION:
 * These are the first lines of code to be executed. Here we generate a couple things:
 * 1. Game - The actual game. The world, player, boxes, and physics.
 * 2. Display - Manipulates DOM elements depending on state of Game. Requires Game to be passed in.
 * 3. Controller - Handles user input. This is where keystroke changes are saved, and this is where button presses are processed.
 * 4. keyDownUp - Function that passes event to controller eventHandler logic.
 * 5. update - Function that bundles both the game update and display render. Engine will call this whenever the browser is ready to animate a frame.
 * 6. Engine - Code that, once started, will run requestAnimationFrame on loop (target 60 times per second on most browsers) and call update repeatedly until stop is called.
 */

let myGame = new Game();
let myDisplay = new Display(myGame);
let myController = new Controller();

let keyDownUp = function (event) {
  myController.keyDownUp(event.type, event.keyCode);
};

let update = function (timeElapsed) {
  myGame.update(timeElapsed, myController);
  myDisplay.render(timeElapsed);
};

let myEngine = new Engine(update);

window.addEventListener("keydown", keyDownUp);
window.addEventListener("keyup", keyDownUp);
