import { CarsRespositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListCarsUseCase } from './ListCarsUseCase';

let listCarsUseCase: ListCarsUseCase;
let carsRepositoryInMemory: CarsRespositoryInMemory;

describe('List Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRespositoryInMemory();
    listCarsUseCase = new ListCarsUseCase(carsRepositoryInMemory);
  });

  it('should be able to list all available cars', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car1',
      description: 'Description car',
      daily_rate: 100,
      license_plate: 'ListCar1',
      fine_amount: 60,
      brand: 'brand car',
      category_id: '1232141',
    });
    const cars = await listCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by name', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car name',
      description: 'Description car',
      daily_rate: 100,
      license_plate: 'ListCarName',
      fine_amount: 60,
      brand: 'brand car',
      category_id: '1232141',
    });
    const cars = await listCarsUseCase.execute({ name: car.name });

    expect(cars).toEqual([car]);
  });
});
