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
    this.score = 0;
  }

  restart() {
    this.world = new World(FRICTION, GRAVITY, WORLDWIDTH);
    console.log("restarted", this.world);
  }

  update(timeElapsed, controller) {
    if (this.world.player.y > this.score) {
      this.score = this.world.player.y;
    }
    return this.world.update(timeElapsed, controller);
  }
}

const PLAYERWIDTH = 5;
const PLAYERHEIGHT = 8;
const PLAYERMOVESPEED = 0.2;
const PLAYERJUMP = 7;
const INITALLAVAHEIGHT = -40;
const LAVARISERATE = 0.05;
// 3 block sizes
const LRGBLOCKWIDTH = 30;
const LRGBLOCKHEIGHT = 30;
const MBLOCKWIDTH = 20;
const MBLOCKHEIGHT = 20;
const SMBLOCKWIDTH = 10;
const SMBLOCKHEIGHT = 10;
const BLOCKMOVESPEED = -1;

function adjustForTime(value, timeElapsed) {
  return (value * timeElapsed) / TARGETMS;
}

class World {
  constructor(friction, gravity, width) {
    this.friction = friction;
    this.gravity = gravity;
    this.width = width;
    this.lavaHeight = INITALLAVAHEIGHT;
    this.lavaRise = LAVARISERATE;
    this.player = new Player(WORLDWIDTH / 2, 0, PLAYERWIDTH, PLAYERHEIGHT);
    this.fallingBoxes = new Set();
    this.boxList = [];
  }

  update(timeElapsed, controller) {
    this.handleControls(timeElapsed, controller);
    this.handleForces(timeElapsed);
    const isPlayerFalling = this.player.velocityY < 0;
    const prevPlayerY = this.player.y;
    this.player.update(timeElapsed); // Actually calculates player move
    this.lavaHeight += this.lavaRise; // Calculate lava move
    const inLava = this.playerCollideWorld(this.player); // Uses player's new position to see if it collided with the world boundary.
    this.handleBoxSpawn(timeElapsed);
    const [hasBeenCrushed, hasBeenGrounded] = this.boxUpdateLoop(timeElapsed);
    if (!hasBeenGrounded && isPlayerFalling && this.player.y < prevPlayerY) {
      this.player.isGrounded = false;
    }
    if (inLava || hasBeenCrushed) {
      return true;
    }
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

  handleBoxSpawn(timeElapsed) {
    /**
     * while loop over list of boxes.
     * Determine whether player collides with any of those boxes. Update player values.
     * Since Time elapsed is equal to the time it takes to request a frame. Counter will be incremented
     * by this until it hits 1000 ms (1 sec) and spawn a new block + reset counter
     */
    COUNTER += timeElapsed;
    if (COUNTER >= 800) {
      //Once counter reaches a certain limit it will spawn a new block and reset
      const randBlockWidth = (Math.random() + 1) * SMBLOCKWIDTH;
      const randBlockHeight = (Math.random() + 1) * SMBLOCKHEIGHT;
      const newFallingBlock = new FallingBlock(
        Math.random() * WORLDWIDTH - 10,
        this.player.y + this.player.height + 60,
        randBlockWidth,
        //randBlockHeight,
        randBlockWidth, // Making the blocks square
        0,
        (100 / (randBlockWidth * randBlockHeight)) * BLOCKMOVESPEED // 400 is max area of block (20x20)
      );
      this.fallingBoxes.add(this.boxList.length);
      this.boxList.push(newFallingBlock);
      COUNTER = 0;
    }
  }

  boxUpdateLoop(timeElapsed) {
    let groundedFlag = false;
    let crushedFlag = false;
    for (let i = 0; i < this.boxList.length; i++) {
      // always have a block falling until hits ground
      this.boxList[i].update(timeElapsed);
      const [tempCrushed, tempGrounded] = this.playerCollideBlock(
        this.boxList[i]
      );
      if (tempGrounded) {
        groundedFlag = true;
      }
      if (tempCrushed) {
        crushedFlag = true;
      }
    }

    //this.fallingBoxes.has(i)
    this.fallingBoxes.forEach((idx) => {
      for (let i = 0; i < this.boxList.length; i++) {
        if (idx === i) {
          continue;
        }
        this.boxCollideBox(idx, i);
      }
      if (this.boxList[idx].isGrounded) {
        this.fallingBoxes.delete(idx);
      }
    });
    return [crushedFlag, groundedFlag];
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

    if (entity.y < this.lavaHeight) {
      return true;
    }
    return false;
  }

  playerCollideBlock(block) {
    const playerRightX = this.player.x + this.player.width; //rightmost x cord (player)
    const playerTopY = this.player.y + this.player.height; ////topmost y cord (player)
    const blockRightX = block.x + block.width; //rightmost x cord (block)
    const blockTopY = block.y + block.height; //topmost y cord (block)
    let groundedFlag = false;
    let crushedFlag = false;
    let bonkFlag = false;
    let leftFlag = false;
    let rightFlag = false;
    if (this.player.x >= block.x && playerRightX <= blockRightX) {
      //If the player is standing on the top of the block flat. no corners involved. It will be grounded on the block
      if (this.player.y <= blockTopY && playerTopY >= blockTopY) {
        groundedFlag = true;
      } else if (this.player.y < block.y && playerTopY > block.y) {
        // If player hits the bottom of the block flat
        bonkFlag = true;
        if (this.player.isGrounded) {
          crushedFlag = true;
        }
      }
    } else if (playerRightX > block.x && this.player.x < block.x) {
      // player is left
      if (this.player.y > block.y && playerTopY <= blockTopY) {
        // Player is flat left, no corner
        leftFlag = true;
      } else if (this.player.y <= blockTopY && playerTopY >= blockTopY) {
        // Player is in topleft corner
        if (
          // If the player is moving right and they are further into the corner left then down, then push them horizontally
          this.player.velocityX > 0 &&
          playerRightX - block.x < blockTopY - this.player.y
        ) {
          leftFlag = true;
        } else {
          groundedFlag = true;
        }
      } else if (this.player.y <= block.y && playerTopY > block.y) {
        // Player is in bottomleft corner
        if (
          // If the player is moving right and they are further into the corner left then down, then push them horizontally
          this.player.velocityX > 0 &&
          playerRightX - block.x < playerTopY - block.y
        ) {
          leftFlag = true;
        } else {
          bonkFlag = true;
          if (this.player.isGrounded) {
            crushedFlag = true;
          }
        }
      }
    } else if (this.player.x < blockRightX && playerRightX > blockRightX) {
      // player is right
      if (this.player.y > block.y && playerTopY <= blockTopY) {
        // Player is flat right, no corner
        rightFlag = true;
      } else if (this.player.y <= blockTopY && playerTopY >= blockTopY) {
        // Player is in topright corner
        if (
          this.player.velocityX < 0 &&
          blockRightX - this.player.x < blockTopY - this.player.y
        ) {
          rightFlag = true;
        } else {
          groundedFlag = true;
        }
      } else if (this.player.y <= block.y && playerTopY > block.y) {
        // Player is in bottomright corner
        if (
          this.player.velocityX < 0 &&
          blockRightX - this.player.x < playerTopY - block.y
        ) {
          rightFlag = true;
        } else {
          bonkFlag = true;
          if (this.player.isGrounded) {
            crushedFlag = true;
          }
        }
      }
    }
    if (groundedFlag) {
      this.player.y = blockTopY;
      this.player.velocityY = block.velocityY;
      this.player.isGrounded = true;
    }
    if (bonkFlag) {
      this.player.y = block.y - this.player.height;
      this.player.velocityY = -0.5;
    }
    if (leftFlag) {
      this.player.x = block.x - this.player.width; // Pushed left
      this.player.velocityX = 0;
    }
    if (rightFlag) {
      this.player.x = blockRightX; // Pushed right
      this.player.velocityX = 0;
    }
    return [crushedFlag, groundedFlag];
  }

  boxCollideBox(idx1, idx2) {
    //idx1 falling
    //idx2 grounded, sidenote we now check both falling and grounded blocks so "grounded" could 
    //very much be not grounded at all. imma rename these to... uhh block1 and block2 or topblock, bottomblock
    const falling = this.boxList[idx1];
    const grounded = this.boxList[idx2];

    if (falling.y < grounded.y + grounded.height &&
      falling.y + falling.height > grounded.y + grounded.height
    ) {
      if (
        (falling.x <= grounded.x && falling.x + falling.width >= grounded.x) ||
        (falling.x + falling.width >= grounded.x + grounded.width &&
          falling.x <= grounded.x + grounded.width) ||
        (falling.x >= grounded.x &&
          falling.x + falling.width <= grounded.x + grounded.width)
      ) {
        if (grounded.isGrounded){
          falling.isGrounded = true;
          falling.velocityY = 0;
          falling.y = grounded.y + grounded.height;
        }
        else{
          falling.velocityY = grounded.velocityY;
          falling.y = grounded.y + grounded.height;
        }
      }
    }

    return;
  }
}
