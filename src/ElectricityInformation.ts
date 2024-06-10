import axios from 'axios';

interface ApiResponse {
  reason: string;
  street_name: string;
  plan_begin: string;
  plan_end: string;
  house: {
    name: string;
  };
}

export interface ElectricityInfo {
  start?: string;
  end?: string;
}

export class ElectricityInformation {
  private apiUrl: string;

  readonly schedule = [
    // Sunday
    [2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0, 1, 1, 1],
    // Monday
    [2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0, 1, 1, 1],
    // Tuesday
    [1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0],
    // Wednesday
    [1, 1, 1, 1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 2, 2],
    // Thursday
    [2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0, 1, 1, 1],
    // Friday
    [1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0],
    // Saturday
    [1, 1, 1, 1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0, 1, 1, 1, 1, 2, 2],
  ];

  constructor() {
    this.apiUrl = String(process.env.ELECTRICITY_DATA_URL);
  }

  async isPlanned() {
    const {
      start,
      end,
    } = await this.getInfo();

    if (!start || !end) {
      return false;
    }

    const currentTime = new Date().getTime();
    const startAt = new Date(start).getTime();
    const endAt = new Date(end).getTime();

    return currentTime >= startAt
      && currentTime <= endAt;
  }

  async getInfo(): Promise<ElectricityInfo> {
    try {
      const response = await axios.get(this.apiUrl);

      const {
        plan_begin,
        plan_end,
      } = response.data;

      if (!plan_begin || !plan_end) {
        return {};
      }

      const startDate = new Date(plan_begin);
      const startHour = startDate.getHours().toString().padStart(2, '0');
      const startMinute = startDate.getMinutes().toString().padStart(2, '0');

      const endDate = new Date(plan_end);
      const endHour = endDate.getHours().toString().padStart(2, '0');
      const endMinute = endDate.getMinutes().toString().padStart(2, '0');
      
      return {
        start: `${startHour}:${startMinute}`,
        end: `${endHour}:${endMinute}`,
      };
    } catch (error) {
      console.log('Error occured while getting electricity data', error);

      return {};
    }
  }
}
