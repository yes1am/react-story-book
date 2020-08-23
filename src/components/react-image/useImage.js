import React, {useState} from 'react'

const imagePromiseFactory = ({decode = true, crossOrigin = ''}) => (src) => {
  return new Promise((resolve, reject) => {
    const i = new Image()
    if (crossOrigin) {
      i.crossOrigin = crossOrigin
    }
    i.onload = () => {
      if(decode && i.decode) {
        i.decode()
          .then(resolve)
          .catch(reject)
      } else {
        resolve()
      }
    }
    i.onerror = reject
    i.src = src
  })
}

const stringToArray = (x) => (Array.isArray(x) ? x : [x])
const cache = {}

// sequential map.find for promises
const promiseFind = (arr, promiseFactory) => {
  let done = false
  return new Promise((resolve, reject) => {
    const queueNext = (src) => {
      return promiseFactory(src).then(() => {
        done = true
        resolve(src)
      })
    }

    arr
      .reduce((p, src) => {
        // ensure we aren't done before enquing the next source
        return p.catch(() => {
          if (!done) return queueNext(src)
        })
      }, queueNext(arr.shift()))
      .catch(reject)
  })
}

export default function useImage({
  srcList,
  imgPromise = imagePromiseFactory({decode: true}),
}) {
  const [, setIsLoading] = useState(true)
  const sourceList = stringToArray(srcList).filter(Boolean)
  const sourceKey = sourceList.join('')

  if (!cache[sourceKey]) {
    // create promise to loop through sources and try to load one
    cache[sourceKey] = {
      promise: promiseFind(sourceList, imgPromise),
      cache: 'pending',
      error: null,
    }
  }

  // 当加载成功或失败，更新缓存和 state
  cache[sourceKey].promise
    .then((src) => {
      // 更新缓存
      cache[sourceKey] = {...cache[sourceKey], cache: 'resolved', src}
      // 强制刷新
      setIsLoading(false);
    })
    .catch((error) => {
      cache[sourceKey] = {...cache[sourceKey], cache: 'rejected', error}
      setIsLoading(false);
    })

  if (cache[sourceKey].cache === 'resolved') {
    return {src: cache[sourceKey].src, isLoading: false, error: null}
  }

  if (cache[sourceKey].cache === 'rejected') {
    return {isLoading: false, error: cache[sourceKey].error, src: undefined}
  }

  return {isLoading: true, src: undefined, error: null}
}
