import {
  QueueEvent,
  EventCallback,
  EventStatus,
} from './EventQueue.typedefs';

export class EventQueue {
  private eventQueue: QueueEvent[] = [];
  private readonly interval: NodeJS.Timer;
  private readonly retryTimeout = 60000;

  constructor() {
    this.interval = setInterval(async () => {
      await this.processQueue();
    }, this.retryTimeout);
  }

  private async processQueue() {
    if (!this.eventQueue.length) {
      return;
    }

    for await (const event of this.eventQueue) {
      try {
        await event.callback();

        event.status = EventStatus.Delivered;
      } catch (error) {
      // log error
      }
    }

    this.filterOutCompleted();
  }

  async add(callback: EventCallback) {
    if (this.eventQueue.length) {
      this.eventQueue.push({
        callback,
        status: EventStatus.Queued,
    });

      return;
    }

    try {
      await callback();
    } catch (error) {
      console.log('send message', error);
      
      this.eventQueue.push({
        callback,
        status: EventStatus.Queued,
    });
    }
  }

  private filterOutCompleted() {
    this.eventQueue = this.eventQueue.filter(({ status }) => status !== EventStatus.Delivered);
  }

  clearQueue() {
    this.eventQueue = [];
  }
}
