import {
    Column,
    Entity,
    Index, JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { UserEntity } from '../users/users.entity'
import { ETimeSheetItemStatus } from './time-sheets.constants'

@Index('timeSheets_pk', ['id'], { unique: true })
@Entity('timeSheets')
export class TimeSheetItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  date: Date;

  @Column('int')
  hours: number;

  @Column('text')
  taskDescription: string;

  @Column('int', { nullable: true })
  user_id: number;

  @Column('int', { nullable: true })
  status: ETimeSheetItemStatus;

  @ManyToOne(() => UserEntity, user => user.timeSheetItems)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
