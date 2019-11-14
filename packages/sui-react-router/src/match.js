import React from 'react'
import reactTreeWalker from './react-tree-walker'

const fromReactTreeToJSON = root => {
  console.log(root, !React.isValidElement(root))
  // if (!React.isValidElement(root)) {
  //   return null
  // }
  return React.Children.toArray(root.props.children).reduce((acc, child) => {
    const {component, path, children, getComponent} = child.props
    return [
      ...acc,
      {
        ...(component && {component}),
        ...(path && {path}),
        ...(getComponent && {getComponent}),
        ...(children && {
          children: fromReactTreeToJSON(children)
        })
      }
    ]
  }, [])
}

const match = ({routes, history}, cb) => {
  const json = fromReactTreeToJSON(routes)
  console.log(json)
}

export default match

/*
[
{
  component: App,
  children: [{
    path: '/',
    children: [
      {
        index: true,
        getComponent=loadHomePage
      },
      {
        path: 'list',
        getComponent=loadListPage
      },
      {
        path: 'detail/:id',
        getComponent=loadDetailPage
      },

    ]
  }]
}
]
*/
