class Game {
  constructor() {
    this.world = new World(0.9, 10, 1000);
    this.color = 0;
  }

  update(timeElapsed) {
    console.log("updating!, time elapsed: ", timeElapsed, "player.x");
    this.color += parseInt(timeElapsed / 16);
    this.color = this.color % 360;
    console.log(this.color);
    let backgroundString =
      "linear-gradient( to bottom,hsl(" +
      this.color +
      ", 100%, 80%) 0%,hsl(" +
      (this.color + 60) +
      ", 100%, 80%) 100%)";
    $("#live-game").css("background-image", backgroundString);
    // this.world.update(timeElapsed);
  }
}

class World {
  constructor(friction, gravity, width) {
    this.friction = friction;
    this.gravity = gravity;
    this.width = width;
    this.player = new Player();
  }

  update(timeElapsed) {
    // this.player.velocityY -= this.gravity * timeElapsed / ;
    // this.player.update(timeElapsed);
  }

  collideObject(entity) {
    if (entity.x < 0) {
      // Check left of world
      entity.x = 0;
      entity.velocityX = 0;
    } else if (entity.x + entity.width > this.width) {
      // Check right of world
      entity.x = this.width - entity.width;
      entity.velocityX = 0;
    }
    if (entity.y < 0) {
      // Check floor
      entity.y = 0;
      entity.velocityY = 0;
    }
  }
}

class Entity {
  constructor(x, y, width, height, velocityX = 0, velocityY = 0) {
    this.x = x; // Left-most x coordinate
    this.y = y; // Bottom-most y coordinate
    this.width = width; // Width of rectange, add to x to get right most x coordinate.
    this.height = height; // Height of rectangle, add to y to get top most y coordinate
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
}

class Player extends Entity {
  constructor() {
    super(500, 0, 10, 20);
    this.is_grounded = true;
  }
}
