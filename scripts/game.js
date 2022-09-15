let TARGETMS = 16.6667;
class Game {
  constructor() {
    this.world = new World(0.9, 10, 100);
  }

  update(timeElapsed) {
    // console.log("time elapsed: ", timeElapsed);
    this.world.update(timeElapsed);
  }
}

class World {
  constructor(friction, gravity, width) {
    this.friction = friction;
    this.gravity = gravity;
    this.width = width;
    this.player = new Player(50, 0, 5, 10, 3, 0);
  }

  update(timeElapsed) {
    this.player.velocityY -= (this.gravity * timeElapsed) / TARGETMS;
    this.player.update(timeElapsed);
    this.collideObject(this.player);
    this.player.velocityX *= this.friction;
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
  constructor(x, y, width, height, velocityX = 0, velocityY = 0) {
    super(x, y, width, height, velocityX, velocityY);
    this.is_grounded = true;
  }
}
