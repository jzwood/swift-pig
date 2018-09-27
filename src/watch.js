const chokidar = require('chokidar')
const getData = require('./getData')
const writeIndex = require('./writeIndex')

const CONSTANT = require('./constant.json')

module.exports = (config, cachedBuild) => {
  let watcher = chokidar.watch(getData.imports, {
    persistent: true
  })
  let build = cachedBuild
  watcher.on('change', async (filePath, stats) => {
    try {
      const templateChanged = filePath.includes(CONSTANT.INFIX)
      const contentChanged = filePath.includes(config.dataPath)
      const imageChanged = filePath.includes(config.imgPath) && (new RegExp(CONSTANT.PATTERN.IMG)).test(filePath)

      if (templateChanged) {
        getData.imports.forEach(packageName => {
          delete require.cache[packageName]
        })
      }

      else if (contentChanged) {
        const content = getData.content(filePath)
        Object.assign(config, {content})
      }

      else if (imageChanged) {
        const imageData = await getData.images(config)
        Object.assign(config, {imageData})
      }

      if (templateChanged || contentChanged || imageChanged) {
        console.log(`\x1b[35m UPDATED:\x1b[0m\t${filePath}`)
        build = await writeIndex(config, build)
        if (stats) console.log('File', filePath, 'changed size to', stats.size)
      }
    } catch(err) {
      console.error(err)
    }
  })
}
