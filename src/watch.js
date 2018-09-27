const chokidar = require('chokidar')
const getData = require('./getData')
const writeIndex = require('./writeIndex')

module.exports = async (data, cachedBuild) => {
  const importedFiles = Object.keys(require.cache).filter(fp => !fp.includes('node_modules'))
  let watcher = chokidar.watch(importedFiles, {
    persistent: true
  })
  console.log('watching...')
  let build = cachedBuild
  watcher.on('change', async (filepath, stats) => {
    console.log(`\x1b[35m UPDATED:\x1b[0m\t${filepath}`)
    getData.content(filepath)
    build = await writeIndex(data, build)
    if (stats) console.log('File', filePath, 'changed size to', stats.size)
  })
}
