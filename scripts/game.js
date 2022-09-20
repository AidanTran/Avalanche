/**
 * Currently the game only holds a world, and an update function which calls update on world.
 */
const TARGETMS = 16.6667; // const variable. 16.6667 is 60 fps, this is for force calculations when framerate is unstable.
const FRICTION = 0.85; // How fast player.velocityX shrinks.
const GRAVITY = 0.6; // How fast player falls.
const GROUNDEDGRAVITY = 0.001;
const MAXFALL = -3;
const WORLDWIDTH = 100;
const WORLDHEIGHT = 90;
let COUNTER = 0; //just an int that will increment for everytime engine calls update

class Game {
  constructor() {
    this.world = new World(FRICTION, GRAVITY, WORLDWIDTH);
  }

  update(timeElapsed, controller) {
    this.world.update(timeElapsed, controller);
  }
}

const PLAYERWIDTH = 5;
const PLAYERHEIGHT = 8;
const PLAYERMOVESPEED = 0.2;
const PLAYERJUMP = 7;
const INITALLAVAHEIGHT = -30;
const LAVARISERATE = 0.5;
// 3 block sizes
const LRGBLOCKWIDTH = 30;
const LRGBLOCKHEIGHT = 30;
const MBLOCKWIDTH = 20;
const MBLOCKHEIGHT = 20;
const SMBLOCKWIDTH = 10;
const SMBLOCKHEIGHT = 10;
const BLOCKMOVESPEED = -1;
const DROPMAX = 50;
const DROPMIN = -50;

function adjustForTime(value, timeElapsed) {
  return (value * timeElapsed) / TARGETMS;
}

class World {
  randomBoxDrop() {
    return Math.random() * (DROPMAX - DROPMIN + 1) + DROPMIN;
  }

  constructor(friction, gravity, width) {
    this.friction = friction;
    this.gravity = gravity;
    this.width = width;
    this.lava = new Lava(
      WORLDWIDTH,
      INITALLAVAHEIGHT,
      WORLDWIDTH,
      WORLDHEIGHT / 3,
      0,
      LAVARISERATE
    );
    this.player = new Player(WORLDWIDTH / 2, 0, PLAYERWIDTH, PLAYERHEIGHT);
    this.fallingBoxes = new Set([0, 1]);

    this.boxList = [
      new FallingBlock(
        WORLDWIDTH / 2 + 30,
        0,
        SMBLOCKWIDTH,
        SMBLOCKHEIGHT,
        0,
        BLOCKMOVESPEED
      ),
      new FallingBlock(
        WORLDWIDTH / 2,
        80,
        SMBLOCKWIDTH,
        SMBLOCKHEIGHT,
        0,
        BLOCKMOVESPEED
      ),
    ];
  }

  handleControls(timeElapsed, controller) {
    // Handles all entities movement and collisions.
    // Handles movement of player from controller.
    if (controller.left) {
      this.player.moveLeft(timeElapsed);
    }
    if (controller.right) {
      this.player.moveRight(timeElapsed);
    }
    if (controller.up) {
      this.player.jump();
    }
  }
  handleForces(timeElapsed) {
    const tempGrav = this.player.isGrounded ? GROUNDEDGRAVITY : this.gravity;
    this.player.velocityY = Math.max(
      MAXFALL,
      this.player.velocityY - adjustForTime(tempGrav, timeElapsed)
    ); // Handles gravity, adjusted for time.
    this.player.velocityX *= this.friction ** (timeElapsed / TARGETMS); // Reduces the players speed using Friction, adjusted for time.
  }

  handleBoxSpawn() {
    /**
     * while loop over list of boxes.
     * Determine whether player collides with any of those boxes. Update player values.
     */
    COUNTER += 1;
    if (COUNTER === 50) {
      //Once counter reaches a certain limit it will spawn a new block and reset
      const newFallingBlock = new FallingBlock(
        Math.random() * WORLDWIDTH,
        this.player.y + this.player.height + 60,
        SMBLOCKWIDTH,
        SMBLOCKHEIGHT,
        0,
        BLOCKMOVESPEED
      );
      this.boxList.push(newFallingBlock);
      this.fallingBoxes.add(this.boxList.length - 1);
      COUNTER = 0;
    }
  }

  boxUpdateLoop(timeElapsed) {
    for (let i = 0; i < this.boxList.length; i++) {
      // always have a block falling until hits ground
      this.boxList[i].update(timeElapsed);
      this.playerCollideBlock(this.boxList[i]);
    }

    this.fallingBoxes.forEach((idx) => {
      for (let i = 0; i < this.boxList.length; i++) {
        if (this.fallingBoxes.has(i)) {
          continue;
        }
        this.boxCollideBox(idx, i);
      }
      if (this.boxList[idx].isGrounded) {
        this.fallingBoxes.delete(idx);
      }
    });
  }

  update(timeElapsed, controller) {
    this.handleControls(timeElapsed, controller);
    this.handleForces(timeElapsed);
    const isPlayerFalling = this.player.velocityY < 0;
    const prevPlayerY = this.player.y;
    this.player.update(timeElapsed); // Actually calculates player move
    this.lava.update(timeElapsed); // Calculate lava move
    this.playerCollideWorld(this.player); // Uses player's new position to see if it collided with the world boundary.
    this.handleBoxSpawn();
    this.boxUpdateLoop(timeElapsed);
    if (isPlayerFalling && this.player.y < prevPlayerY) {
      this.player.isGrounded = false;
    }
  }

  playerCollideWorld(entity) {
    // Takes an entity as a parameter and sets it's position and velocity so that it can't escape the world bounds.
    if (entity.x < 0) {
      // Check left of world
      entity.x = this.width;
    } else if (entity.x >= this.width) {
      // Check right of world
      entity.x = 0;
    }
    if (entity.y < 0) {
      // Check floor
      entity.y = 0;
      entity.velocityY = 0;
      entity.isGrounded = true;
    }
  }

  playerCollideBlock(block) {
    const playerRightX = this.player.x + this.player.width; //rightmost x cord (player)
    const playerTopY = this.player.y + this.player.height; ////topmost y cord (player)
    const blockRightX = block.x + block.width; //rightmost x cord (block)
    const blockTopY = block.y + block.height; //topmost y cord (block)

    //player is on left side of block
    if (
      playerRightX > block.x &&
      this.player.x < block.x &&
      ((this.player.y > block.y && this.player.y < blockTopY) ||
        (playerTopY > block.y && playerTopY < blockTopY))
    ) {
      /*
      The following two if statements below is logic as to wether or not the player should favor the roof of the block 
      or the side of the block. This is needed because if the player collided in the corner. It's difficult
      to tell if he should be pushed LEFT or pushed UP. 
      */
      if (
        this.player.velocityX > 0 && // We ONLY favor the left if we are currently moving right AND
        playerRightX - block.x < blockTopY - this.player.y // If our velocity traveling right is greater than our velocity traveling down.
      ) {
        this.player.x = block.x - this.player.width;
        this.player.velocityX = 0;
      } else if (this.player.y < blockTopY && playerTopY > blockTopY) {
        //more up favored
        this.player.y = blockTopY;
        this.player.velocityY = block.velocityY;
        this.player.isGrounded = true;
      } else if (this.player.y < block.y && playerTopY > block.y) {
        this.player.y = block.y - this.player.height;
        this.player.velocityY = -0.5;
      }
    }
    //same logic but now dealing with right side collisions
    else if (
      this.player.x < blockRightX &&
      playerRightX > blockRightX &&
      ((this.player.y > block.y && this.player.y < blockTopY) ||
        (playerTopY > block.y && playerTopY < blockTopY))
    ) {
      if (
        this.player.velocityX < 0 &&
        blockRightX - this.player.x < blockTopY - this.player.y
      ) {
        //right side favored
        this.player.x = blockRightX;
        this.player.velocityX = 0;
      } else if (this.player.y < blockTopY && playerTopY > blockTopY) {
        //more up favored
        this.player.y = blockTopY;
        this.player.velocityY = block.velocityY;
        this.player.isGrounded = true;
      } else if (this.player.y < block.y && playerTopY > block.y) {
        this.player.y = block.y - this.player.height;
        this.player.velocityY = -0.5;
      }
    } else if (this.player.x >= block.x && playerRightX <= blockRightX) {
      //If the player is standing on the top of the block flat. no corners involved. It will be grounded on the block
      if (this.player.y <= blockTopY && playerTopY >= blockTopY) {
        this.player.y = blockTopY;
        this.player.velocityY = block.velocityY;
        this.player.isGrounded = true;
      } else if (this.player.y < block.y && playerTopY > block.y) {
        this.player.y = block.y - this.player.height;
        this.player.velocityY = -0.5;
      }
    }
  }

  boxCollideBox(idx1, idx2) {
    //idx1 falling
    //idx2 grounded
    const falling = this.boxList[idx1];
    const grounded = this.boxList[idx2];

    if (falling.y < grounded.y + grounded.height) {
      if (
        (falling.x <= grounded.x && falling.x + falling.width >= grounded.x) ||
        (falling.x + falling.width >= grounded.x + grounded.width &&
          falling.x <= grounded.x + grounded.width) ||
        (falling.x >= grounded.x &&
          falling.x + falling.width <= grounded.x + grounded.width)
      ) {
        falling.isGrounded = true;
        falling.velocityY = 0;
        falling.y = grounded.y + grounded.height;
      }
    }

    return;
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
class Lava extends Entity {
  constructor(x, y, width, height, velocityX, velocityY) {
    super(x, y, width, height, velocityX, velocityY);
    this.isGrounded = false;
  }
  update(timeElapsed) {
    this.y += adjustForTime(this.velocityY, timeElapsed);
    this.x += adjustForTime(this.velocityX, timeElapsed);
  }
}
