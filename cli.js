#! /usr/bin/env node

const swpg = require('./index')
const fs = require('fs-extra')
const process = require('process')
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

const args = [...process.argv].slice(2)

if(args[0] === '-h' || args[0] === '--help') {
  console.info(usage)
  process.exit(0)
}

const [entryPath, dataPath, flag1, flag2, flag3] = args

if(args.length < 2) exit(`Expected 2 or more arguments. Recieved ${args.length}.`)
if(!fs.pathExistsSync(entryPath)) exit(`Entry path does not exist: ${entryPath}`)
if(!fs.pathExistsSync(dataPath)) exit(`Data path does not exist: ${dataPath}`)

const flags = [flag1, flag2, flag3]

const parseFlags = (flags, flagPrefix) => (flags.filter(f => typeof(f) === 'string' && f.startsWith(flagPrefix))[0] || '').replace(flagPrefix,'')

const imagePath = parseFlags(flags, imgFlag)
const distPath = parseFlags(flags, distFlag)
const watch = flags.includes('-w') || flags.includes('--watch')

swpg(entryPath, dataPath, imagePath, distPath, watch)
