/**
 * the place I ripped the assets from had the images as "png" which actually turned out
 * to be webp so this is a garbage script to convert the directory
 */

const fs = require("fs");
const path = require("path");
const { CWebp, DWebp } = require("cwebp");

// convert annoying fake pngs to actual pngs
function convert_directory(dir) {
  fs.readdir(dir, (err, files) => {
    files.forEach(async (file) => {
      // get the details of the file
      let fileDetails = fs.lstatSync(path.resolve(dir, file));
      // check if the file is directory
      if (fileDetails.isDirectory()) {
        convert_directory(path.join(dir, file));
        // if png : "png" => webp => png
      } else if (file.indexOf(".png") !== -1) {
        const image_path = path.join("./", dir, file);
        const encoder = new CWebp(image_path);

        encoder.write(image_path.replace(".png", ".webp"), () => {
          const decoder = new DWebp(image_path.replace(".png", ".webp"));
          decoder.write(image_path, () => {
            fs.unlinkSync(image_path.replace(".png", "webp"));
          });
        });
      }
    });
  });
}

convert_directory("resources");
