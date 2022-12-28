type Callback = () => Promise<void>;

enum EventStatus {
  Queued = 'queued',
  Delivered = 'delivered',
}

interface Event {
  callback: Callback;
  status: EventStatus;
}

export class EventQueue {
  private eventQueue: Event[] = [];
  private readonly interval: NodeJS.Timer;
  private readonly retryTimeout = 15000;

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
      console.log(`Event was not published. Retrying in ${this.retryTimeout / 1000} seconds`);
    } finally {
      this.filterCompleted();
    }
  }

  async add(callback: Callback) {
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
      console.log(`Event was not published. Adding the event to the queue...`);

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

  kill() {
    clearInterval(this.interval);
    this.clearQueue();
  }
}
