export interface IEnumerableArrayItem {
  name: string,
  value: number
}

export const enumToArray = (Enum: any): IEnumerableArrayItem[] => Object.entries(Enum).filter(e => !isNaN(e[0] as any)).map(e => ({
    name: e[1] as string,
    value: +e[0],
}))
