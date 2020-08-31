import React, {createElement} from 'react'
import cx from 'classnames'

import Typography from '../Typography'

const Article = ({
  children,
  className,
  elementType = 'article',
  mode,
  ...props
}) => createElement(
  elementType,
  {
    ...props,
    className: cx(
      'sui-studio-doc-article',
      {
        [`sui-studio-doc-article-mode-${mode}`]: mode
      },
      className
    ),
    mode

  },
  children
)
Article.displayName = 'Article'

export default Article
