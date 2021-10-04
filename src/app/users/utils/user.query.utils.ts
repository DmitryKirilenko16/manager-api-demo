import { UserEntity } from '../users.entity'

export class UserQueryUtils {
    static get coWorkerAccessibleUserFields(): (keyof UserEntity)[] {
        return [
            'id',
            'firstName',
            'lastName',
            'email',
            'picture',
            'role',
            'position',
            'techStack',
            'phoneNumber',
            'employeeStatus'
        ]
    }
}
