class Reporter {
  #data

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
    debugger
  }

  toJSON() {
    return {}
  }
}

module.exports.Reporter = Reporter
