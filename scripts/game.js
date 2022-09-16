/**
 * Currently the game only holds a world, and an update function which calls update on world.
 */
const TARGETMS = 16.6667; // const variable. 16.6667 is 60 fps, this is for force calculations when framerate is unstable.
const FRICTION = 0.85; // How fast player.velocityX shrinks.
const GRAVITY = 1; // How fast player falls.
const WORLDWIDTH = 100;
class Game {
  constructor() {
    this.world = new World(FRICTION, GRAVITY, WORLDWIDTH);
  }

  update(timeElapsed, controller) {
    this.world.update(timeElapsed, controller);
  }
}

const PLAYERWIDTH = 5;
const PLAYERHEIGHT = 10;
const PLAYERMOVESPEED = 0.5;
const INITALLAVAHEIGHT = -30;
const LAVARISERATE = 0.5;
// 3 block sizes
const LRGBLOCKWIDTH = 30;
const LRGBLOCKHEIGHT = 30;
const MBLOCKWIDTH = 20;
const MBLOCKHEIGHT = 20;
const SMBLOCKWIDTH = 10;
const SMBLOCKHEIGHT = 10;
const BLOCKMOVESPEED = 0.5; //can change just copied player

function adjustForTime(value, timeElapsed) {
  return (value * timeElapsed) / TARGETMS;
}

class World {
  constructor(friction, gravity, width) {
    this.friction = friction;
    this.gravity = gravity;
    this.width = width;
    this.player = new Player(WORLDWIDTH / 2, 0, PLAYERWIDTH, PLAYERHEIGHT);
    this.fallingblock = new FallingBlock(WORLDWIDTH / 2, 0, SMBLOCKWIDTH, SMBLOCKHEIGHT); /*TODO randomize block size*/
    this.lavaHeight = INITALLAVAHEIGHT;
    this.lavaRiseRate = LAVARISERATE;
  }

  update(timeElapsed, controller) {
    // Handles all entities movement and collisions.
    // Handles movement of player from controller.
    if (controller.left) {
      myGame.world.player.moveLeft(timeElapsed);
    }
    if (controller.right) {
      myGame.world.player.moveRight(timeElapsed);
    }
    if (controller.up) {
      myGame.world.player.jump();
    }

    this.player.velocityY -= adjustForTime(this.gravity, timeElapsed); // Handles gravity, adjusted for time.
    this.player.update(timeElapsed); // Actually calculates player move
    this.collideObject(this.player); // Uses player's new position to see if it collided with the world boundary.
    this.player.velocityX *= adjustForTime(this.friction, timeElapsed); // Reduces the players speed using Friction, adjusted for time.
  
    //always have a block falling until hits ground 
    this.fallingblock.velocityY -= adjustForTime(this.gravity, timeElapsed);
    this.fallingblock.update(timeElapsed);
    myGame.world.fallingblock.fall();
  }

  collideObject(entity) {
    // Takes an entity as a parameter and sets it's position and velocity so that it can't escape the world bounds.
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
      this.velocityY += 10; // Do not need to adjust for time here, jumping is an impulse.
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
    this.isGrounded=false;
  }

  fall() {
    if (!this.isGrounded) {
      // Should only fall if not grounded.
      this.velocityY -= 10; 
      this.isGrounded = true;
    }
  }
}
