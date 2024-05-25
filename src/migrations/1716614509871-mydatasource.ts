import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716614509871 implements MigrationInterface {
    name = 'Mydatasource1716614509871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Boosts" DROP COLUMN "activities"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Boosts"
            ADD "activities" text NOT NULL
        `);
    }

}
