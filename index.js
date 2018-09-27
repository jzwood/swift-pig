const fs = require('fs-extra')
const path = require('path')
const liveServer = require('live-server')

const getData = require('./src/getData')
const watch = require('./src/watch')
const writeIndex = require('./src/writeIndex')

async function build(entryPath, dataPath, imgPath, distPath, watching) {
console.log(entryPath, dataPath, imgPath, distPath, watching)
  try {
    const content = getData.content(dataPath)
    const imageData = imgPath && (await getData.images(imgPath)) || {}

    await fs.ensureDir(distPath)
    const data = {
      entryPath,
      content,
      imageData,
      distPath,
      watching
    }
    const build = await writeIndex(data)

    if (watching) {
      const params = {
        port: 3000,
        host: 'localhost',
        root: '.',
        open: false, // When false, it won't load your browser by default.
        logLevel: 1 // 0 = errors only, 1 = some, 2 = lots
      }

      watch(data, build)
      liveServer.start(params)
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = build
