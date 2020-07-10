import React from 'react'
import {render} from 'react-dom'

import {useImages} from './hooks/useImages'
import './styles.scss'

const App = () => {
  const {images} = useImages()

  return (
    <>
      <h3>Hello images!</h3>
      {images.map((imageUrl, index) => (
        <img src={imageUrl} alt={`Image ${index} - ${imageUrl}`} key={index} />
      ))}
    </>
  )
}

render(<App />, document.getElementById('🖼️'))
