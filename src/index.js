/**
 * Garbage module to generate random amogus characters
 * author:  njasi
 * date:    24/11/2023
 */

const jimp = require("jimp");
const path = require("path");
const fs = require("fs");
const { random, seed } = require("./mulrandom");

/**
 * lazy function to probe the directory to see how many choices of accessories there are
 * @param {string} path
 */
function probe_directory(dirpath) {
  const map = {};
  let count = 0;
  const files = fs.readdirSync(path.join(__dirname, "../", dirpath));

  // sort numerically
  files.sort(function (a, b) {
    return a.split(".")[0] - b.split(".")[0];
  });

  // map file paths to
  files.forEach(async (file) => {
    if (file.indexOf(".png") !== -1) {
      count++;
      map[count] = path.join(__dirname, "../", dirpath, file);
    }
  });

  return [count, map];
}

// load in all the directory
const [HATS_COUNT, HATS_MAP] = probe_directory("resources/hats");
const [BACKPACKS_COUNT, BACKPACKS_MAP] = probe_directory("resources/backpacks");
const [BOTTOMS_COUNT, BOTTOMS_MAP] = probe_directory("resources/bottoms");
const [PETS_COUNT, PETS_MAP] = probe_directory("resources/pets");

// base images
const BASE_AMOGUS = path.join(
  __dirname,
  "../",
  "resources/characters/green.png"
);
const OUTLINE = path.join(__dirname, "../", "resources/characters/outline.png");

/**
 * Generate an amogus img with the requested resources
 * @param {Object} options
 * @param {int} options.hat           id of hat or -1 for none
 * @param {int} options.backpack      id of backpack or -1 for none
 * @param {int} options.pet           id of pet or -1 for none
 * @param {int} options.bottom        id of bottom or -1 for none
 * @param {float} options.color       color spin to use for the main body
 * @param {float} options.brightness  brightness adjustment to the body -1 to 1
 */
async function generate_amogus(output_path, options = {}) {
  // images to lay ontop of eachother, first is the base
  const accessories = [];

  if (options.bottom > 0) {
    accessories.push(BOTTOMS_MAP[options.bottom]);
  }
  if (options.backpack > 0) {
    accessories.push(BACKPACKS_MAP[options.backpack]);
  }
  if (options.hat > 0) {
    accessories.push(HATS_MAP[options.hat]);
  }
  if (options.pet > 0) {
    accessories.push(PETS_MAP[options.pet]);
  }

  // load static images
  let base = await jimp.read(BASE_AMOGUS);
  let outline = await jimp.read(OUTLINE);

  // color spin and brightness adj the base
  base = await base.color([{ apply: "spin", params: [options.color] }]);
  base = await base.brightness(options.brightness);

  // overlay the normal outline so outline, visor, and shadow are not affected
  // by the previous stuff
  base.composite(outline, 0, 0, {
    mode: jimp.BLEND_SOURCE_OVER,
    opacityDest: 1,
    opacitySource: 1,
  });

  // now go through all the accessories
  for (let i = 0; i < accessories.length; i++) {
    const accessory = await jimp.read(accessories[i]);
    await base.composite(accessory, 0, 0, {
      mode: jimp.BLEND_SOURCE_OVER,
      opacityDest: 1,
      opacitySource: 1,
    });
  }

  await base.write(output_path);
}

/**
 *  basic wrapper to keep logic clean, select an int [1, count]
 *  or with probabilty p return -1
 * @param {double} probabilty   the probabilty to include an accessory
 * @param {int} count           the total count of accessory options
 * @returns                     int id of the aaccessory, or -1 for none
 */
function roll_accessory(p, count) {
  if (p == undefined) p = 1;
  if (random() >= p) return -1;
  return Math.ceil(random() * count);
}

/**
 * Generate a random amogus
 * @param {String} path                 Where to save the generated image
 * @param {Object} options              options object
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
async function generate_random_amogus(path, options = {}) {
  if (options.seed) {
    seed(options.seed);
  }

  const color = random() * 360;
  const bright_range = (options.bright_max || 0) - (options.bright_min || -1);
  const brightness = random() * bright_range - bright_range / 2;

  return await generate_amogus(path, {
    hat: roll_accessory(options.hat, HATS_COUNT),
    backpack: roll_accessory(options.backpack, BACKPACKS_COUNT),
    pet: roll_accessory(options.pet, PETS_COUNT),
    bottom: roll_accessory(options.bottom, BOTTOMS_COUNT),
    color,
    brightness,
  });
}

module.exports = {
  generate_amogus,
  generate_random_amogus,
};

if (require.main === module) {
  const usage_string = "node index.js output_path [int:seed]";
  let seed = 0;

  if (process.argv.length < 3) {
    console.log(usage_string);
    return;
  }

  if (process.argv.length == 4) {
    seed = parseInt(process.argv[3]);
    if (!seed) {
      console.log(usage_string);
      return;
    }
  }

  // do the sample generation
  (async () => {
    await generate_random_amogus(process.argv[2], {
      hat: 0.7,
      backpack: 0.7,
      pet: 0.5,
      bottom: 1,
      seed: seed,
    });
  })();
}

module.exports = {
  generate_amogus,
  generate_random_amogus,
};
