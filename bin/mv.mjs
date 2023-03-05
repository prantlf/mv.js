#!/usr/bin/env node

import { access, rename, stat } from 'fs/promises'
import { constants, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { basename, dirname, join } from 'path'

function getPackage() {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  return JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))
}

function help() {
  console.log(`${getPackage().description}

Usage: mv.js [-Dfnv] [--] src... dest

Options:
  -c|--cwd <dir>              directory to start looking for the source files
  -D|--dry-run                only print paths of source files or directories
  -f|--force                  removes the destination if not writable
  -n|--no-clobbering          prevents accidentally overwriting any files
  -v|--verbose                print path of each copied file or directory
  -V|--version                print version number
  -h|--help                   print usage instructions

Examples:
  $ mv.js prog.js prog.bak
  $ mv.js jones smith /home/nick/clients`)
}

const { argv } = process
const args = []
let   force, clobbering = true, verbose, dry, cwd

function fail(message) {
  console.error(message)
  process.exit(1)
}

for (let i = 2, l = argv.length; i < l; ++i) {
  const arg = argv[i]
  const match = /^(-|--)(no-)?([a-zA-Z][-a-zA-Z]*)(?:=(.*))?$/.exec(arg)
  if (match) {
    const parseArg = (arg, flag) => {
      switch (arg) {
        case 'c': case 'cwd':
          cwd = match[4] || argv[++i]
          return
        case 'D': case 'dry-run':
          dry = flag
          return
        case 'f': case 'force':
          force = flag
          return
        case 'clobbering':
          clobbering = flag
          return
        case 'n':
          clobbering = !flag
          return
        case 'v': case 'verbose':
          verbose = flag
          return
        case 'V': case 'version':
          console.log(getPackage().version)
          process.exit(0)
          break
        case 'h': case 'help':
          help()
          process.exit(0)
      }
      fail(`unknown option: "${arg}"`)
    }
    if (match[1] === '-') {
      const flags = match[3].split('')
      for (const flag of flags) parseArg(flag, true)
    } else {
      parseArg(match[3], match[2] !== 'no-')
    }
    continue
  }
  if (arg === '--') {
    args.push(...argv.slice(i + 1, l))
    break
  }
  args.push(arg)
}

if (args.length < 2) {
  help()
  process.exit(1)
}

try {
  const paths = []
  const files = []
  const patterns = args
    .slice(0, args.length - 1)
    .filter(src => {
      if (src.includes('*') || src.includes('?')) return true
      files.push(src)
    })
  if (patterns.length) {
    const glob = (await import('fast-glob')).default
    if (verbose) console.log(patterns.join('\n'))
    paths.push(...await glob(patterns, {
      cwd, extglob: true, dot: true, onlyFiles: false, markDirectories: true,
      followSymbolicLinks: false
    }))
  }

  const dest = args[args.length - 1]
  let destDir
  try {
    const stats = await stat(dest)
    destDir = stats.isDirectory()
  } catch (err) {
    /* c8 ignore next */
    if (err.code !== 'ENOENT') throw err
  }

  if (destDir === false) {
    try {
      await access(dest, constants.W_OK)
      if (!clobbering) throw new Error(`EEXIST: "${dest}" already exists`)
    } catch (err) {
      if (!force) throw err
    }
  }

  const renameMore = async (paths, keepPath) => {
    for (const path of paths) {
      if (verbose) console.log(path)
      if (dry) continue
      const srcPath = cwd ? join(cwd, path) : path
      const destPath = keepPath ? join(dest, path) :
        destDir ? join(dest, basename(path)) : dest
      await rename(srcPath, destPath)
    }
  }

  await renameMore(files, false)
  await renameMore(paths, true)
} catch({ message }) {
  console.error(message)
  process.exitCode = 1
}
