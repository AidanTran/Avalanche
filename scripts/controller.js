class Controller {
  constructor(/*game, startEngine, stopEngine*/) {
    // this.game = game;
    // this.startEngine = startEngine;
    // this.stopEngine = stopEngine;
    this.left = new ButtonInput();
    this.right = new ButtonInput();
    this.up = new ButtonInput();
  }

  keyDownUp(type, key_code) {
    var down = type === "keydown"; // This is true for downstroke, false for upstroke

    switch (key_code) {
      case 37:
        this.left.getInput(down); // Use switch statement to handle left up and right inputs.
        break;
      case 38:
        this.up.getInput(down);
        break;
      case 39:
        this.right.getInput(down);
    }
  }
}

class ButtonInput {
  constructor() {
    this.active = false; // Every input can be currently active. We need its current state to know when to activate it.
    this.down = false;
  }

  getInput(down) {
    if (this.down != down) this.active = down;
    this.down = down;
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
