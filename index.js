#! /usr/bin/env node

const swpg = require('./swift-pig')
const fs = require('fs-extra')
const imgFlag = '--img='
const distFlag = '--out='
const usage = `
$ swpg <entry_path> <data_path> [${imgFlag}<image_path>] [${distFlag}<dist_path>] [-w | --watch]
$ swpg -h | --help
`

const exit = (message) => {
  console.error(message)
  process.exit(1)
}

const args = [...process.argv]

if(args[1] === '-h' || args[1] === '--help') {
  console.info(usage)
  process.exit(0)
}

const [_, entryPath, dataPath, flag1, flag2, flag3] = args

if(args.length < 3) exit(`Expected 3 or more parameters. Recieved ${args.length}.`)
if(!fs.pathExistsSync(entryPath)) exit(`Entry path does not exist: ${entryPath}`)
if(!fs.pathExistsSync(dataPath)) exit(`Data path does not exist: ${dataPath}`)

const flags = [flag1, flag2, flag3]

const parseFlags = (flags, flagPrefix) => (flags.filter(f => f.startsWith(imgFlag))[0] || '').replace(imgFlag,'')

const imagePath = parseFlags(flags, imgFlag)
const distPath = parseFlags(flags, distFlag)
const watch = flags.include('-w') || flags.include('--watch')

swpg(entryPath, dataPath, imagePath, distPath, watch)
