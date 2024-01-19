const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const uuid = require('uuid').v4;
const fse = require('fs-extra');

const { HttpError } = require('../utils');

/**
 * Image upload service class
 */
class ImageService {
  static initUploadMiddleware(name) {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cbfunc) => {
      if (file.mimetype.startsWith('image/')) {
        cbfunc(null, true);
      } else {
        cbfunc(new HttpError(400, 'Please, upload images only!!!'), false);
      }
    };
    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
      limits: {
        fileSize: 2 * 1024 * 1024,
      },
    }).single('avatar');
  }
  // 'images', 'users', '<fileName>, extention

  static async saveImage(file, options, ...pathSegments) {
    if (file.size > (options?.maxFileSize
      ? options.maxFileSize * 1024 * 1024 : 1 * 1024 * 1024)) {
      throw new HttpError(400, 'File is too large!');
    }

    const fileName = `${uuid()}.jpeg`;
    const fullFilePath = path.join(process.cwd(), 'public', ...pathSegments);

    await fse.ensureDir(fullFilePath); // перевіряє чи є ця послідовність(шлях) в директорії, якщо немає - створює
    await sharp(file.buffer) // сконвертує і запише на жорсткий диск
      .resize({ height: options?.height ?? 300, width: options?.width ?? 300 })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(path.join(fullFilePath, fileName));

    return path.join(...pathSegments, fileName);
  }
}

module.exports = ImageService;
