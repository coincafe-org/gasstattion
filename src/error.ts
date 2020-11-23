import { grey, red, bold } from "colors/safe"
import { inspect } from "util"
import { escape } from "./env"

export function logError(error: Error) {
  console.log('')

  const { message, stack, ...data } = error
  const pos = (stack || '').indexOf('\n')
  if (stack && pos > 0) {
    console.log(red(escape(stack.slice(0, pos), bold)))
    console.log(grey(stack.slice(pos + 1)))
  } else  {
    console.log(red('Error: ' + escape(error.message, bold)))
  }

  if (Object.keys(data).length) {
    console.log('')
    console.log(grey('metadata:'))
    console.log(grey(escape(inspect(data, { depth: Infinity, colors: true }), bold)))
  }

  console.log('')
  console.log('')
  process.exit(1)
}