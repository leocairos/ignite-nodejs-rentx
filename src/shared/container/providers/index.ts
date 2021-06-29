import { container } from 'tsyringe';

import '@shared/container/providers/MailProvider';
import '@shared/container/providers/StorageProvider';

import { IDateProvider } from './DateProvider/IDateProvider';
import { DayjsDateProvider } from './DateProvider/implementations/DayjsDateProvider';

container.registerSingleton<IDateProvider>('DateProvider', DayjsDateProvider);
