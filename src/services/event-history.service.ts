import { repository } from "@loopback/repository";
import { EventHistoryRepository } from "../repositories";

export class EventHistoryService{
    constructor(
        @repository(EventHistoryRepository)
        public eventHistoryRepository: EventHistoryRepository,
    ){}

    async addNewEvent(eventName: string, eventDescription: string, screenName: string, userId: number){
        try{
            const data = {
                eventName,
                eventDescription,
                screenName,
                userId
            };

            const eventHistory = await this.eventHistoryRepository.create(data);

            return eventHistory;
        }catch(error){
            console.log('Error while creating event', error);
        }
    }
}