import { fetchCurrentGasData } from "./gasstation"

test(`fetchCurrentGasData()`, async () => {
  const data = await fetchCurrentGasData()
  expect(Number.isFinite(data.average)).toBe(true)
  expect(Number.isFinite(data.blockNum)).toBe(true)
  expect(Number.isFinite(data.fast)).toBe(true)
  expect(Number.isFinite(data.fastest)).toBe(true)
  expect(Number.isFinite(data.safeLow)).toBe(true)
})