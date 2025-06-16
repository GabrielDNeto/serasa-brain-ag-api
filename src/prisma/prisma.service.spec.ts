import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
    prismaService.$connect = jest.fn(); // mocka o método $connect
  });

  it('should call $connect on module init', async () => {
    await prismaService.onModuleInit();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(prismaService.$connect).toHaveBeenCalled();
  });
});
