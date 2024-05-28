import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WebinarDto } from './dto/webinar.dto';
import { RegisterWebinarDto } from './dto/registerWebinar.dto';

@Injectable()
export class WebinarsService {
  constructor(private readonly httpService: HttpService) {}

  async getWebinar(webinarCode: string): Promise<WebinarDto> {
    const webinarDto: WebinarDto = {
      title: '',
      upcomingTimes: [''],
      timeZoneId: '',
    };

    try {
      const url = `webinars/${webinarCode}/registration-information`;
      const result = this.httpService.get(url);
      const { data } = await firstValueFrom(result);
      webinarDto.title = data.title;
      webinarDto.upcomingTimes = data.upcoming_times;
      webinarDto.timeZoneId = data.timezone_id;
    } catch (error) {
      console.error(error);
    }

    return webinarDto;
  }

  async registerWebinar(
    webinarCode: string,
    registerWebinar: RegisterWebinarDto,
  ): Promise<string> {
    // https://docs.stealthseminarapp.com/#register-for-a-webinar

    let returnValue = '';

    try {
      const url = `webinars/${webinarCode}/registration`;
      const result = this.httpService.post(url, registerWebinar);
      const { data } = await firstValueFrom(result);
      returnValue = `Successfully Registered for ${data.display_start_time}`;
    } catch (err) {
      if (err instanceof Error) {
        // @ts-ignore
        throw new HttpException(err.response.data, err.response.status);
      }
    }
    returnValue = 'Could not register.  Please try another time';

    return returnValue;
  }
}
