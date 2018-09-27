const fs = require('fs-extra')
const path = require('path')
const sizeOf = require('image-size')

module.exports.images = async imagePath => {
  const IMG_PATTERN = /\.(jpg|gif|png|jpeg)$/
  return (await fs.readdir(imagePath))
    .filter(file => IMG_PATTERN.test(file))
    .reduce((imgCache, file) => {
      const key = path.basename(file)
      if (imgCache[key]) {
        console.warn(`Duplicate image name: ${key}`)
        return imgCache
      } else {
        const filePath = path.join(imagePath, file)
        const { width, height } = sizeOf(filePath)
        return Object.assign(imgCache, {
          [key]: {
            src: filePath,
            width,
            height
          }
        })
      }
    }, {})
}

module.exports.content = dataPath => {
  delete require.cache[path.resolve(dataPath)]
  return require(`./${path.relative(__dirname, dataPath)}`)
}
