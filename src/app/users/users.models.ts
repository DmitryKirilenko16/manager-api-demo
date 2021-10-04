import { UserEntity } from './users.entity'

export interface IGoogleUser {
  firstName: string
  lastName: string
  email: string
  picture: string
  accessToken?: string
}

export interface IUserProjectShortInfo {
  projectName: string,
  ratePerHour: number
}

export interface IProfile extends UserEntity {
  projects: IUserProjectShortInfo[]
}
