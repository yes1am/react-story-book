import React from 'react';
import useImage from './useImage';

const passthroughContainer = (x) => x

const imagePromiseFactory = ({decode = true, crossOrigin = ''}) => (src) => {
  return new Promise((resolve, reject) => {
    const i = new Image()
    if (crossOrigin) {
      i.crossOrigin = crossOrigin
    }
    i.onload = () => {
      if(decode && i.decode) {
        i.decode().then(resolve).catch(reject)
      } else {
        resolve()
      }
    }
    i.onerror = reject
    i.src = src
  })
}


export default function Img({
  decode = true,
  src: srcList = [],
  loader = null,
  unloader = null,
  crossorigin,
  ...imgProps // anything else will be passed to the <img> element
}) {
  let imgPromise = imagePromiseFactory({decode, crossOrigin: crossorigin})

  const {src, isLoading, error} = useImage({
    srcList,
    imgPromise,
  })

  // 如果加载成功
  if (src) {
    return <img src={src} {...imgProps} />;
  }

  // show loader if we have one and were still trying to load image
  if (isLoading) {
    return loader
  }

  if (error) {
    return unloader
  }

  return null
}
