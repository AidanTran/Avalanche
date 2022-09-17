/**
 * ALL OF THIS IS TEMPORARY FOR GAME AND CONTROLLER DEBUGGING PURPOSES ONLY AT THE MOMENT
 */
const GRADIENTSPAN = 30;
class Display {
  constructor(game) {
    this.game = game;
    this.colorBase = 180;
    this.stationaryLen = 0;
    $("#player").css("top", "50%");
    $("#player").css("width", this.game.world.player.width + "%");
    $("#player").css("height", this.game.world.player.height + "%");
  }

  render(controller) {
    //UpdatedStationary is updated when something is added to the stationaryList
    let UpdatedStationaryLen = this.game.world.stationaryLen;
    // This is what moves the player. The mallow's current position is relative to the top left corner of the live-game html area
    // This area is currently the whole screen.
    $("#player").css("left", this.game.world.player.x + "%"); // For every unit in game space, we move the player another percent of the screen.
    $("#player").css("top", 50 - this.game.world.player.y + "%"); // This goes for the y direction too, currenty 1 game unit = 1% screen space relative to direction.
    
    while (UpdatedStationaryLen > this.stationaryLen){
      //creates new divs per block in the world
      this.stationaryLen += 1;
      $('<div class="boxes" id='+this.stationaryLen.toString()+'></div>').appendTo('#live-game');
      const idStr = "#"+this.stationaryLen.toString();
      $(idStr).css("width", this.game.world.stationaryBoxList[this.stationaryLen-1].width + "%");
      $(idStr).css("height", this.game.world.stationaryBoxList[this.stationaryLen-1].height + "%");
      $(idStr).css("left", this.game.world.stationaryBoxList[this.stationaryLen-1].x + "%");
    }
    
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
    // Cool fancy colors to look at based on time.
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
