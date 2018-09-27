const fs = require('fs-extra')
const path = require('path')
const sizeOf = require('image-size')

const CONSTANT = require('./constant.json')

async function images({imgPath, distPath}) {
  const imgRegex = new RegExp(CONSTANT.PATTERN.IMG)
  return (await fs.readdir(imgPath))
    .filter(file => imgRegex.test(file))
    .reduce((imgCache, file) => {
      const key = path.basename(file)
      if (imgCache[key]) {
        console.warn(`Duplicate image name: ${key}`)
        return imgCache
      } else {
        const filePath = path.join(imgPath, file)
        const { width, height } = sizeOf(filePath)
        return Object.assign(imgCache, {
          [key]: {
            src: path.relative(distPath, filePath),
            width,
            height
          }
        })
      }
    }, {})
}

function content(dataPath) {
  delete require.cache[path.resolve(dataPath)]
  return require(`./${path.relative(__dirname, dataPath)}`)
}

module.exports = {
  images,
  content,
  get imports(){
    return Object.keys(require.cache).filter(packagePath => !packagePath.includes('node_modules'))
  }
}
