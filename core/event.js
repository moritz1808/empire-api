// empire/core/event.js
class Event {
    constructor() {
      this.promise = null;
      this.resolve = null;
      this._init();
    }
  
    _init() {
      this.promise = new Promise((res) => {
        this.resolve = res;
      });
    }
  
    async wait(timeout = 5000) {
      return Promise.race([
        this.promise,
        new Promise((res) => setTimeout(() => res(false), timeout)),
      ]);
    }
  
    set() {
      this.resolve(true);
      this._init();
    }
  
    clear() {
      this._init();
    }
  }
  
  module.exports = { Event };
  