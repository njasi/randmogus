# Randmogus

A garbage package I wrote to generate random amogus characters. Using it for anon pfps on a different project.

Wouldn't reccomend using this, but if you do and want to add resources just make a pr.

## Usage

```js
const randmogus = require("randmogus");

randmogus.generate_random_amogus("output.png", {
  // probability to include the accessory type, see "docs"
  hat: 0.7,
  backpack: 0.7,
  pet: 0.5,
  bottom: 0.5,
  seed: 42,
});
```

### Cli

```
node src/index.js output_path [seed]
```

## Docs

dont want to write actual docs for this joke so heres the function signatures:

```js
/**
 * Generate an amogus img with the requested resources
 * @param {any} options                 options object
 * @param {int} options.hat             id of hat or -1 for none
 * @param {int} options.backpack        id of backpack or -1 for none
 * @param {int} options.pet             id of pet or -1 for none
 * @param {int} options.bottom          id of bottom or -1 for none
 * @param {float} options.color         color spin to use for the main body
 * @param {float} options.brightness    brightness adjustment to the body -1 to 1
 */
async function generate_amogus(output_path, options = {});

/**
 * Generate a random amogus
 * @param {string} path                 Where to save the generated image
 * @param {any} options              options object
 * @param {double} options.hat          probability of including the accsssory, default 1
 * @param {double} options.backpack     probability of including the accsssory, default 1
 * @param {double} options.pet          probability of including the accsssory, default 1
 * @param {double} options.bottom       probability of including the accsssory, default 1
 * @param {double} options.colorspin    the degree range the base color will be spun (0, colorspin]
 *                                      base color is the light green amogus, default 360
 * @param {int} options.bright_min      minimum of the brightness adj range, default -1
 * @param {int} options.bright_max      maximum of the brightness adj range, default 0
 * @param {int} options.seed            seed for random
 */
async function generate_random_amogus(path, options = {});
```
