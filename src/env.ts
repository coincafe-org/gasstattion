import replace from 'replace-string'

export function env(name: string, defaultValue?: string): string {
  if (typeof process.env[name] === 'string') {
    return process.env[name] as string
  }

  if (typeof defaultValue === 'string') {
    return defaultValue
  }

  throw new Error(`Missinig environment variable "${name}"`)
}

const GAS_STATION_API_KEY = env('GAS_STATION_API_KEY')

export const secrets = {
  GAS_STATION_API_KEY
}

export function escape(str: string, apply: (val: string) => string = (val) => val) {

  for (const key of Object.keys(secrets) as (keyof typeof secrets)[]) {
    if (key && secrets[key]) {
      str = replace(str, GAS_STATION_API_KEY, apply('${' + key + '}'))
    }
  }

  return str
}