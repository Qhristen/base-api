import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../Entities/user.entity';


export default setSeederFactory(User, (faker) => {

    const user = new User();
    user.full_name = faker.name.fullName();
    user.email = faker.internet.email()
    user.password = "123456789"
    user.verified = true
    return user;
})