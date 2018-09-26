//renders templates and saves as index.html
module.exports = async ({entryPath, content, imageData, distPath, buildCache}) => {
  const INFIX = '.js.'
  if(!entryPath.contains(INFIX)) {
    throw `Templates must contain ${INFIX} in name. Not found in entry template: ${entryPath}`
  }
  const renderIndex = require(entryPath)
  const index = renderIndex(content, imageData)
  if (index !== cachedHTML) {
    cachedHTML = index
    const ii = entryPath.lastIndexOf(EXT)
    const buildPath = path.join(distPath, path.basename(entryPath).slice(ii, ii + INFIX.length))
    //write local index that references local images
    await fs.writeFile(buildPath, index)

    console.info(`\x1b[32m SAVED:\x1b[0m\t${buildPath}`)
    //write local index in ic directory that referenes remote images
  } else {
    console.log(`File ${entryPath} not saved!`)
  }
  return cachedHTML
}
