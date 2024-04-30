import { Request, Response } from "express";
import { User } from "../../Entities/user.entity";
import { AppDataSource } from "../../Utils/data-source";
import { signJwt } from "../../Utils/jwt";

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (input: Partial<User>) => {
  return await userRepository.save(userRepository.create(input));
};

export const updateVerificationCode = async (
  id: any,
  verificationCode: string
) => {
  return await userRepository.update({ id }, { verificationCode });
};

export const updatePassword = async (input: Partial<User>) => {
  return await userRepository.update(
    { id: input.id },
    { password: input.password, verificationCode: input.verificationCode }
  );
};

export const findUserByEmail = async ({ email }: { email: string }) => {
  return await userRepository.findOneBy({ email });
};

export const findUserBy = async ({
  verificationCode,
}: {
  verificationCode: string;
}) => {
  return await userRepository.findBy({ verificationCode });
};

export const findOneByEmail = async ({ email }: { email: string }) => {
  return await userRepository.findOne({ where: { email } });
};

export const findUserById = async (userId: string) => {
  return await userRepository.findOneBy({ id: userId });
};
export const findOneUser = async (id: string) => {
  return await userRepository.findOne({ where: {id}});
};

export const findUser = async (query: Object) => {
  return await userRepository.findOneBy(query);
};
export const signTokens = async (user: User, res: Response, req: Request) => {

  // Create Session
  req.session.user = user;

  // Create Access and Refresh tokens
  const access_token: any = signJwt(
    { sub: user.id },
    String(process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY),
    {
      expiresIn: `60m`,
    }
  );

  const refresh_token = signJwt(
    { sub: user.id },
    String(process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY),
    {
      expiresIn: `60m`,
    }
  );

  return { access_token, refresh_token };
};
