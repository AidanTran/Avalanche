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
