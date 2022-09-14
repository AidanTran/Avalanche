export class Engine {
  /**
   *
   * @param {*} update This should be a function coming from the Game class that handles updating the state of the game
   * @param {*} render This should be a function coming from the Display class which updates everything related to DOM.
   */
  constructor(element, update, render) {
    this.update = update;
    this.render = render;
    this.element = element;
    this.previousTimeStamp = undefined;
    this.done = false;
  }

  start() {
    window.requestAnimationFrame(step);
    this.done = false;
  }

  stop() {
    this.done = true;
  }

  step(timestamp) {
    if (!this.previousTimeStamp) {
      this.previousTimeStamp = timestamp;
    }
    const elapsed = this.timestamp - this.previousTimeStamp;
    this.update(elapsed);
    this.render();
    previousTimeStamp = timestamp;
    if (!done) {
      window.requestAnimationFrame(step);
    } else {
      this.start = undefined;
      this.previousTimeStamp = undefined;
    }
  }
}
