import {remove as removeAccents} from 'remove-accents'

// given a value and a query, if value has the query as a subset highlight it using startTag and endTag
export const highlightText = ({value, query, startTag, endTag}) => {
  // replace accents and lowercase
  const queryWithoutAccents = removeAccents(query).toLowerCase()
  const valueWithoutAccents = removeAccents(value).toLowerCase()
  // get all the matches of the query in the value
  const matches = findMatches(valueWithoutAccents, queryWithoutAccents)
  const tagsLength = (startTag + endTag).length
  // highlight the matches of the query in the value
  const highlighterReducer = (valueHighlightedAccumulator, match, i) => {
    const start = match.start + i * tagsLength
    const end = match.end + i * tagsLength
    return `${valueHighlightedAccumulator.slice(0, start)}${startTag}${valueHighlightedAccumulator.slice(
      start,
      end
    )}${endTag}${value.slice(match.end)}`
  }

  return matches.reduce(highlighterReducer, value)
}

const findMatches = (value, query) => {
  let from = 0
  const matches = []
  let match
  while ((match = findMatch(value, query, from))) {
    matches.push(match)
    from = match.end
  }
  return matches
}

const findMatch = (value, query, from = 0) => {
  const startingPosition = value.indexOf(query, from)
  const isQueryEmpty = query === ''
  if (startingPosition < 0 || isQueryEmpty) {
    return null
  }
  const endingPosition = startingPosition + query.length
  // return matched start and end index
  return {start: startingPosition, end: endingPosition}
}
