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
              filterFile(result)
            })
          })
        }
      })
      .catch(error => {
        console.error('当前没有数据')
      })
  })
}
const filterFile = async filterPoints => {
  let listData = { right: [], error: [] }
  const allData = await filterPoints.map(async item => {
    const fetchArr = await item.map(async s => await exifr.parse(s))
    return Promise.all(fetchArr)
  })
  await Promise.all(allData).then(data => {
    data.map(async (item, ind) => {
      let sameData = [] //匹配的文件
      let sameFetchData = [] //正确匹配到文件
      const errorData = [] //错误匹配的图片

      item.map((v, index) => {
        if (
          (v.ExifImageWidth === 640 && v.ExifImageHeight === 512) ||
          (v.ExifImageWidth === 5184 && v.ExifImageHeight === 3888) ||
          (v.ExifImageWidth === 8000 && v.ExifImageHeight === 6000) ||
          (v.ExifImageWidth === 4000 && v.ExifImageHeight === 3000)
        ) {
          sameData.push(filterPoints[ind][index])
          sameFetchData.push(v)
        } else {
          filterPoints[ind][index].errorTile = '可见光或红外光图片未匹配成功'
          errorData.push(filterPoints[ind][index])
        }
      })

      if (sameData.length === 1) {
        //错误数据
        sameData.map(item => (item.errorTitle = '可见光或红外光图片未匹配成功'))
        errorData.push(sameData[0])
        return
      }

      if (sameData.length >= 4 && sameData.length % 2 === 0) {
        //将匹配相同的多余图片进行整合
        let dataArr = []
        sameFetchData.map((sameItem, ind) => {
          if (dataArr.length === 0) {
            dataArr.push({ width: sameItem.ExifImageWidth, List: [sameData[ind]] })
          } else {
            let res = dataArr.some(item => {
              if (item.width === sameItem.ExifImageWidth) {
                item.List.push(sameData[ind])
                return true
              }
            })
            if (!res) {
              dataArr.push({ width: sameItem.ExifImageWidth, List: [sameData[ind]] })
            }
          }
        })
        if (dataArr.length === 2) {
          //多个照片时间和经纬度相重
          const same1 = dataArr[0].List[0] //读取红外光第一个
          const same2 = dataArr[1].List[0] //读取可见外光第一个
          listData.right.push([same1.width > same2.width ? same2 : same1, same1.width > same2.width ? same1 : same2])
          const itemArrTimeSame = sameData.filter(item => item !== same1 && item !== same2)
          itemArrTimeSame.map(item => (item.errorTitle = '航点拍摄时间重复'))
          errorData.push(...itemArrTimeSame.map(item => item))
          sameData = sameData.filter(item => item.errorTitle !== '航点拍摄时间重复')
        }
        // const sames = sameData.map(item => {
        //   return exifr.parse(item)
        // })
        // Promise.all(sames).then(async sameAllData => {

        //   sameAllData.map((sameItem, ind) => {

        //   })
        //   if (dataArr.length === 2) {
        //     console.log(dataArr, '时间拍摄重复')
        //     //多个照片时间和经纬度相重
        //     const same1 = dataArr[0].List[0] //读取红外光第一个
        //     const same2 = dataArr[1].List[0] //读取可见外光第一个
        //     listData.right.push([same1.width > same2.width ? same2 : same1, same1.width > same2.width ? same1 : same2])
        //     const itemArrTimeSame = sameData.filter(item => item !== same1 && item !== same2)
        //     itemArrTimeSame.map(item => (item.errorTitle = '航点拍摄时间重复'))
        //     errorData.push(...itemArrTimeSame.map(item => item))
        //     console.log(sameData.filter(item => item.errorTitle !== '航点拍摄时间重复'))
        //     sameData = sameData.filter(item => item.errorTitle !== '航点拍摄时间重复')
        //   }
        // })
      }
      console.log(sameData, errorData, '相同数据错误数据返回')
      listData.right.push(sameData)
      listData.error.push(...errorData)
    })
  })
  console.log(listData, '函数返回值')
  return listData
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
        //查找到相匹配的图片进行返回查找
        let isHas = filterPoints[index].find(v => {
          if (v.name === data[currentIndex].name) {
            return v
          }
        })
        if (!isHas) {
          //没有查找到则push
          total[index].push(currentValue)
          filterPoints[index].push(data[currentIndex])
        } else {
          console.error('数据重复啦')
        }
      } else {
        // data[currentIndex].errorTitle = '图片时间不匹配'
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
    console.log(arr)
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
