import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailService', () => {
  let mailService: MailService;

  const mockMailerService = {
    sendMail: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
  });

  beforeEach(async () => {
    for (let method in mockMailerService) {
      mockMailerService[method].mockReset();
    }
  });

  it('Should be defined', () => {
    expect(mailService).toBeDefined();
  });

  describe('When send email', () => {
    it('Should call sendMail', async () => {
      mockMailerService.sendMail.mockResolvedValue(undefined);

      await mailService.sendMail({
        to: 'example@example.com',
        subject: 'Test',
        template: 'test',
        context: {},
      });

      expect(mockMailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(mockMailerService.sendMail).not.toThrowError();
    });
  });
});
