// scheduler.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { MailingService } from 'src/mailing/mailing.service';
import { Payment } from 'src/payments/schema/payment.schema';
import { Profile } from 'src/profiles/schema/profile.schema';
import { RabbitMQService } from 'src/rabbitmq/rabbitmq.service';
import {
  Subscription,
  SubscriptionDocument,
} from 'src/subscriptions/schema/subscription.schema';
import { Tariff } from 'src/tariffs/schema/tariff.schema';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class SchedulerService {
  private readonly subscriptionsQueue = 'subscriptionsQueue';

  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    private mailingService: MailingService,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    @InjectModel(Tariff.name) private tariffModel: Model<Tariff>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Cron('0 0 0 * * *', {
    timeZone: 'UTC',
  }) // 0 0 0 * * * - в 00:00:00 каждый день для прода
  async handleSubscriptionTasks() {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const subscriptions = await this.subscriptionModel.find({
      debitDate: {
        $gte: startOfToday,
        $lte: endOfToday,
      },
    });

    subscriptions.length
      ? console.log('subscriptions имеет длину')
      : console.log('Сегодня мы не получим бабла');

    for await (const sub of subscriptions) {
      await this.rabbitMQService.publish(this.subscriptionsQueue, sub);
    }
  }

  // Задача для модуля рассылок
  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleMailingTasks() {
    const activePosts = await this.mailingService.findAllActive(); // Доработать, сделать выборку по дате
    activePosts.forEach(async (post) => {
      const dateNow = new Date(Date.now());
      const postDate = post.schedule.date || dateNow;

      if (post.schedule.isNow || postDate <= dateNow) {
        console.log('Отправляем пост');
        const isOk = true; // Тут нужно отправить пост на другой бэк

        if (isOk && !post.schedule.isRepeat) {
          post.isActive = false;
          await post.save();
        }
      }
    });
  }

  // Задача для архивных
  @Cron(CronExpression.EVERY_HOUR)
  handleTasks() {
    // Логика обработки архивных тарифов
  }
}
