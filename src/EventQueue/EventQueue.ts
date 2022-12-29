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

    try {
      for await (const event of this.eventQueue) {
        await event.callback();

        event.status = EventStatus.Delivered;
      }
    } catch {
      // log error
    } finally {
      this.filterCompleted();
    }
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
    } catch {
      this.eventQueue.push({
        callback,
        status: EventStatus.Queued,
    });
    }
  }

  private filterCompleted() {
    this.eventQueue = this.eventQueue.filter(({ status }) => status !== EventStatus.Delivered);
  }

  clearQueue() {
    this.eventQueue = [];
  }
}
