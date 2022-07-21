const Jimp = require('Jimp');

const compressAvatar = async (path, newPath) => {
  const originalFile = await Jimp.read(path);
  return await originalFile.resize(250, Jimp.AUTO).write(newPath);
};

module.exports = { compressAvatar };
