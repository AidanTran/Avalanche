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

// class ButtonInput {
//   constructor() {
//     this.active = false;
//     this.down = false;
//   }

//   /**
//    * Only switches the active variable once game recognizes a the opposite keystroke.
//    * @param {boolean} down - true if input is a downkeystroke, false if it is a upkeystroke
//    */
//   getInput(down) {
//     if (this.down != down) this.active = down;
//     this.down = down;
//   }
// }

$(".start-button").on("click", function () {
  myEngine.start(); // Direct reference to myEngine here, I eventually want to get rid of that.
  $("#live-game").css("display", "block");
  $("#menu").css("display", "none");
});

$(".pause-button").on("click", function () {
  myEngine.pause();
});

$(".redo-button").on("click", function () {
  myEngine.restart();
});


