import { observer, useObserver } from 'mobx-react-lite'
import React from 'react'
import { changePointsType } from './datachange'
import { apiUrlStore } from './store/apiUrl/apiUrlStore'

export const Inpussst = observer(() => {
  const { aaasss, setBai } = apiUrlStore
  //进度

  async function matchStatusChange(index: any) {
    console.log('进度', index)
    await setBai(index)
  }

  //结果
  // function getRepetitionPoints(repetitionPoints: any) {}
  // function aaa() {
  //   // getPointMatching(wayPointGroups, servicePoints, groupPoints, matchStatusChange, [], 1, 2, getRepetitionPoints)
  // }

  const loadFile = (e: any) => {
    const rawFiles: File[] = e.target.files
    const infos = Reflect.ownKeys(rawFiles).map((item, index) => rawFiles[index])
    changePointsType(infos).then(res => {
      console.log(res)
    })
  }
  return useObserver(() => (
    <div className="image-sort-edit-progress">
      <input type="file" accept="image/*" id="image-upload-hidden" onChange={loadFile} multiple placeholder="上传" />
      <p id="all">{aaasss}</p>
    </div>
  ))
})
