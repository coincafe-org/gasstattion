import "dotenv/config"
import { green } from "colors/safe"
import { logError } from "./src/error"
import { fetchCurrentGasData, plotGasData, retrieveGasData, saveGasData } from "./src/gasstation"

/**
 * Script execution
 */
Promise.resolve()
  .then(async () => {
    const newRecord = await fetchCurrentGasData()
    const records = await retrieveGasData()
    const lastestRecord = records[records.length - 1] || {}

    if (lastestRecord.blockNum === newRecord.blockNum) {
      console.log(`skipping... [reason: repeated record: ${lastestRecord.blockNum}]`)
      plotGasData(records)
      return
    }

    console.log(`updating storage... [new record: ${newRecord.blockNum}]`)
    const updatedRecords = await saveGasData([
      ...records,
      newRecord
    ])

    plotGasData(updatedRecords)
  })

  .then(async () => console.log(green('Done!')))

  .catch(logError)