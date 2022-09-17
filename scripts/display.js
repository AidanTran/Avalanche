/**
 * ALL OF THIS IS TEMPORARY FOR GAME AND CONTROLLER DEBUGGING PURPOSES ONLY AT THE MOMENT
 */

class Display {
  constructor(game) {
    this.game = game;
    this.color = 0;
    $("#player").css("top", "50%");
    $("#player").css("width", this.game.world.player.width + "%");
    $("#player").css("height", this.game.world.player.height + "%");
  }

  render(timeElapsed) {
    // This is what moves the player. The mallow's current position is relative to the top left corner of the live-game html area
    // This area is currently the whole screen.
    $("#player").css("left", this.game.world.player.x + "%"); // For every unit in game space, we move the player another percent of the screen.
    $("#player").css("top", 50 - this.game.world.player.y + "%"); // This goes for the y direction too, currenty 1 game unit = 1% screen space relative to direction.
    $("#boxes").css();
    // Cool fancy colors to look at based on time.
    this.color += parseInt(timeElapsed / 16);
    this.color = this.color % 360;
    let backgroundString =
      "linear-gradient( to bottom,hsl(" +
      this.color +
      ", 100%, 80%) 0%, hsl(" +
      (this.color + 60) +
      ", 100%, 80%) 100%)";
    $("#live-game").css("background-image", backgroundString);
  }
}
