import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716531241445 implements MigrationInterface {
    name = 'Mydatasource1716531241445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Users" DROP COLUMN "totalPoints"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Users"
            ADD "totalPoints" integer NOT NULL DEFAULT '0'
        `);
    }

}
