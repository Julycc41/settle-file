import './App.css'
import { getMatchingList } from './methods'

function App() {
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
      上传文件
      <input type="file" accept="image/*" placeholder="上传你选择的图片" id="image-upload-hidden" onChange={loadFile} multiple />
    </div>
  )
}

export default App
