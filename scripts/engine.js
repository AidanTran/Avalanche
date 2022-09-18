class Engine {
  /**
   *
   * @param {(timeElapsed) => null} update - Blackbox function that should do something every frame available.
   */
  constructor(update) {
    this.update = update; // We use the update function provided to us by app.js
    this.previousTimeStamp = undefined;
    this.done = false;
  }

  start() {
    window.requestAnimationFrame(this.step.bind(this)); // We have to use binding do to weird "this" definitions in javascript.
    this.done = false;
  }

  pause() {
    this.done = true;
  }

  restart() {
    window.location.reload();
  }

  /**
   * This function uses the previousTimeStamp stored in the Engine class and calculates the time since last update.
   * Time elapsed is very important for handling consistent physics in the game.
   * @param {number} timestamp - Number value of time provided by requestAnimationFrame.
   */
  step(timestamp) {
    if (this.previousTimeStamp === undefined) {
      this.previousTimeStamp = timestamp;
    }
    const elapsed = timestamp - this.previousTimeStamp;
    this.update(elapsed); // Call to update
    this.previousTimeStamp = timestamp;
    if (!this.done) {
      window.requestAnimationFrame(this.step.bind(this)); // Continue calling requestAnimationFrame.
    } else {
      // If done is true, then stop has been called, and we can exit this loop.
      this.previousTimeStamp = undefined;
    }
  }
}
