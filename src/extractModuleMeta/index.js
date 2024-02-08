import path from 'path'
import { fileURLToPath } from 'url'

export default function extractModuleMeta(
  importMetaUrl,
  rootRelativePath = '../../'
) {
  const __filename = fileURLToPath(importMetaUrl)
  const __dirname = path.dirname(__filename)
  return {
    __dirname,
    __filename,
    rootPath: path.join(__dirname, rootRelativePath),
  }
}
