class Reporter {
  #data

  static RULES_TO_SEND = ['sui/']

  static create() {
    return new Reporter()
  }

  map(results) {
    const stats = results.reduce((rulesIDs, entry) => {
      const repitedRulesFailed = entry.messages.map(message => message.ruleId)
      const rulesFailed = new Set([...repitedRulesFailed])

      rulesFailed.forEach(rule => {
        rulesIDs[rule] = rulesIDs[rule] ?? []
        rulesIDs[rule].push(entry.filePath)
      })
      return rulesIDs
    }, {})

    this.#data = {
      totalFiles: results.length,
      ...stats
    }

    return this
  }

  send() {
    if(this.#data === undefined){
      throw new Error('[sui-lint] No data to send. Maybe you must call to map before')
    }
    debugger
    const {totalFiles, ...rest} = this.#data
    const statsEntries = Object.entries(rest).map(entry => {
      const [rule, failedFiles] = entry
      if(!Reporter.RULES_TO_SEND.some(whiteRule => rule.startsWith(whiteRule))) return false

      return [rule, (failedFiles.length * 100) / totalFiles]
    }).filter(Boolean)

    debugger
    const stats = Object.fromEntries(statsEntries)

  }

  toJSON() {
    return {}
  }
}

module.exports.Reporter = Reporter
