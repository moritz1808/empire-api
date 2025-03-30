// empire/core/nestedHeaders.js
function compareNestedHeaders(a, b) {
    if (typeof a !== typeof b) return false;
  
    if (typeof a === "object") {
      for (const key in a) {
        if (!compareNestedHeaders(a[key], b[key])) return false;
      }
      return true;
    }
  
    return a === b;
  }
  
  module.exports = { compareNestedHeaders };
  