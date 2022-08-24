import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  database: 'taskmanagement',
  username: 'postgres',
  port: 5432,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};