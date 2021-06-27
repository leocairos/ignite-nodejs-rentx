import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidV4 } from 'uuid';

import auth from '@config/auth';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
class SendForgotPasswordMailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
    @inject('EtherealMailProvider')
    private mailProvider: IMailProvider,
  ) {}
  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('User does not exists!');

    const token = uuidV4();

    await this.usersTokensRepository.create({
      user_id: user.id,
      refresh_token: token,
      expires_date: this.dateProvider.addHours(
        auth.expires_token_forgot_password_hours,
      ),
    });

    const templatePath = resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'forgotPassword.hbs',
    );

    const variables = {
      name: user.name,
      link: `${process.env.RESET_PASSWORD_URL}${token}`,
    };

    await this.mailProvider.sendMail(
      email,
      'Recuperação de Senha',
      variables,
      templatePath,
    );
  }
}

export { SendForgotPasswordMailUseCase };
