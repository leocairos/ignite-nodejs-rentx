import { CarsRespositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

let createCarUseCase: CreateCarUseCase;
let carsRespositoryInMemory: CarsRespositoryInMemory;

describe('Create Car', () => {
  beforeEach(() => {
    carsRespositoryInMemory = new CarsRespositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRespositoryInMemory);
  });

  it('should be able to create a new car', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name car',
      description: 'Description car',
      daily_rate: 100,
      license_plate: 'AAAAA',
      fine_amount: 60,
      brand: 'brand car',
      category_id: '1232141',
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be able to create a car with exists license plate', async () => {
    expect(async () => {
      await createCarUseCase.execute({
        name: 'Name car1',
        description: 'Description car',
        daily_rate: 100,
        license_plate: 'AAAAA',
        fine_amount: 60,
        brand: 'brand car',
        category_id: '1232141',
      });
      await createCarUseCase.execute({
        name: 'Name car2',
        description: 'Description car',
        daily_rate: 100,
        license_plate: 'AAAAA',
        fine_amount: 60,
        brand: 'brand car',
        category_id: '1232141',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a car with available true by default', async () => {
    const car = await createCarUseCase.execute({
      name: 'Name car available',
      description: 'Description car',
      daily_rate: 100,
      license_plate: 'AAAAA-BBB',
      fine_amount: 60,
      brand: 'brand car',
      category_id: '1232141',
    });
    expect(car.available).toBe(true);
  });
});
