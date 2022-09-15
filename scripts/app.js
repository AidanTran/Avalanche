let myGame = new Game();
let myDisplay = new Display(myGame);
let myController = new Controller();
// myGame,
// myEngine.start.bind(myEngine),
// myEngine.stop.bind(myEngine)

let keyDownUp = function (event) {
  myController.keyDownUp(event.type, event.keyCode);
};

let update = function (timeElapsed) {
  if (myController.left.active) {
    myGame.world.player.moveLeft();
  }
  if (myController.right.active) {
    myGame.world.player.moveRight();
  }
  if (myController.up.active) {
    myGame.world.player.jump();
  }

  myGame.update(timeElapsed);
  myDisplay.render(timeElapsed);
};

let myEngine = new Engine(update);

window.addEventListener("keydown", keyDownUp);
window.addEventListener("keyup", keyDownUp);
