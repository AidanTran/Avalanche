let myGame = new Game();
let myDisplay = new Display(myGame);
let myEngine = new Engine(
  myGame.update.bind(myGame),
  myDisplay.render.bind(myDisplay)
);
let myController = new Controller(
  myGame,
  myEngine.start.bind(myEngine),
  myEngine.stop.bind(myEngine)
);
