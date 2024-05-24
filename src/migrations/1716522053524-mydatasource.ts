import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716522053524 implements MigrationInterface {
    name = 'Mydatasource1716522053524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Users"
            ADD "friendsReferred" integer NOT NULL DEFAULT '0'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Users" DROP COLUMN "friendsReferred"
        `);
    }

}
