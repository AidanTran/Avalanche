import Engine from "./engine.js";

let Engine = Engine();

let liveGame = false;

let height = 0;

let player = {};

$(".start-button").on("click", function () {
  liveGame = true;
  $("#live-game").css("display", "block");
  $("#menu").css("display", "none");
});
