import {useEffect, useState} from 'react'

export const useImages = () => {
  const [images, setImages] = useState([])

  useEffect(() => {
    const imagesData = require('../images.json')
    setImages(imagesData.images)
  }, [])

  return {images}
}
