import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716630585927 implements MigrationInterface {
    name = 'Mydatasource1716630585927'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "User_boosts" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."User_boosts_status_enum" AS ENUM('pedning', 'success')
        `);
        await queryRunner.query(`
            ALTER TABLE "User_boosts"
            ADD "status" "public"."User_boosts_status_enum" NOT NULL DEFAULT 'pedning'
        `);
        await queryRunner.query(`
            ALTER TABLE "User_tasks" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."User_tasks_status_enum" AS ENUM('pedning', 'success')
        `);
        await queryRunner.query(`
            ALTER TABLE "User_tasks"
            ADD "status" "public"."User_tasks_status_enum" NOT NULL DEFAULT 'pedning'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "User_tasks" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."User_tasks_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "User_tasks"
            ADD "status" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "User_boosts" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."User_boosts_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "User_boosts"
            ADD "status" character varying NOT NULL
        `);
    }

}
