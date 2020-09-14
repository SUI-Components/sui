/* eslint react/prop-types: 0 */
import cx from 'classnames'

import Box from '../Box'

const Article = ({
  children,
  className,
  elementType = 'article',
  outline,
  ...props
}) =>
  Box.call(this, {
    ...props,
    elementType,
    className: cx(
      'sui-studio-doc-article',
      {
        'sui-studio-doc-article-outline': outline
      },
      className
    ),
    children
  })

Article.displayName = 'Article'

export default Article
