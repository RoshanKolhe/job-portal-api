import { CronJob, cronJob } from '@loopback/cron';
import { repository } from '@loopback/repository';
import { PlanRepository, SubscriptionRepository, UserRepository } from '../repositories';
import { generateUniqueId } from '../utils/constants';

@cronJob()
export class CheckDailyEntriesAtNoon extends CronJob {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(SubscriptionRepository)
    public subscriptionRepoitory: SubscriptionRepository,
    @repository(PlanRepository)
    public planRepository: PlanRepository,
  ) {
    super({
      cronTime: '0 12 * * *',
      onTick: async () => {
        await this.runJob();
      },
      start: true,
    });
  }

  async runJob() {
    try {
      const currentDate = new Date();

      const subscriptions = await this.subscriptionRepoitory.find({
        where: {
          or: [
            { expiryDate: { lte: currentDate } },
            { expiryDate: { eq: currentDate } },
          ],
        },
      });

      if (subscriptions.length > 0) {
        const plan = await this.planRepository.findOne({ where: { isFreePlan: true } });

        if (plan) {
          // ✅ Use for...of loop for awaiting inside loop
          for (const item of subscriptions) {
            await this.userRepository.updateById(item.userId, { activeSubscriptionId: undefined });
          }
        }
      }
    } catch (error) {
      console.log('Error while running cron', error);
    }
  }
}

// @cronJob()
// export class CheckDailyEntriesAtEvening extends CronJob {
//   constructor(
//     @repository(UserRepository)
//     public userRepository: UserRepository,
//   ) {
//     super({
//       cronTime: '0 18 * * *', // At 6 PM daily
//       onTick: async () => {
//         await this.runJob();
//       },
//       start: true,
//     });
//   }

//   async runJob() {
//     console.log('Cron job at 6 PM is running at', new Date());
//   }
// }
