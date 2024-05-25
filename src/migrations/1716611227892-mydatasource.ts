import { MigrationInterface, QueryRunner } from "typeorm";

export class Mydatasource1716611227892 implements MigrationInterface {
    name = 'Mydatasource1716611227892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "Tasks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "point" integer NOT NULL DEFAULT '0',
                "links" text NOT NULL,
                "type" character varying NOT NULL,
                CONSTRAINT "PK_f38c2a61ff630a16afca4dac442" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "Tasks"
        `);
    }

}
