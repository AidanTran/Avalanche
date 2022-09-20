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
    // Adjusts the entities' x and y position from its velocity, adjusted for time.
    this.x += adjustForTime(this.velocityX, timeElapsed);
    this.y += adjustForTime(this.velocityY, timeElapsed);
  }
}

class Player extends Entity {
  constructor(x, y, width, height, velocityX = 0, velocityY = 0) {
    super(x, y, width, height, velocityX, velocityY);
    this.isGrounded = true;
  }

  jump() {
    if (this.isGrounded) {
      // Should only be able to jump if grounded.
      this.velocityY += PLAYERJUMP; // Do not need to adjust for time here, jumping is an impulse.
      this.isGrounded = false;
    }
  }
  moveLeft(timeElapsed) {
    this.velocityX -= adjustForTime(PLAYERMOVESPEED, timeElapsed);
  }
  moveRight(timeElapsed) {
    this.velocityX += adjustForTime(PLAYERMOVESPEED, timeElapsed);
  }
}

class FallingBlock extends Entity {
  constructor(x, y, width, height, velocityX = 0, velocityY = 0) {
    super(x, y, width, height, velocityX, velocityY);
    this.isGrounded = false;
  }

  update(timeElapsed) {
    // Adjusts the entities' x and y position from its velocity, adjusted for time.
    if (!this.isGrounded) {
      this.y += adjustForTime(this.velocityY, timeElapsed);
      if (this.y <= 0) {
        this.isGrounded = true;
        this.velocityY = 0;
        this.y = 0;
      }
    }
  }
}
