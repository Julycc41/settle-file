import React, { useState } from 'react'
import { groupPoints, servicePoints, wayPointGroups } from './data'
import { getPointMatching } from './datachange'

export const Inpussst = () => {
  const [pictures, setPictures] = useState<any>(0)

  //进度
  function matchStatusChange(index: any) {
    console.log('进度', index)
    setPictures(index)
  }
  //结果
  function getRepetitionPoints(repetitionPoints: any) {}
  function aaa() {
    getPointMatching(wayPointGroups, servicePoints, groupPoints, matchStatusChange, [], 1, 2, getRepetitionPoints)
  }

  return (
    <div className="image-sort-edit-progress" onClick={aaa}>
      <p onClick={aaa}>处理进度</p>

      <p>{pictures}进度</p>
    </div>
  )
}
