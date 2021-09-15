import './App.css'
import { getMatchingList } from './methods'
function App() {
  const cli = () => {
    const request = indexedDB.open('myDatabase', 2)
    request.addEventListener('success', e => {
      console.log('连接数据库成功')
    })

    request.addEventListener('error', e => {
      console.log(e)
      console.log('连接数据库失败')
    })

    request.addEventListener('upgradeneeded', e => {
      const db = e.target.result
      const store = db.createObjectStore('Users', {
        keyPath: 'userId',
        autoIncrement: false
      })
      console.log('创建对象仓库成功')
    })

    request.addEventListener('success', e => {
      const db = e.target.result
      const tx = db.transaction('Users', 'readwrite')
    })

    request.addEventListener('success', e => {
      const db = e.target.result
      const tx = db.transaction('Users', 'readwrite')
      const store = tx.objectStore('Users')
      const reqAdd = store.add({
        userId: 1,
        userName: '李白',
        age: 24
      })
      reqAdd.addEventListener('success', e => {
        console.log('保存成功')
      })
    })
    request.addEventListener('success', e => {
      const db = e.target.result
      const tx = db.transaction('Users', 'readwrite')
      const store = tx.objectStore('Users')
      const reqGet = store.get(1)
      reqGet.addEventListener('success', e => {
        console.log(e.srcElement.result)
        //这边用原文中的this会发现undefined
      })
    })

    request.addEventListener('success', e => {
      const db = e.target.result
      const tx = db.transaction('Users', 'readwrite')
      const store = tx.objectStore('Users')
      const reqGet = store.get(1)
      reqGet.addEventListener('success', e => {
        console.log(db)
      })
    })
  }
  const loadFile = e => {
    const rawFiles = e.target.files

    async function handleFileInfo(files) {
      const infos = Reflect.ownKeys(files).map((item, index) => files[index])
      let changeList = await getMatchingList(infos)
      console.log(changeList)
      return changeList
    }

    handleFileInfo(rawFiles)
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }
  return (
    <div className="App">
      <h1 onClick={cli}>点我</h1>
      {/* <Inpussst></Inpussst> */}
      {/* 上传文件
      <Inpussst></Inpussst>
    */}
      {/* <input type="file" accept="image/*" placeholder="上传你选择的图片" id="image-upload-hidden" onChange={loadFile} multiple /> */}
    </div>
  )
}

export default App
