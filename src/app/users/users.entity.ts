import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { EEmployeeStatus, ERole } from './users.constants'
import { TimeSheetItemEntity } from '../time-sheets/time-sheets.entity'

@Index('users_email_uindex', ['email'], { unique: true })
@Index('users_pk', ['id'], { unique: true })
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  firstName: string;

  @Column({ length: 30 })
  lastName: string;

  @Column({ length: 30 })
  email: string;

  @Column({ length: 15, nullable: true })
  phoneNumber: string;

  @Column({ type: 'int' })
  role: ERole;

  @Column('text')
  picture: string;

  @Column({ length: 30, nullable: true })
  position: string;

  @Column({ length: 30, nullable: true })
  techStack: string;

  @Column({ type: 'int', nullable: true })
  ratePerHour: number;

  @Column({ type: 'int', nullable: true })
  ratePerMonth: number;

  @Column({ type: 'int', nullable: true })
  employeeStatus: EEmployeeStatus;

  @OneToMany(() => TimeSheetItemEntity, timeSheet => timeSheet.user)
  timeSheetItems: TimeSheetItemEntity[];
}
