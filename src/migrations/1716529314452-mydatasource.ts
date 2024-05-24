import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716529314452 implements MigrationInterface {
    name = 'Mydatasource1716529314452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Users"
            ADD "referalPoints" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "Users"
            ADD "socialPoints" integer NOT NULL DEFAULT '0'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Users" DROP COLUMN "socialPoints"
        `);
        await queryRunner.query(`
            ALTER TABLE "Users" DROP COLUMN "referalPoints"
        `);
    }

}
