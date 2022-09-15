let liveGame = false;

class Display {
  constructor(game) {
    this.game = game;
    this.color = 0;
    $("#player").css("width", this.game.world.player.width + "%");
    $("#player").css("height", this.game.world.player.height + "%");
  }

  render(timeElapsed) {
    $("#player").css("left", this.game.world.player.x + "%");
    this.color += parseInt(timeElapsed / 16);
    this.color = this.color % 360;
    let backgroundString =
      "linear-gradient( to bottom,hsl(" +
      this.color +
      ", 100%, 80%) 0%,hsl(" +
      (this.color + 60) +
      ", 100%, 80%) 100%)";
    $("#live-game").css("background-image", backgroundString);
  }
}

$(".start-button").on("click", function () {
  liveGame = true;
  myEngine.start();
  $("#live-game").css("display", "block");
  $("#menu").css("display", "none");
});

$(".stop-button").on("click", function (ev) {
  myEngine.stop();
});
