import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716899221778 implements MigrationInterface {
    name = 'Mydatasource1716899221778'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "boosts"
            ADD "point" integer NOT NULL DEFAULT '0'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "boosts" DROP COLUMN "point"
        `);
    }

}
