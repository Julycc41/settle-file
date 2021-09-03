import { Cartesian3 } from 'cesium'

/**
 **
* @export
* @param {(PointInfo[]|[])} points 
* @param {(PointInfo[]|[])} tempInfos 新增
/**
*
*
* @export
* @param {(SkyWayInfos[] | [])} points 航线范围
* @param {*} servicePoints  服务器所包含
* @param {(any[] | [])} tempInfos 新增
* @param {*} change 更改的进度
* @param {*} currentPoints 当前航点
* @param {*} currentPlant 当前电站
* @param {*} currentTask 当前任务
* @returns
*/
export async function getPointMatching(
  points: any[] | [],
  servicePoints: any,
  tempInfos: any[] | [],
  matchStatusChange: any,
  currentPoints: any,
  currentPlant: any,
  currentTask: any,
  getRepetitionPoints: any
) {
  let index = 0
  let localList: any = [] // 本地与服务器相同的
  let errorList: any = [] // 不重复相同的
  let newErrorList: any = [] // 不重复相同的
  if (!points) return
  if (!tempInfos) return
  let indexCount = 0
  //遍历新增
  while (index < tempInfos.length) {
    const IndexObj = tempInfos[index]
    //航线便利匹配
    for (let i = 0; i < points.length; i++) {
      const filterArr: any = points[i].waypoints.filter((v: any) =>
        inGroupRange([+v.longitude, +v.latitude, +v.latitude], [+IndexObj.longitude, +IndexObj.latitude, +IndexObj.latitude])
      )
      if (filterArr.length > 0) {
        //匹配相同时进行赋值重新覆写
        IndexObj.waypoint_id = filterArr[0].id
        const infrared_cameraType =
          IndexObj.cameraType[0].infrared_cameraType === 'XT2' && IndexObj.focalLength[0].infrared_focalLength === 13
            ? 'ZXT2A13'
            : IndexObj.cameraType[0].infrared_cameraType === 'XT2' && IndexObj.focalLength[0].infrared_focalLength === 19
            ? 'ZXT2A19'
            : IndexObj.cameraType[0].infrared_cameraType

        const light_cameraType =
          IndexObj.cameraType[0].infrared_cameraType === 'XT2' && IndexObj.focalLength[0].infrared_focalLength === 13
            ? 'ZXT2A13'
            : IndexObj.cameraType[0].infrared_cameraType === 'XT2' && IndexObj.focalLength[0].infrared_focalLength === 19
            ? 'ZXT2A19'
            : IndexObj.cameraType[0].infrared_cameraType

        IndexObj.lens = infrared_cameraType
        IndexObj.cameraType[0].infrared_cameraType = infrared_cameraType
        IndexObj.cameraType[1].light_cameraType = light_cameraType
        IndexObj.selectType = 'local'

        IndexObj.name = `${currentPlant.id}-${currentTask.id}-${filterArr[0].skyway_id}-${indexCount}`
        localList.push(IndexObj)
      }
    }

    index++
    indexCount++
    await matchStatusChange(parseInt(((index / tempInfos.length) * 100).toString()))
  }

  errorList = getSamePointsList(localList, tempInfos)

  localList = getSameServicePointsList(servicePoints, localList)

  let obj: any = {}

  let peon = localList.reduce((cur: any, next: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    obj[next.name] ? '' : (obj[next.name] = true && cur.push(next))
    return cur
  }, []) //设置cur默认类型为数组，并且初始值为空的数组

  localList = peon

  if (errorList.length) {
    newErrorList = getErrorList(errorList)
  }
  getRepetitionPoints({
    //返回数据
    localList,
    newErrorList
  })
}

export const getErrorList = (errorList: any[]) => {
  const newErrorList: any[] = []
  errorList.map(item => {
    let infraredInfo: any | {} = {}
    let lightInfo: any | {} = {}
    infraredInfo = {
      id: '',
      uid: guid(),
      longitude: item?.longitude || '',
      latitude: item?.latitude || '',
      altitude: item?.GPSAltitude || '',
      name: item.infrared_name,
      size: item.size[1].infrared_size || '0 MB',
      create_time: item.create_time,
      width: item?.ExifImageWidth || 0,
      height: item?.ExifImageHeight || 0,
      brief: '',
      path: item.createInfraredPath,
      cameraType: item.cameraType[0].infrared_cameraType,
      title: '',
      errorTitle: '图片范围不匹配'
    }
    lightInfo = {
      id: '',
      uid: guid(),
      longitude: item?.longitude || '',
      latitude: item?.latitude || '',
      altitude: item?.GPSAltitude || '',
      name: item.light_name,
      size: item.size[1].light_size || '0 MB',
      create_time: item.create_time,
      width: item?.ExifImageWidth || 0,
      height: item?.ExifImageHeight || 0,
      brief: '',
      path: item.createLightPath,
      cameraType: item.cameraType[1].light_cameraType,
      title: '',
      errorTitle: '图片范围不匹配'
    }

    newErrorList.push(infraredInfo, lightInfo)
  })
  return newErrorList
}

export function guid() {
  return Number(Math.random().toString().substr(3, 5) + Date.now()).toString(36)
}
//航线内的航点匹配相同
export function getSameServicePointsList(a: string | any[], b: string | any[]) {
  for (var i = 0, len = a.length; i < len; i++) {
    for (var j = 0, len2 = b.length; j < len2; j++) {
      if (!a[i].ids || !b[j].ids) return
      if (+a[i].latitude === +b[j].latitude && +a[i].longitude === +b[j].longitude) {
        b[j].service_create_time = a[i].create_time
        len2 = b.length
      }
    }
  }
  return b
}

//图片航点相同
export function getSamePointsList(a: string | any[], b: any[]) {
  for (var i = 0, len = a.length; i < len; i++) {
    for (var j = 0, len2 = b.length; j < len2; j++) {
      if (!a[i].ids || !b[j].ids) return
      if (a[i].ids === b[j].ids) {
        b.splice(j, 1)
        len2 = b.length
      }
    }
  }
  return b
}

//范围匹配
function inGroupRange(p1: [number, number, number], p2: [number, number, number]): boolean {
  const dist = getDistance(p1, p2)
  if (dist <= 5) {
    return true
  } else {
    return false
  }
}

export function getDistance(addressA: [number, number, number], addressB: [number, number, number]): number {
  const point1 = Cartesian3.fromDegrees(...addressA)
  const point2 = Cartesian3.fromDegrees(...addressB)
  const distance = Cartesian3.distance(point1, point2)
  return distance
}
