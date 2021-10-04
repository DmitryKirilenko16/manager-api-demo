export const deleteObjectsFields = <Entity = any>(objects: Entity[], fieldsToDelete: (keyof Entity)[] = []) => {
    objects.forEach(item => {
        for(const key in item) {
            if(item.hasOwnProperty(key) && fieldsToDelete.includes(key as (keyof Entity))) {
                delete item[key]
            }
        }
    })
}
