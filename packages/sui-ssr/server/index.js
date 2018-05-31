import express from 'express'
import ssr from './ssr'

const app = express()
const {PORT = 3000} = process.env

app.use(express.static('statics'))
app.use(express.static('public', {index: false}))

app.get('/_health', (req, res) =>
  res.status(200).json({uptime: process.uptime()})
)

app.get('*', ssr)

app.listen(PORT, () => console.log(`Server up & runnig port ${PORT}`))
