import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1717146835809 implements MigrationInterface {
    name = 'Mydatasource1717146835809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "special_league" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "point" integer NOT NULL DEFAULT '0',
                "activities" jsonb,
                CONSTRAINT "PK_cadc458b7095270f1323278c6ff" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "ref_tasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "point" integer NOT NULL DEFAULT '0',
                "totalInvite" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_83009c78c79e63ad5006e2b1538" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "league_league" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "point" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_d2233ce4e3266ca928203c4a37f" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "league_league"
        `);
        await queryRunner.query(`
            DROP TABLE "ref_tasks"
        `);
        await queryRunner.query(`
            DROP TABLE "special_league"
        `);
    }

}
