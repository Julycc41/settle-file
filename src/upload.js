let fs = require('fs')
export const singleUpload = path => {
  const taskPhotoPath = 'C:/Users/caper/Desktop/jq/m2ea/'

  let files = fs.readdirSync(path)
  console.log(files)
  // // let path = file.path //文件本地路径
  // let stats = fs.statSync(path) //读取文件信息
  // let chunkSize = 3 * 1024 * 1024 //每片分块的大小3M
  // let size = stats.size //文件大小
  // let pieces = Math.ceil(size / chunkSize) //总共的分片数
  // let index = 0
  // function uploadPiece(i) {
  //   //计算每块的结束位置
  //   let enddata = Math.min(size, (i + 1) * chunkSize)
  //   let arr = []
  //   //创建一个readStream对象，根据文件起始位置和结束位置读取固定的分片
  //   let readStream = fs.createReadStream(path, { start: i * chunkSize, end: enddata - 1 })
  //   //on data读取数据
  //   readStream.on('data', data => {
  //     arr.push(data)
  //   })
  //   //on end在该分片读取完成时触发
  //   readStream.on('end', () => {
  //     //这里服务端只接受blob对象，需要把原始的数据流转成blob对象，这块为了配合后端才转
  //     let blob = new Blob(arr)
  //     //新建formdata数据对象
  //     var formdata = new FormData()
  //     // let md5Val = md5(Buffer.concat(arr))
  //     formdata.append('file', blob)
  //     console.log('blob.size', blob.size)
  //     // formdata.append('md5', md5Val)
  //     formdata.append('size', size) // 数字30被转换成字符串"30"
  //     formdata.append('chunk', i) //第几个分片，从0开始
  //     formdata.append('chunks', pieces) //分片数
  //     formdata.append('name', '111') //文件名
  //     console.log(formdata)
  //   })
  //   index++
  // }
  // uploadPiece(index)
}

// export function singleUpload(file) {
//   let files = fs.readdirSync(taskPhotoPath);

//   let fileSize = file.size
//   let bytesPerPiece = 1 * 1024 * 1024 // 每个文件切片大小定为1MB
//   const totalPieces = Math.ceil(fileSize / bytesPerPiece)
//   let start = 0,
//     end,
//     index = 1
//   let upload = () => {
//     if (start < fileSize) {
//       end = start + bytesPerPiece
//       if (end > fileSize) {
//         end = fileSize
//       }
//       let chunk = file.slice(start, end) //切割文件
//       let formData = new FormData()
//       formData.append('raw_data', chunk)
//       formData.append('chunk', index)
//       formData.append('total', totalPieces)
//       console.warn(`上传第${index}块,范围[${start / (1024 * 1024)},${end / (1024 * 1024)}]`)
//       upload()
//     } else {
//     }
//   }
//   upload()
// }