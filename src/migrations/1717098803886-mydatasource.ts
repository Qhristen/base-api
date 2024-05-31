import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1717098803886 implements MigrationInterface {
    name = 'Mydatasource1717098803886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "multiTap"
            SET DEFAULT '1'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "multiTap"
            SET DEFAULT '0'
        `);
    }

}
