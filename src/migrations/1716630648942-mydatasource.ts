import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716630648942 implements MigrationInterface {
    name = 'Mydatasource1716630648942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "User_tasks"
            ALTER COLUMN "status" DROP DEFAULT
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "User_tasks"
            ALTER COLUMN "status"
            SET DEFAULT 'pedning'
        `);
    }

}
