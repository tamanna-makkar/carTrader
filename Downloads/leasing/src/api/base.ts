import axios, { AxiosInstance, AxiosResponse } from 'axios'

// eslint-disable-next-line
declare module 'axios' { interface AxiosResponse<T = any> extends Promise<T> { } }

export abstract class BaseApi {
  protected readonly instance: AxiosInstance

  public constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    })
  }

  protected _handleResponse = ( config: AxiosResponse ) => {
    if(config.request.responseURL.split('/').includes('download-document') && config.headers['content-type']==='application/json'){
      return null
    } else {
       return config.data
    }
  }
}