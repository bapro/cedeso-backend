import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  HasOne,
  BelongsTo,
} from "sequelize-typescript";
import Profile from "./Profile";
import Capture from "./Capture";
import { User } from "./User";
@Table({
  tableName: "incidents",
  timestamps: true,
})
class Incident extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reporterType!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  otherReporterType?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone?: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: Date;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  time!: string;

  @Column({
    type: DataType.STRING(2),
    allowNull: false,
  })
  ampm!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  province!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  municipio!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  community!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  females!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  males!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  totalAffected!: number;

  // Remove userName column and add userId instead
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @HasOne(() => Profile)
  profile!: Profile;

  @HasOne(() => Capture)
  capture!: Capture;
}

export default Incident;
