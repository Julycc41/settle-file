import { action, makeObservable, observable } from 'mobx'
class ApiUrlStore {
  constructor() {
    // 使用 makeObservable mobx6.0 才会更新视图
    makeObservable(this)
  }
  @observable aaasss: number = 0

  @action setBai = (baseUrl: number) => {
    this.aaasss = baseUrl
    console.log('%baseUrl:已更新baseUrl对象::', 'color:blue', { baseUrl })
  }
}

export const apiUrlStore = new ApiUrlStore()
