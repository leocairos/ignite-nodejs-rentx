import { Specification } from '../model/Specification';

export interface ICreateSpecificationDTO {
  name: string;
  description: string;
}

interface ISpecificationsRepository {
  create({ name, description }: ICreateSpecificationDTO): void;

  list(): Specification[];

  findByName(name: string): Specification;
}

export { ISpecificationsRepository };
