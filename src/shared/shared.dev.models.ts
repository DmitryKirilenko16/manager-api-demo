export interface IRoutes {
  [key: string]: {
    path: string,
    subRouting?: IRoutes
  }
}