import exifr from 'exifr'

export const changePointsType = (arr: any[]) => {
  return new Promise((res, rej) => {
    if (!arr.length) {
      rej([])
    }
    let dataArr: any = []
    arr.map(async items => {
      const mapItem = await exifr.parse(items)
      const cameraType = mapItem.Model === 'ZH20T' ? 'H20T' : mapItem.Model
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
    // setTimeout(() => {
    //   res(dataArr);
    // }, 100);
    console.log(dataArr)
    res(dataArr)
  })
}
