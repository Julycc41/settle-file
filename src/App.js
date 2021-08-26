import { Checkbox } from 'antd'
import React, { useState } from 'react'
import './App.css'
import { shiftLIst } from './methods'

function App() {
  const [preIdx, setPreIdx] = useState(0)
  const [current, setCurrent] = useState([])
  function ulclick(type, event) {
    const idx = shiftLIst.findIndex(item => item.type === type)
    if (event.shiftKey) {
      let max = Math.max(preIdx, idx)
      let min = Math.min(preIdx, idx)
      const list = shiftLIst.map((item, index) => (index >= min && index <= max ? item.type : false)).filter(item => item)
      setCurrent(list)
    } else {
      setPreIdx(idx)
      setCurrent([shiftLIst[idx].type])
    }
  }

  return (
    <div className="App">
      {/* 上传文件
      <input type="file" accept="image/*" placeholder="上传你选择的图片" id="image-upload-hidden" onChange={loadFile} multiple /> */}
      <div id="container">
        <div className="left">
          {shiftLIst.map((item, index) => {
            return (
              <p onClick={e => ulclick(item.type, e)}>
                <Checkbox data-index={index} checked={current.includes(item.type)} value={item.name}>
                  {item.name}
                </Checkbox>
              </p>
            )
          })}
        </div>
        <div className="right"></div>
      </div>
    </div>
  )
}

export default App
