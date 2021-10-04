export function camelCase<Obj = any>(obj: Obj): any {
    const newObj = {}
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            newObj[prop.replace(/(_\w)/g, (k) => {
                return k[1].toUpperCase()
            })] = obj[prop]
        }
    }
    return newObj
}
