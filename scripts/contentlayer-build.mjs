import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { Builtins, Cli } from 'clipanion'

const cliRoot = path.resolve(process.cwd(), 'node_modules/@contentlayer/cli')
const packageJson = JSON.parse(fs.readFileSync(path.join(cliRoot, 'package.json'), 'utf8'))
const buildCommandUrl = pathToFileURL(path.join(cliRoot, 'dist/commands/BuildCommand.js')).href
const { BuildCommand } = await import(buildCommandUrl)

const cli = new Cli({
  binaryLabel: 'Contentlayer CLI',
  binaryName: 'contentlayer',
  binaryVersion: packageJson.version,
})

cli.register(BuildCommand)
cli.register(Builtins.HelpCommand)
cli.register(Builtins.VersionCommand)

try {
  const exitCode = await cli.run(['build'], Cli.defaultContext)
  process.exitCode = typeof exitCode === 'number' ? exitCode : 0
} catch (error) {
  console.error(error)
  process.exitCode = 1
}
