class Controller {
  constructor(game, startEngine, stopEngine) {
    this.game = game;
    this.startEngine = startEngine;
    this.stopEngine = stopEngine;
  }
}

$(".start-button").on("click", function () {
  myEngine.start();
  $("#live-game").css("display", "block");
  $("#menu").css("display", "none");
});

$(".stop-button").on("click", function () {
  myEngine.stop();
});
