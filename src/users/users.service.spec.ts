/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockUser: User = {
    id: 1,
    username: 'alice',
    password: 'securepassword',
    name: 'Alice',
    email: 'alice@example.com',
    // Add other required fields according to your User model
  } as User;

  const prismaServiceMock = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('users', () => {
    it('should call prisma.user.findMany with correct params', async () => {
      const params = {
        skip: 1,
        take: 2,
        where: { name: { equals: 'Alice' } } as Prisma.UserWhereInput,
      };
      (prisma.user.findMany as jest.Mock).mockResolvedValue([mockUser]);

      const result = await service.users(params);

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: 1,
        take: 2,
        cursor: undefined,
        where: { name: { equals: 'Alice' } },
        orderBy: undefined,
      });
      expect(result).toEqual([mockUser]);
    });

    it('should return empty array if no users found', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);
      const result = await service.users({});
      expect(result).toEqual([]);
    });
  });

  describe('user', () => {
    it('should call prisma.user.findUnique with correct params', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.user({ id: 1 });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.user({ id: 999 });

      expect(result).toBeNull();
    });
  });
});
