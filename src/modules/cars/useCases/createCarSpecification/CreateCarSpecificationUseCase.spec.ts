import { CarsRespositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';
import { SpecificationsRepositoryInMemory } from '@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory';
import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationUseCase } from './CreateCarSpecificationUseCase';

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRespositoryInMemory: CarsRespositoryInMemory;
let specificationsRepositoryInMemory: SpecificationsRepositoryInMemory;

describe('Create Car Specification', () => {
  beforeEach(() => {
    carsRespositoryInMemory = new CarsRespositoryInMemory();
    specificationsRepositoryInMemory = new SpecificationsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRespositoryInMemory,
      specificationsRepositoryInMemory,
    );
  });

  it('should not be able to add a new specification to an non-existent car', async () => {
    await expect(async () => {
      const car_id = 'idCar';
      const specifications_id = ['oneSpecification'];
      await createCarSpecificationUseCase.execute({
        car_id,
        specifications_id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to add a new specification on the car', async () => {
    const car = await carsRespositoryInMemory.create({
      name: 'Name car available',
      description: 'Description car',
      daily_rate: 100,
      license_plate: 'AAAAA-BBB',
      fine_amount: 60,
      brand: 'brand car',
      category_id: '1232141',
    });

    const specification = await specificationsRepositoryInMemory.create({
      name: 'Specification Name',
      description: 'Specification description',
    });

    const specifications_id = [specification.id];

    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_id,
    });

    expect(specificationsCars).toHaveProperty('specifications');
    expect(specificationsCars.specifications.length).toBe(1);
  });
});
