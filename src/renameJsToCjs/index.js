import fs from 'fs'
import path from 'path'

export default async function renameJsToCjs(
  directory,
  ignoreFolders = ['node_modules']
) {
  try {
    const items = await fs.promises.readdir(directory)

    for (const item of items) {
      // 检查是否应该忽略这个文件夹
      if (ignoreFolders.includes(item)) {
        continue
      }

      const itemPath = path.join(directory, item)
      const stats = await fs.promises.stat(itemPath)

      if (stats.isDirectory()) {
        await renameJsToCjs(itemPath, ignoreFolders)
        continue
      }

      if (path.extname(item) === '.js') {
        let content = await fs.promises.readFile(itemPath, 'utf-8')

        // 替换 .js 引入为 .cjs
        content = content.replace(
          /require\(['"]([^'"]+)\.js['"]\)/g,
          "require('$1.cjs')"
        )

        // 写回文件
        await fs.promises.writeFile(itemPath, content, 'utf-8')

        // 更改文件扩展名
        const newPath = path.join(
          directory,
          `${path.basename(item, '.js')}.cjs`
        )
        await fs.promises.rename(itemPath, newPath)
      }
    }
  } catch (err) {
    console.error('An error occurred:', err)
  }
}
