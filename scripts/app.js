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
let myController = new Controller();
let myDisplay = new Display();

let keyDownUp = function (event) {
  myController.keyDownUp(event.type, event.keyCode);
};

const FRAMETHRESHOLD = 100;
let update = function (timeElapsed) {
  if (timeElapsed < FRAMETHRESHOLD) {
    if (myGame.update(timeElapsed, myController)) {
      this.pause();
      $('audio#music')[0].pause()
      $("#live-game").css("display", "none");
      $("#menu").css("display", "block");
      $("#highScore").text("High Score: "+parseInt($("#livegame-score").text(), 10));
    }
    myDisplay.render(myController, myGame);
  }
};

let myEngine = new Engine(update);

window.addEventListener("keydown", keyDownUp);
window.addEventListener("keyup", keyDownUp);

$(".start-button").on("click", function () {
  myGame.restart();
  myDisplay.reset();
  myDisplay.initialize(myGame);
  myEngine.start(); // Direct reference to myEngine here, I eventually want to get rid of that.
  $("#live-game").css("display", "block");
  $("#menu").css("display", "none");
  $('audio#music')[0].play()
});

$(".pause-button").on("click", function () {
  if (myEngine.done) {
    myEngine.start();
    $('audio#music')[0].play()
  } else {
    myEngine.pause();
    $('audio#music')[0].pause()
  }
});

$(".redo-button").on("click", function () {
  myEngine.pause();
  $('audio#music')[0].pause()
  $("#live-game").css("display", "none");
  $("#menu").css("display", "block");
});
