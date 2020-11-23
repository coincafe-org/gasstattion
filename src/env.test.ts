import { secrets, escape } from "./env"

test(`escape`, () => {
  const repeate = 3 + Math.floor(Math.random() * 10)
  const result: typeof secrets = {
    GAS_STATION_API_KEY: '${GAS_STATION_API_KEY}'
  }
  const value = JSON.stringify(secrets)
  const valueExpected = JSON.stringify(result)


  expect(escape(value)).toBe(valueExpected)
  expect(escape(value.repeat(repeate))).toBe(valueExpected.repeat(repeate))
})