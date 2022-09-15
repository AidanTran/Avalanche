let myGame = new Game();
let myEngine = new Engine(myGame.update.bind(myGame), () => {
  return;
});

let liveGame = false;

$(".start-button").on("click", function () {
  liveGame = true;
  myEngine.start();
  $("#live-game").css("display", "block");
  $("#menu").css("display", "none");
});
