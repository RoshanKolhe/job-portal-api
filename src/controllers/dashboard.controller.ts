// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {get} from '@loopback/rest';
import {BlogsRepository, PlanRepository, UserRepository} from '../repositories';

// import {inject} from '@loopback/core';


export class DashboardController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(BlogsRepository)
    public blogsRepository: BlogsRepository,
    @repository(PlanRepository)
    public planRepository: PlanRepository,
  ) { }

  @get('/analytics/cards')
  async fetchAnalyticsCards(): Promise<{
    usersCount: number;
    blogsCount: number;
    productsCount: number;
    servicesCount: number;
  }> {
    try {
      const userFilter: any = {
        permissions: {like: `%["customer"]%`}
      };
      const usersCount = await this.userRepository.count(userFilter);
      const blogsCount = await this.blogsRepository.count();
      const productsCount = await this.planRepository.count({planGroup: 0});
      const servicesCount = await this.planRepository.count({planGroup: 1});

      return {
        usersCount: usersCount.count,
        blogsCount: blogsCount.count,
        productsCount: productsCount.count,
        servicesCount: servicesCount.count
      }
    } catch (error) {
      throw error;
    }
  }

}


