import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716520684317 implements MigrationInterface {
    name = 'Mydatasource1716520684317'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Users" DROP COLUMN "referredBy"
        `);
        await queryRunner.query(`
            ALTER TABLE "Users"
            ADD "referredBy" text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Users" DROP COLUMN "referredBy"
        `);
        await queryRunner.query(`
            ALTER TABLE "Users"
            ADD "referredBy" character varying
        `);
    }

}
