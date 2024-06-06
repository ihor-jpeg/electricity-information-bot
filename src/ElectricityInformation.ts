import fetch from 'node-fetch';

const requestUrl = String(process.env.ELECTRICITY_DATA_URL);

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
  private readonly apiUrl: string = requestUrl;

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

  async isPlanned() {
    const {
      start,
      end,
    } = await this.getInfo();

    if (!start && !end) {
      return false;
    }

    const currentTime = new Date().getTime();
    const startAt = new Date(start).getTime();
    const endAt = new Date(end).getTime();

    return currentTime >= startAt
      && currentTime <= endAt;
  }

  async getInfo(): Promise<ElectricityInfo> {
    const response = await fetch(yasnoRequestUrl);

    return this.parseResponse(response.body);
  }

  private parseResponse(response: ApiResponse): ElectricityInfo {
    if (!response.plan_begin || !response.plan_end) {
      return {};
    }

    return {
      start: response.plan_begin,
      end: response.plan_end,
    };
  }

  private getCurrentBlackout () {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = now.getHours();

    const status = this.schedule[day][hour]; // 0 - has electricity, 1 - no electricity, 2 - possibly no electricity

    if (status === 1 || status === 2) {
        return this.findBlackoutStart(day, hour);
    }

    return null;
  };

  private findBlackoutStart(
    day: number,
    hour: number,
  ) {
    // Find the start of the blackout period
    let blackoutDay = day;
    let blackoutStart = hour;

    // Iterate backward to find the start of the blackout period
    while (blackoutDay >= 0) {
        while (blackoutStart >= 0) {
            if (this.schedule[blackoutDay][blackoutStart] !== 1 && this.schedule[blackoutDay][blackoutStart] !== 2) {
                blackoutStart++;
                break;
            }
            blackoutStart--;
        }
        if (blackoutStart < 0) {
            blackoutDay--;
            blackoutStart = 23;
        } else {
            break;
        }
    }

    if (blackoutDay < 0) {
        blackoutDay = 6;
        blackoutStart = 0;
    }

    // Convert blackoutDay and blackoutStart to formatted strings
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const startTime = `${daysOfWeek[blackoutDay]} ${blackoutStart.toString().padStart(2, '0')}:00`;

    return {
        start: startTime
    };

    return new Date()
      .setDay()
      .setHour()
  }
}

/*
  turn off:
    Планове/не планове
    початок
    кінець
    можливо не буде до ___

  turn on:
    натупне планове відключення
    початок
    кінець
    можливо не буде до ___
*/
