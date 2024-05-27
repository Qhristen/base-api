import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716808476450 implements MigrationInterface {
    name = 'Mydatasource1716808476450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."user_boosts_status_enum" AS ENUM('pedning', 'success')
        `);
        await queryRunner.query(`
            CREATE TABLE "user_boosts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "boostId" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "status" "public"."user_boosts_status_enum" NOT NULL,
                CONSTRAINT "PK_48c37adbe2fad39102c3db1975e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_tasks_status_enum" AS ENUM('pedning', 'success')
        `);
        await queryRunner.query(`
            CREATE TABLE "user_tasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "taskId" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "status" "public"."user_tasks_status_enum" NOT NULL,
                CONSTRAINT "PK_dd5ebb5c408af74cba775bd2326" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."users_league_enum" AS ENUM(
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
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "full_name" character varying NOT NULL,
                "telegramUserId" character varying NOT NULL,
                "telegramUserName" character varying NOT NULL,
                "referralLink" character varying,
                "referredBy" text,
                "points" integer NOT NULL DEFAULT '0',
                "referalPoints" integer NOT NULL DEFAULT '0',
                "socialPoints" integer NOT NULL DEFAULT '0',
                "friendsReferred" integer NOT NULL DEFAULT '0',
                "lastInteraction" TIMESTAMP,
                "league" "public"."users_league_enum" NOT NULL DEFAULT 'NOVICE',
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "tasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "point" integer NOT NULL DEFAULT '0',
                "activities" text NOT NULL,
                "type" character varying NOT NULL,
                CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "boosts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "limit" integer NOT NULL DEFAULT '0',
                "type" character varying NOT NULL,
                CONSTRAINT "PK_225335d93bbce36b48152a26b48" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "boosts"
        `);
        await queryRunner.query(`
            DROP TABLE "tasks"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."users_league_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "user_tasks"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_tasks_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "user_boosts"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_boosts_status_enum"
        `);
    }

}
