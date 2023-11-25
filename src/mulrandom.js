/**
 * Mulberry rng javascript varient
 * adapted from:
 * https://gist.github.com/tommyettinger/46a874533244883189143505d203312c?permalink_comment_id=4577493#gistcomment-4577493
 *
 * I just wanted a simple seedable rng so here this is
 */

let base = Math.floor(Math.random() * 0x7fffffff); // a "random" starting number

/**
 * Set the seed for the generator
 * @param {int,string} seedling   seed for the generator
 */
function seed(seedling) {
  base = seedling;
}

/**
 * Mulberry rng next function
 * @returns 32bit random int
 */
function next() {
  base = (base + 0x9e3779b9) | 0; // the `| 0` coerces it into a 32-bit int
  let z = base;
  z ^= z >>> 16;
  z = Math.imul(z, 0x21f0aaad);
  z ^= z >>> 15;
  z = Math.imul(z, 0x735a2d97);
  z ^= z >>> 15;
  return z;
}

/**
 * Generate a random number in the range [0,1)
 */
function clamped_next() {
  // too lazy to think abt twos complement so have a / 2
  return (next() / 0x80000000 + 1) / 2;
}

module.exports = {
  random: clamped_next,
  random32: next,
  seed,
};
