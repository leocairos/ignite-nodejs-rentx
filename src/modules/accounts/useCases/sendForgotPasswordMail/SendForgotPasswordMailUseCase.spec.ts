import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

describe('Send Forgot Mail', () => {
  let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
  let usersRepositoryInMemory: UsersRepositoryInMemory;
  let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
  let dateProvider: DayjsDateProvider;
  let mailProvider: MailProviderInMemory;

  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider,
    );
  });

  it('should be able to send a forgot password mail to user', async () => {
    const sendMail = spyOn(mailProvider, 'sendMail');

    await usersRepositoryInMemory.create({
      driver_license: '758964',
      email: 'mail-test@mail-test.com',
      name: 'Name in Test',
      password: 'pass1234',
    });

    await sendForgotPasswordMailUseCase.execute('mail-test@mail-test.com');
    expect(sendMail).toHaveBeenCalled();
  });

  it('should NOT be able to send an email if user does not exists', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('non-exists@mail.com'),
    ).rejects.toEqual(new AppError('User does not exists!'));
  });

  it('should be able to create an users tokens', async () => {
    const generateTokenMail = spyOn(usersTokensRepositoryInMemory, 'create');

    await usersRepositoryInMemory.create({
      driver_license: '758964',
      email: 'mail-test@generateTokenMail.com',
      name: 'Name in generateTokenMail',
      password: 'pass1234',
    });

    await sendForgotPasswordMailUseCase.execute(
      'mail-test@generateTokenMail.com',
    );
    expect(generateTokenMail).toHaveBeenCalled();
  });
});
