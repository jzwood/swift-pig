const fs = require('fs-extra')
const path = require('path')

//renders templates and saves as index.html
module.exports = async ({entryPath, content, imageData, distPath, cachedBuild}) => {
  const INFIX = '.js.'
  if(!entryPath.includes(INFIX)) {
    throw `Templates must contain ${INFIX} in name. Not found in entry template: ${entryPath}`
  }
  const renderIndex = require(`./${path.relative(__dirname, entryPath)}`)

  const index = renderIndex(content, imageData)
  if (index !== cachedBuild) {
    cachedBuild = index
    const basePath = path.basename(entryPath)
    const ii = basePath.lastIndexOf(INFIX)
    const file = basePath.slice(0,ii) + '.' + basePath.slice(ii + INFIX.length)
    console.log(distPath, file, basePath)
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
