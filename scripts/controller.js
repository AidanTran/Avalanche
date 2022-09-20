class Controller {
  constructor() {
    // this.left = new ButtonInput();
    // this.right = new ButtonInput();
    // this.up = new ButtonInput();
    this.left = false;
    this.right = false;
    this.up = false;
  }

  keyDownUp(type, key_code) {
    var down = type === "keydown"; // This is true for downstroke, false for upstroke

    switch (
      key_code // Set each keystroke to true if down, until the upkeystroke is recorded, which then it would be set to false.
    ) {
      case 37:
        // this.left.getInput(down);
        this.left = down;
        break;
      case 38:
        // this.up.getInput(down);
        this.up = down;
        break;
      case 39:
        // this.right.getInput(down);
        this.right = down;
    }
  }
}

$(".start-button").on("click", function () {
  myGame.restart();
  myDisplay.reset();
  myDisplay.initialize(myGame);
  myEngine.start(); // Direct reference to myEngine here, I eventually want to get rid of that.
  $("#live-game").css("display", "block");
  $("#menu").css("display", "none");
});

$(".pause-button").on("click", function () {
  if (myEngine.done) {
    myEngine.start();
  } else {
    myEngine.pause();
  }
});

$(".redo-button").on("click", function () {
  myEngine.pause();
  $("#live-game").css("display", "none");
  $("#menu").css("display", "block");
});
