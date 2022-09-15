const TARGETMS = 16.6667;
class Game {
  constructor() {
    this.world = new World(0.85, 1, 100);
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
    this.lavaHeight = -20;
    this.lavaRiseRate = 0.5;
  }

  update(timeElapsed) {
    this.player.velocityY -= (this.gravity * timeElapsed) / TARGETMS;
    this.player.update(timeElapsed);
    this.collideObject(this.player);
    this.player.velocityX *= (this.friction * timeElapsed) / TARGETMS;
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
      entity.isGrounded = true;
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

  update(timeElapsed) {
    this.x += (this.velocityX * timeElapsed) / TARGETMS;
    this.y += (this.velocityY * timeElapsed) / TARGETMS;
  }
}

class Player extends Entity {
  constructor(x, y, width, height, velocityX = 0, velocityY = 0) {
    super(x, y, width, height, velocityX, velocityY);
    this.isGrounded = true;
  }

  jump() {
    if (this.isGrounded) {
      this.velocityY += 10;
      console.log(this.velocityY);
      this.isGrounded = false;
    }
    console.log(this);
  }
  moveLeft() {
    this.velocityX -= 0.5;
  }
  moveRight() {
    this.velocityX += 0.5;
  }
}
