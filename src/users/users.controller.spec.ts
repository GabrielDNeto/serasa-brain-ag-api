import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: Partial<UsersService>;

  beforeEach(() => {
    usersService = {
      users: jest.fn().mockResolvedValue([{ id: 1, name: 'Alice' }]),
    };
    usersController = new UsersController(usersService as UsersService);
  });

  describe('getUsers', () => {
    it('should call usersService.users with empty object', async () => {
      await usersController.getUsers();
      expect(usersService.users).toHaveBeenCalledWith({});
    });

    it('should return users from usersService', async () => {
      const result = await usersController.getUsers();
      expect(result).toEqual([{ id: 1, name: 'Alice' }]);
    });
  });
});
