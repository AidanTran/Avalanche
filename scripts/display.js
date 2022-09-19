/**
 * ALL OF THIS IS TEMPORARY FOR GAME AND CONTROLLER DEBUGGING PURPOSES ONLY AT THE MOMENT
 */
const GRADIENTSPAN = 30;
const MIDSCREEN = 35;

class Display {
  constructor(game) {
    this.game = game;
    this.colorBase = 180;
    this.numBoxes = 0;
    $("#player").css("bottom", "50%");
    $("#player").css("width", this.game.world.player.width + "%");
    $("#player").css("height", this.game.world.player.height + "%");
  }

  render(controller) {
    //updatednumBoxes is updated when something is added to the boxlist
    let updatednumBoxes = this.game.world.boxList.length;
    // This is what moves the player. The mallow's current position is relative to the top left corner of the live-game html area
    // This area is currently the whole screen.
    $("#player").css("left", this.game.world.player.x + "%"); // For every unit in game space, we move the player another percent of the screen.
    $("#player").css("bottom", MIDSCREEN + "%"); // This goes for the y direction too, currenty 1 game unit = 1% screen space relative to direction.

    while (updatednumBoxes > this.numBoxes) {
      //creates new divs per block in the world
      $(
        '<div class="boxes" id=' + this.numBoxes.toString() + "></div>"
      ).appendTo("#live-game");
      const idStr = "#" + this.numBoxes.toString();
      $(idStr).css("width", this.game.world.boxList[this.numBoxes].width + "%");
      $(idStr).css(
        "height",
        this.game.world.boxList[this.numBoxes].height + "%"
      );
      $(idStr).css("left", this.game.world.boxList[this.numBoxes].x + "%");
      this.numBoxes += 1;
    }

    for (let i = 0; i < this.numBoxes; i++) {
      $("#" + i).css("left", this.game.world.boxList[i].x + "%");
      $("#" + i).css("bottom", MIDSCREEN + this.game.world.boxList[i].y - + this.game.world.player.y + "%");
    }

    if (controller.left && controller.right) {
      $("#player").removeClass("right-skew");
      $("#player").removeClass("left-skew");
    } else {
      if (controller.left) {
        $("#player").addClass("left-skew");
      } else {
        $("#player").removeClass("left-skew");
      }
      if (controller.right) {
        $("#player").addClass("right-skew");
      } else {
        $("#player").removeClass("right-skew");
      }
    }

    // Color gradient based on player height
    const color =
      (this.colorBase + parseInt(this.game.world.player.y / 3)) % 360;
    const backgroundString =
      "linear-gradient( to bottom,hsl(" +
      color +
      ", 100%, 80%) 0%, hsl(" +
      (color + GRADIENTSPAN) +
      ", 100%, 80%) 100%)";
    $("#live-game").css("background-image", backgroundString);
  }
}
