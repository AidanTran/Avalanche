class Engine {
  /**
   *
   * @param {*} update This should be a function coming from the Game class that handles updating the state of the game
   * @param {*} render This should be a function coming from the Display class which updates everything related to DOM.
   */
  constructor(update, render) {
    this.update = update;
    this.render = render;
    this.previousTimeStamp = undefined;
    this.done = false;
  }

  start() {
    window.requestAnimationFrame(this.step.bind(this));
    this.done = false;
  }

  stop() {
    this.done = true;
  }

  step(timestamp) {
    if (this.previousTimeStamp === undefined) {
      this.previousTimeStamp = timestamp;
    }
    const elapsed = timestamp - this.previousTimeStamp;
    this.update(elapsed);
    this.render();
    this.previousTimeStamp = timestamp;
    if (!this.done) {
      window.requestAnimationFrame(this.step.bind(this));
    } else {
      this.start = undefined;
      this.previousTimeStamp = undefined;
    }
  }
}
