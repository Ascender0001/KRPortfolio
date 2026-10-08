// Renders cv/cv.html to a one-page A4 PDF with headless Chrome.
// Usage: node cv/build.mjs [output.pdf]   (default: cv/kiraly_robert_cv.pdf)
// Set CHROME to override the browser path.

import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const output = resolve(process.argv[2] ?? resolve(here, 'kiraly_robert_cv.pdf'))

const candidates = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean)
const chrome = candidates.find((path) => existsSync(path))
if (!chrome) throw new Error('Chrome not found; set CHROME to its path.')

execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--virtual-time-budget=10000', // let Google Fonts and the sphere script finish
  `--print-to-pdf=${output}`,
  pathToFileURL(resolve(here, 'cv.html')).href,
])

console.log(`CV written to ${output}`)
