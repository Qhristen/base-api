import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716388957862 implements MigrationInterface {
    name = 'Mydatasource1716388957862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."Tasks_type_enum" AS ENUM('SPECIAL', 'OTHER_SPECIAL', 'LEAGUE', 'REF')
        `);
        await queryRunner.query(`
            CREATE TABLE "Tasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "points" integer NOT NULL DEFAULT '0',
                "link" character varying,
                "type" "public"."Tasks_type_enum" NOT NULL,
                CONSTRAINT "PK_f38c2a61ff630a16afca4dac442" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "Tasks"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."Tasks_type_enum"
        `);
    }

}
