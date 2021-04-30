import { CarsRespositoryInMemory } from '@modules/cars/repositories/in-memory/CarsRepositoryInMemory';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsRepositoryInMemory: CarsRespositoryInMemory;

describe('List Available Cars', () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRespositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsRepositoryInMemory,
    );
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
    const cars = await listAvailableCarsUseCase.execute({});

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
    const cars = await listAvailableCarsUseCase.execute({ name: car.name });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by brand', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car name3',
      description: 'Description car3',
      daily_rate: 100,
      license_plate: 'ListCarName3',
      fine_amount: 60,
      brand: 'brand car3',
      category_id: '1232141',
    });
    const cars = await listAvailableCarsUseCase.execute({ brand: car.brand });

    expect(cars).toEqual([car]);
  });

  it('should be able to list all available cars by category', async () => {
    const car = await carsRepositoryInMemory.create({
      name: 'Car name34',
      description: 'Description car34',
      daily_rate: 100,
      license_plate: 'ListCarName34',
      fine_amount: 60,
      brand: 'brand car34',
      category_id: '1232141xx',
    });
    const cars = await listAvailableCarsUseCase.execute({
      category_id: car.category_id,
    });

    expect(cars).toEqual([car]);
  });
});
