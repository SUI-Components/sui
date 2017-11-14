import bowser from 'bowser'

const browser = (userAgent) => bowser._detect(userAgent)

export default browser
