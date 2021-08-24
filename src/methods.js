import exifr from 'exifr'
export const getMatchingList = infos => {
  const points = []
  return new Promise((resolve, rej) => {
    //根据图片类型来分类数组
    changePointsType(infos)
      .then(pointsCameraType => {
        console.log(`%c 💆‍♀️ 🚀 : pointsCameraType `, `font-size:14px;background-color:#d4ca49;color:black;`, pointsCameraType)
        if (!pointsCameraType.length) {
          resolve(points)
        } else {
          pointsCameraType.map(cameraType => {
            readPoint(cameraType.List).then(result => {
              resolve(result)
            })
          })
        }
      })
      .catch(error => {
        console.error('当前没有数据')
      })
  })
}

const readPoint = async data => {
  let filterPoints = []
  const fetchData = data.map(item => exifr.parse(item))
  await Promise.all(fetchData).then(allData => {
    allData.reduce((total, currentValue, currentIndex, ar) => {
      const index = total.findIndex(item => {
        if (!item[0].latitude || !item[0].longitude) {
          console.error('当前图片没有经纬度', item)
          item[0].errorTitle = '图片没有经纬度'
          return -1
        } else {
          return inGroupTime(item[0], currentValue)
        }
      })
      if (index >= 0) {
        let isHas = filterPoints[index].find(v => {
          if (v.name === data[currentIndex].name) {
            return v
          }
        })
        if (!isHas) {
          total[index].push(currentValue)
          filterPoints[index].push(data[currentIndex])
        } else {
          console.error('数据重复啦')
        }
      } else {
        // currentValue.errorTitle = "图片时间不匹配";
        total[total.length] = [currentValue]
        filterPoints.push([data[currentIndex]])
      }
      return total
    }, [])
  })
  return filterPoints
}
//时间比较
function inGroupTime(p1, p2) {
  let preDate = Date.parse(p1?.DateTimeOriginal)
  let nextDate = Date.parse(p2?.DateTimeOriginal)
  let defaultLimit = 3 * 1000 // 默认范围时3000毫秒 上面处理出来的时间是毫秒为单位
  if (Math.abs(preDate - nextDate) - defaultLimit <= 0) {
    return true
  } else {
    return false
  }
}

//匹配文件类型
export const changePointsType = arr => {
  return new Promise(async (res, rej) => {
    if (!arr.length) {
      rej([])
    }
    let dataArr = []
    arr.forEach(async items => {
      const mapItem = await exifr.parse(items)
      const cameraType = mapItem.Model === 'ZH20T' ? 'H20T' : mapItem.Model
      if (dataArr.length === 0) {
        dataArr.push({ cameraType: cameraType, List: [items] })
      } else {
        let res = dataArr.some(item => {
          if (item.cameraType === cameraType) {
            item.List.push(items)
            return true
          }
        })
        if (!res) {
          dataArr.push(...[{ cameraType: cameraType, List: [items] }])
        }
      }
    })
    //Todo: 这里代码有问题 正常情况不用使用定时器来强制操作异步
    setTimeout(() => {
      res(dataArr)
    }, 10)
  })
}
