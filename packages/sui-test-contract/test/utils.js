import fs from 'node:fs'
import path from 'node:path'

const contractDir = path.join(process.cwd(), 'contract/documents')

const getFiles = consumer =>
  fs.readdirSync(contractDir).filter(file => file.includes(consumer))

export const getContractFileData = ({consumer, description}) => {
  const files = getFiles(consumer)
  const file = files.sort().at(-1)
  if (!file) return
  const data = fs.readFileSync(`${contractDir}/${file}`, {
    encoding: 'utf8'
  })
  if (!data) return
  const {interactions} = JSON.parse(data)

  return interactions.find(
    ({description: currentDescription}) => currentDescription === description
  )
}

export const removeContractFiles = ({consumer}) => {
  const files = getFiles(consumer)

  files.forEach(file => {
    fs.unlinkSync(`${contractDir}/${file}`)
  })
}
