import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1717011731176 implements MigrationInterface {
    name = 'Mydatasource1717011731176'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "touches" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "multiTap" integer NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "fullEnergy" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "tapGuru" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "tapGuru"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "fullEnergy"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "multiTap"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "touches"
        `);
    }

}
