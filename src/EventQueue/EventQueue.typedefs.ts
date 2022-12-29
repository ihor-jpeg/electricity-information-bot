export type EventCallback = () => Promise<void>;

export enum EventStatus {
  Queued = 'queued',
  Delivered = 'delivered',
}

export interface QueueEvent {
  callback: EventCallback;
  status: EventStatus;
}
