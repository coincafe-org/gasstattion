import fetch from 'isomorphic-fetch'
import { promises } from 'fs'
import { plot, red, yellow, blue, green } from 'asciichart'
import { resolve } from 'path'
import { secrets } from './env'

const GAS_API_ENDPOING = `https://ethgasstation.info/api/ethgasAPI.json?api-key=${secrets.GAS_STATION_API_KEY}`
const RECORDS_FILE = './data/gas.csv'
const RECORDS_LIMIT = 100

type EthGasstationData = {
  blockNum: number,
  safeLow: number,
  average: number,
  fast: number,
  fastest: number
}

export async function fetchCurrentGasData(): Promise<EthGasstationData> {
  const data = await fetch(GAS_API_ENDPOING).then(async (res) => {
    const { status, statusText } = res
    const body = await res.text()
    let json;

    try {
      json = JSON.parse(body)
    } catch (err) {
      throw Object.assign(new Error(`Unexpected response body from API`), { status, statusText, body })
    }

    if (res.status >= 400) {
      throw Object.assign(new Error(`Unexpected response code from API`), { status, statusText, body: json })
    }

    return json
  })

  return {
    blockNum: data.blockNum,
    safeLow: data.safeLow,
    average: data.average,
    fast: data.fast,
    fastest: data.fastest
  }
}

function file() {
  return resolve(process.cwd(), RECORDS_FILE)
}

export async function retrieveGasData() {
  const data = await promises.readFile(file(), 'utf-8')
  return data.split('\n')
    .slice(1)
    .filter((line => Boolean(line.trim())))
    .map((line) => {
      const [ blockNum, safeLow, average, fast, fastest ] = line.split(',').map(Number)
      return { blockNum, safeLow, average, fast, fastest }
    })
}

export async function saveGasData(records: EthGasstationData[]) {
  records = records.slice(- RECORDS_LIMIT)
  const heads = ['blockNum', 'safeLow', 'average', 'fast', 'fastest'] as (keyof EthGasstationData)[]
  const data = [
    heads,
    ...records.map((record: EthGasstationData) => {
      return heads.map(head => record[head])
    })
  ]
    .map(values => values.join(','))
    .join('\n')

  await promises.writeFile(file(), data)
  return records
}

export function plotGasData(records: EthGasstationData[]) {
  const safeLow = []
  const average = []
  const fast = []
  const fastest = []

  for (const record of records) {
    safeLow.push(record.safeLow / 10 )
    average.push(record.average / 10 )
    fast.push(record.fast / 10 )
    fastest.push(record.fastest / 10 )
  }

  console.log('')
  console.log(plot(
    [
      safeLow,
      average,
      fast,
      fastest
    ] as any,
    {
      // height: 25,
      colors: [ red, yellow, green, blue ]
    }
  ))
  console.log('')
}