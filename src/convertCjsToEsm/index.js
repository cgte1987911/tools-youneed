// convertCjsToEsm.mjs
import fs from 'fs'
import path from 'path'

export default async function convertCjsToEsm(target) {
  try {
    const stats = await fs.promises.stat(target)

    // Ignore node_modules directory
    if (path.basename(target) === 'node_modules') {
      return
    }

    if (stats.isDirectory()) {
      const items = await fs.promises.readdir(target)
      for (const item of items) {
        await convertCjsToEsm(path.join(target, item))
      }
    } else if (
      stats.isFile() &&
      ['.cjs', '.js', '.mjs'].includes(path.extname(target))
    ) {
      let content = await fs.promises.readFile(target, 'utf-8')
      content = content.replace(
        /require\(['"]([^'"]+)\.cjs['"]\)/g,
        "require('$1.js')"
      )
      // Handle different CommonJS cases
      content = content.replace(
        /const (\w+) = require\(['"]([^'"]+)['"]\)(;?)/g,
        (_match, p1, p2, p3) => `import ${p1} from '${p2}'${p3}`
      )
      content = content.replace(
        /const (\{[\w\s,]+\}) = require\(['"]([^'"]+)['"]\)(;?)/g,
        (_match, p1, p2, p3) => `import ${p1} from '${p2}'${p3}`
      )
      content = content.replace(
        /module\.exports = (\w+)(;?)/g,
        (_match, p1, p2) => `export default ${p1}${p2}`
      )
      content = content.replace(
        /exports\.(\w+) = (\w+)(;?)/g,
        (_match, p1, p2, p3) => `export const ${p1} = ${p2}${p3}`
      )
      content = content.replace(
        /module\.exports = {([^}]+)}/gs,
        (_match, p1) => {
          return `export default {\n${p1.trim()}\n}`
        }
      )

      // Write back to the same file
      await fs.promises.writeFile(target, content, 'utf-8')

      // Rename the file if it is a .cjs file
      if (path.extname(target) === '.cjs') {
        const newTarget = path.join(
          path.dirname(target),
          `${path.basename(target, '.cjs')}.js`
        )
        await fs.promises.rename(target, newTarget)
      }
    }
  } catch (err) {
    console.error('An error occurred:', err)
  }
}
