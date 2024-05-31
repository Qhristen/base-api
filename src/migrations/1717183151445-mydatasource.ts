import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1717183151445 implements MigrationInterface {
    name = 'Mydatasource1717183151445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_tasks"
            ADD "name" character varying NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_tasks" DROP COLUMN "name"
        `);
    }

}
