const fs = require('fs-extra')
const path = require('path')

const CONSTANT = require('./constant')

module.exports = async ({entryPath, content, imageData, distPath}, cachedBuild='') => {
  const infix = CONSTANT.INFIX
  if(!entryPath.includes(infix)) {
    throw `Templates must contain ${infix} in name. Not found in entry template: ${entryPath}`
  }
  const renderIndex = require(`./${path.relative(__dirname, entryPath)}`)

  const index = renderIndex(content, imageData)
  if (index !== cachedBuild) {
    cachedBuild = index
    const basePath = path.basename(entryPath)
    const ii = basePath.lastIndexOf(infix)
    const file = basePath.slice(0,ii) + '.' + basePath.slice(ii + infix.length)
    const buildPath = path.join(distPath, file)
    //write local index that references local images
    await fs.writeFile(`./${buildPath}`, index)
    console.info(`\x1b[32m SAVED:\x1b[0m\t${buildPath}`)
    //write local index in ic directory that referenes remote images
  } else {
    console.log(`File ${entryPath} not saved!`)
  }
  return cachedBuild
}
