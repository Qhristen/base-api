import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1717187778978 implements MigrationInterface {
    name = 'Mydatasource1717187778978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "multiTap"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "multiTap" integer NOT NULL DEFAULT '1'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "multiTap"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "multiTap" text
        `);
    }

}
