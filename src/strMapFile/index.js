import path from 'path'

export default function strMapFile(fatherPath) {
  return (command, ...nextArgs) => {
    const modulePath = path.resolve(fatherPath, command, 'index.js')
    import(modulePath).then((module) => {
      module.default(...nextArgs)
    })
  }
}
