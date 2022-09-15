let myGame = new Game();
let myDisplay = new Display(myGame);
let myEngine = new Engine(
  myGame.update.bind(myGame),
  myDisplay.render.bind(myDisplay)
);
