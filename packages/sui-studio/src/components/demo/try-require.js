/* global __BASE_DIR__ */

const reqComponentsSrc =
  require.context(`bundle-loader?lazy!${__BASE_DIR__}/components`, true, /^\.\/\w+\/\w+\/src\/index\.jsx?/)
const reqComponentsPlayGround =
  require.context(`bundle-loader?lazy!raw-loader!${__BASE_DIR__}/demo`, true, /^.*\/playground/)
const reqContextPlayGround =
  require.context(`bundle-loader?lazy-loader!${__BASE_DIR__}/demo`, true, /^.*\/context\.js/)
const reqRouterPlayGround =
  require.context(`bundle-loader?lazy-loader!${__BASE_DIR__}/demo`, true, /^.*\/routes\.js/)
const reqEventsPlayGround =
  require.context(`bundle-loader?lazy-loader!${__BASE_DIR__}/demo`, true, /^.*\/events\.js/)

const tryRequire = ({category, component}) => {
  const Component = new Promise(resolve => {
    require.ensure([], () => {
      let bundler
      try {
        bundler = reqComponentsSrc(`./${category}/${component}/src/index.js`)
      } catch (e) {
        bundler = reqComponentsSrc(`./${category}/${component}/src/index.jsx`)
      }
      bundler(bundle => resolve(bundle.default))
    })
  })

  const playground = new Promise(resolve => {
    require.ensure([], () => {
      try {
        const bundler = reqComponentsPlayGround(`./${category}/${component}/playground`)
        bundler(playground => resolve(playground))
      } catch (e) {
        return resolve(`return (<${Component.displayName || Component.name} />)`)
      }
    })
  })

  const context = new Promise(resolve => {
    require.ensure([], () => {
      try {
        const bundler = reqContextPlayGround(`./${category}/${component}/context.js`)
        bundler(context => resolve(context))
      } catch (e) {
        return resolve(false)
      }
    })
  })

  const routes = new Promise(resolve => {
    require.ensure([], () => {
      try {
        const bundler = reqRouterPlayGround(`./${category}/${component}/routes.js`)
        bundler(routes => resolve(routes))
      } catch (e) {
        return resolve(false)
      }
    })
  })

  const events = new Promise(resolve => {
    require.ensure([], () => {
      try {
        const bundler = reqEventsPlayGround(`./${category}/${component}/events.js`)
        bundler(events => resolve(events))
      } catch (e) {
        return resolve(false)
      }
    })
  })

  // const Component =
  //   System.import(`${__BASE_DIR__}/components/${category}/${component}/src/index.js`)
  //     .then(component => component.default)
  //     .catch(e => System.import(`${__BASE_DIR__}/components/${category}/${component}/src/index.jsx`))

  // const playground =
  //   System.import(`raw-loader!${__BASE_DIR__}/demo/${category}/${component}/playground`)
  //     .catch(e => `return (<${Component.displayName || Component.name} />)`)

  // const context =
  //   System.import(`${__BASE_DIR__}/demo/${category}/${component}/context.js`)
  //     .catch(e => false)

  // const routes =
  //   System.import(`${__BASE_DIR__}/demo/${category}/${component}/routes.js`)
  //     .catch(e => false)

  return Promise.all([Component, playground, context, routes, events])
}

export default tryRequire
