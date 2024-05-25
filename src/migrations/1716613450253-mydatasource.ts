import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716613450253 implements MigrationInterface {
    name = 'Mydatasource1716613450253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "User_boosts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "boostId" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "status" character varying NOT NULL,
                CONSTRAINT "PK_d2e312164c09ea627d199e56ad5" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "User_tasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "taskId" character varying NOT NULL,
                "userId" character varying NOT NULL,
                "status" character varying NOT NULL,
                CONSTRAINT "PK_25fbbc191ce807812d5f478e49d" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "Boosts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "limit" integer NOT NULL DEFAULT '0',
                "activities" text NOT NULL,
                "type" character varying NOT NULL,
                CONSTRAINT "PK_5249b666d09fad83e4e74011193" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "Boosts"
        `);
        await queryRunner.query(`
            DROP TABLE "User_tasks"
        `);
        await queryRunner.query(`
            DROP TABLE "User_boosts"
        `);
    }

}
