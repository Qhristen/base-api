import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716386138344 implements MigrationInterface {
    name = 'Mydatasource1716386138344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."Users_league_enum" AS ENUM(
                'NOVICE',
                'ROOKIE',
                'SENIOR',
                'ADVANCED',
                'EXPERT',
                'MASTER',
                'LEGEND'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "Users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "full_name" character varying NOT NULL,
                "telegramUserId" character varying NOT NULL,
                "telegramUserName" character varying NOT NULL,
                "referralLink" character varying NOT NULL,
                "referredBy" character varying NOT NULL,
                "points" integer NOT NULL,
                "totalPoints" integer NOT NULL,
                "lastInteraction" TIMESTAMP NOT NULL,
                "league" "public"."Users_league_enum" NOT NULL DEFAULT 'NOVICE',
                CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "Users"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."Users_league_enum"
        `);
    }

}
