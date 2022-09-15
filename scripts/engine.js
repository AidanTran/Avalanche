class Engine {
  /**
   *
   */
  constructor(update) {
    this.update = update;
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
    this.previousTimeStamp = timestamp;
    if (!this.done) {
      window.requestAnimationFrame(this.step.bind(this));
    } else {
      this.start = undefined;
      this.previousTimeStamp = undefined;
    }
  }
}
