const fs = require('fs-extra')
const path = require('path')
const liveServer = require('live-server')

const getData = require('./src/getData')
const watch = require('./src/watch')
const writeIndex = require('./src/writeIndex')

const CONSTANT = require('./src/constant.json')

async function build(entryPath, dataPath, imgPath, distPath, watching) {
  try {
    const content = getData.content(dataPath)
    const imageData = imgPath && (await getData.images({imgPath, distPath})) || {}

    await fs.ensureDir(distPath)
    const config = {
      entryPath,
      dataPath,
      imgPath,
      distPath,
      watching,
      content,
      imageData
    }
    const build = await writeIndex(config)

    if (watching) {
      watch(config, build)
      const params = CONSTANT.PARAMS
      Object.assign(params, {watch: getData.imports})
      liveServer.start(params)
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports = build
