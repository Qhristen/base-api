import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716611638655 implements MigrationInterface {
    name = 'Mydatasource1716611638655'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Tasks"
                RENAME COLUMN "links" TO "activities"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Tasks"
                RENAME COLUMN "activities" TO "links"
        `);
    }

}
