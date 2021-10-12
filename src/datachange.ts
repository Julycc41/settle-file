import exifr from 'exifr'

export const changePointsType = (arr: any[]) => {
  return new Promise(async (res, rej) => {
    const allData = await arr.map(async (item: any) => {
      return await exifr.parse(item)
    })
    await Promise.all(allData).then((data: any) => {
      if (!data.length) {
        res([])
      }
      let dataArr: any = []
      data.map(async (items: any) => {
        // const mapItem = await exifr.parse(items)
        const cameraType = items.Model === 'ZH20T' ? 'H20T' : items.Model
        if (dataArr.length === 0) {
          dataArr.push(...[{ cameraType: cameraType, List: [items] }])
        } else {
          let res = dataArr.some((item: any) => {
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
      res(dataArr)
    })
  })
}
