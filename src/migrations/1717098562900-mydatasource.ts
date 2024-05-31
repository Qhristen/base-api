import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1717098562900 implements MigrationInterface {
    name = 'Mydatasource1717098562900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "limit"
            SET DEFAULT '500'
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "max"
            SET DEFAULT '500'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "max"
            SET DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "limit"
            SET DEFAULT '0'
        `);
    }

}
