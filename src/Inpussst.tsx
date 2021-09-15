import { observer, useObserver } from 'mobx-react-lite'
import React from 'react'
import { groupPoints, servicePoints, wayPointGroups } from './data'
import { getPointMatching } from './datachange'
import { apiUrlStore } from './store/apiUrl/apiUrlStore'

export const Inpussst = observer(() => {
  const { aaasss, setBai } = apiUrlStore
  //进度

  async function matchStatusChange(index: any) {
    console.log('进度', index)
    await setBai(index)
    // if (index % 2 === 0) {
    //   setTimeout(() => {
    //     setSuccessMatchStatus(index);
    //     if (index === 100) {
    //       message.success({
    //         content: "匹配成功",
    //         key: currentTask.id,
    //       });
    //       setMatchLoading(false);
    //       changeSetImageSelectType("pointMatching");
    //     }
    //   });
    // }
  }

  //结果
  function getRepetitionPoints(repetitionPoints: any) {}
  function aaa() {
    getPointMatching(wayPointGroups, servicePoints, groupPoints, matchStatusChange, [], 1, 2, getRepetitionPoints)
  }

  return useObserver(() => (
    <div className="image-sort-edit-progress" onClick={aaa}>
      <p onClick={aaa}>处理进度</p>

      <p id="all">{aaasss}</p>
    </div>
  ))
})
