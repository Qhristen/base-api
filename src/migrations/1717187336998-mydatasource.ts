import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1717187336998 implements MigrationInterface {
    name = 'Mydatasource1717187336998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "fullEnergy"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "fullEnergy" text
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "multiTap"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "multiTap" text
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "tapGuru"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "tapGuru" text
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "tapGuru"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "tapGuru" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "multiTap"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "multiTap" integer NOT NULL DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "fullEnergy"
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "fullEnergy" boolean NOT NULL DEFAULT false
        `);
    }

}
