import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716386238965 implements MigrationInterface {
    name = 'Mydatasource1716386238965'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Users"
            ALTER COLUMN "referralLink" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "Users"
            ALTER COLUMN "referredBy" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "Users"
            ALTER COLUMN "points"
            SET DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "Users"
            ALTER COLUMN "totalPoints"
            SET DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "Users"
            ALTER COLUMN "lastInteraction" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "Users"
            ALTER COLUMN "lastInteraction"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "Users"
            ALTER COLUMN "totalPoints" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "Users"
            ALTER COLUMN "points" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "Users"
            ALTER COLUMN "referredBy"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "Users"
            ALTER COLUMN "referralLink"
            SET NOT NULL
        `);
    }

}
