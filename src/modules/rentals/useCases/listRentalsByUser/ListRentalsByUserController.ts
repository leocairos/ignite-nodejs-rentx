import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListRentalsByUserUserCase } from './ListRentalsByUserUserCase';

class ListRentalsByUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const listRentalsByUserUserCase = container.resolve(
      ListRentalsByUserUserCase,
    );

    const rentalsByUser = await listRentalsByUserUserCase.execute(user_id);
    return response.status(200).json(rentalsByUser);
  }
}

export { ListRentalsByUserController };
