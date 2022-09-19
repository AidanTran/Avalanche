/**
 * Currently the game only holds a world, and an update function which calls update on world.
 */
const TARGETMS = 16.6667; // const variable. 16.6667 is 60 fps, this is for force calculations when framerate is unstable.
const FRICTION = 0.85; // How fast player.velocityX shrinks.
const GRAVITY = 1; // How fast player falls.
const WORLDWIDTH = 100;
const WORLDHEIGHT = 90;
let COUNTER = 0;
let IDXCOUNT = 0;

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
const PLAYERMOVESPEED = 0.2;
const INITALLAVAHEIGHT = -30;
const LAVARISERATE = 0.5;
// 3 block sizes
const LRGBLOCKWIDTH = 30;
const LRGBLOCKHEIGHT = 30;
const MBLOCKWIDTH = 20;
const MBLOCKHEIGHT = 20;
const SMBLOCKWIDTH = 10;
const SMBLOCKHEIGHT = 10;
const BLOCKMOVESPEED = -1; //can change just copied player

function adjustForTime(value, timeElapsed) {
  return (value * timeElapsed) / TARGETMS;
}

class World {
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
    this.fallingBoxes = new Set();
    this.boxList = [
      // new FallingBlock(
      //   WORLDWIDTH / 2 + 20,
      //   0,
      //   SMBLOCKWIDTH,
      //   SMBLOCKHEIGHT,
      //   0,
      //   BLOCKMOVESPEED
      // ),
      // new FallingBlock(
      //   WORLDWIDTH / 2 - 20,
      //   80,
      //   MBLOCKWIDTH,
      //   MBLOCKHEIGHT,
      //   0,
      //   BLOCKMOVESPEED
      // ),
    ];
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
    this.player.velocityX *= this.friction ** (timeElapsed / TARGETMS); // Reduces the players speed using Friction, adjusted for time.
    this.player.update(timeElapsed); // Actually calculates player move
    this.lava.update(timeElapsed); // Calculate lava move
    this.playerCollideWorld(this.player); // Uses player's new position to see if it collided with the world boundary.
    /**
     * while loop over list of boxes.
     * Determine whether player collides with any of those boxes. Update player values.
     */
    COUNTER += 1;
    if (COUNTER === 200) {
      const newFallingBlock = new FallingBlock(
        Math.random() * WORLDWIDTH - SMBLOCKWIDTH,
        //this.player.y + this.player.heightheight + 50,
        50,
        SMBLOCKWIDTH,
        SMBLOCKHEIGHT,
        0,
        BLOCKMOVESPEED
      );
      this.boxList.push(newFallingBlock);
      this.fallingBoxes.add(IDXCOUNT);
      IDXCOUNT += 1;
      COUNTER = 0;
    }
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

  playerCollideWorld(entity) {
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

  playerCollideBlock(block) {
    const playerRightX = this.player.x + this.player.width; //rightmost x cord (player)
    const playerTopY = this.player.y + this.player.height; ////topmost y cord (player)
    const blockRightX = block.x + block.width; //rightmost x cord (block)
    const blockTopY = block.y + block.height; //topmost y cord (block)
    const blockBottomY = block.height - block.y; //bottommost y cord (block)

    //player is on left side of block
    if (
      playerRightX > block.x &&
      this.player.x < block.x &&
      this.player.y < blockTopY &&
      playerTopY > block.y
    ) {
      /*
      The following two if statements below is logic as to wether or not the player should favor the roof of the block 
      or the side of the block. This is needed because if the player collided in the corner. It's difficult
      to tell if he should be pushed LEFT or pushed UP. 
      */
      if (
        this.player.velocityX > 0 && // We ONLY favor the left if we are currently moving right AND
        this.player.velocityX > -1 * this.player.velocityY // If our velocity traveling right is greater than our velocity traveling down.
      ) {
        //more left favored
        this.player.x = block.x - this.player.width;
        this.player.velocityX = 0;
      } else {
        //more up favored
        this.player.y = blockTopY;
        this.player.velocityY = 0;
        this.player.isGrounded = true;
      }
    }
    //same logic but now dealing with right side collisions
    else if (
      this.player.x < blockRightX &&
      playerRightX > blockRightX &&
      this.player.y < blockTopY &&
      playerTopY > block.y
    ) {
      if (
        this.player.velocityX < 0 &&
        this.player.velocityX < this.player.velocityY
      ) {
        //right side favored
        this.player.x = blockRightX;
        this.player.velocityX = 0;
      } else {
        //Top side favored
        this.player.y = blockTopY;
        this.player.velocityY = 0;
        this.player.isGrounded = true;
      }
    }
    //If the player is standing on the top of the block flat. no corners involved. It will be grounded on the block
    else if (
      this.player.x > block.x &&
      playerRightX < blockRightX &&
      this.player.y < blockTopY &&
      playerTopY > block.y
    ) {
      this.player.y = blockTopY;
      this.player.velocityY = 0;
      this.player.isGrounded = true;
    }
    /** 
    // bad attempt at collision control for player under the block bc i don't rly get how the coords work... TODO fix this lmao
    else if (
      playerTopY === blockBottomY &&
      player.y < block.y
    ) {
      this.player.y = blockBottomY;
      this.player.velocityY = 0;
      this.player.isGrounded = false;
    }
    **/
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
          falling.x >= grounded.x)
      ) {
        falling.isGrounded = true;
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
