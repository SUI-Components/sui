import express from 'express'
import ssr from './ssr'
import basicAuth from 'express-basic-auth'

const app = express()
const {PORT = 3000, AUTH_USERNAME, AUTH_PASSWORD} = process.env
const runningUnderAuth = AUTH_USERNAME && AUTH_PASSWORD
const AUTH_DEFINITION = {
  users: {[AUTH_USERNAME]: AUTH_PASSWORD},
  challenge: true
}

app.get('/_health', (req, res) =>
  res.status(200).json({uptime: process.uptime()})
)
runningUnderAuth && app.use(basicAuth(AUTH_DEFINITION))
app.use(express.static('statics'))
app.use(express.static('public', {index: false}))

app.get('*', ssr)

app.listen(PORT, () => console.log(`Server up & runnig port ${PORT}`))
