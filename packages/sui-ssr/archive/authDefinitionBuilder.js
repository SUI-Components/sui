module.exports = ([username, password]) => {
  // console.log('')
  // console.log('->'.bold, ' AUTH'.blue.bold, 'option setted'.bold)
  // console.log(
  //   '-> Web server will run over'.bold,
  //   ' authentication 🔐'.blue.bold
  // )
  // console.log('')
  // console.log('         -> USERNAME:'.bold, username.cyan)
  // console.log('         -> PASSWORD:'.bold, password.replace(/(.?)/g, '*').cyan)
  // console.log('')

  return `ENV AUTH_USERNAME ${username}\nENV AUTH_PASSWORD ${password}`
}
