import { RoleEnumType, User } from "../Entities/user.entity";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import {faker} from '@faker-js/faker';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const repository = dataSource.getRepository(User);
    const adminCount = await repository.count({
      where: { role: RoleEnumType.ADMIN },
    });

    const userCount = await repository.count({
      where: { role: RoleEnumType.USER },
    });

    if (adminCount === 0) {
      await repository.save(
        repository.create({
          full_name: "Admin Raya",
          email: "admin@example.com",
          password: "123456789",
          role: RoleEnumType.ADMIN,
          verified: true,
        })
      );
    }

    if (userCount === 0) {
      await repository.save(
        repository.create({
          full_name: "User Barrow",
          email: "user@example.com",
          password: "123456789",
          role: RoleEnumType.USER,
          verified: true,
        })
      );
    }

    // ---------------------------------------------------

    const userFactory = await factoryManager.get(User);
    // save 1 factory generated entity, to the database
    await userFactory.save();

    // save 5 factory generated entities, to the database
    // await userFactory.saveMany(5);
  }
}

// (async () => {
//   const options: DataSourceOptions & SeederOptions = {
//     host: String(host),
//     port: Number(port),
//     username,
//     password,
//     database,
//     type: "postgres",
//     entities: [User, Question],
//     seeds: [UserSeeder],
//     factories: [UserFactory, QuestionFactory],
//   };

//   const dataSource = new DataSource(options);
//   await dataSource.initialize();

//   await runSeeders(dataSource);
// })();

// const userRepository = SeedDataSource.getRepository(User);
// SeedDataSource.initialize()
//   .then(async () => {
//     console.log("seeding datadbase......");

//     async () => {
//       const adminCount = await userRepository.count({
//         where: { role: RoleEnumType.ADMIN },
//       });
//       const userCount = await userRepository.count({
//         where: { role: RoleEnumType.USER },
//       });

//       try {
//         if (adminCount === 0) {
//           await userRepository.save(
//             userRepository.create({
//               full_name: "Admin Raya",
//               email: "admin@example.com",
//               password: "123456789",
//               role: RoleEnumType.ADMIN,
//               verified: true,

//             })
//           );
//         }

//         if (userCount === 0) {
//           await userRepository.save(
//             userRepository.create({
//               full_name: "Jane Fox",
//               email: "user@example.com",
//               password: "123456789",
//               role: RoleEnumType.USER,
//               verified: true,
//             })
//           );
//         }
//       } catch (error) {
//         console.log(error);
//         process.exit(1);
//       }
//     };
//   })
//   .catch((error: any) => console.log(error));
