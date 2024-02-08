import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

export default function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath))
}
