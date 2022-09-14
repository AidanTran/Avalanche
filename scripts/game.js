export class Game {
  constructor() {
    this.world = new World(1, 10, 1000);
  }

  update(timeElapsed) {
    print("updating!, time elapsed: ", timeElapsed);
  }
}

class World {
  constructor(friction, gravity, width) {
    this.friction = friction;
    this.gravity = gravity;
    this.width = width;
  }
}

class Entity {
  constructor(x, y, width, height) {
    this.x = x; // Left-most x coordinate
    this.y = y; // Bottom-most y coordinate
    this.width = width; // Width of rectange, add to x to get right most x coordinate.
    this.height = height; // Height of rectangle, add to y to get top most y coordinate
  }
}

class Player extends Entity {
  constructor() {
    super(500, 0, 10, 20);
    this.velocityX = 0;
    this.isg;
  }
}
