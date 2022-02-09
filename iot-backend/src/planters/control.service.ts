import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { lastValueFrom, map } from 'rxjs';
import { Planter } from '../schemas/planter.schema';

// This service is responsible for controlling planter in cloud setting
@Injectable()
export class ControlService {
  constructor(
    private httpService: HttpService,
    @InjectModel(Planter.name)
    private planterModel: Model<Planter>,
  ) { }

  async turnOn(id: string, withSetting: boolean) {
    const planter = await this.planterModel.findById(id);
    if (!planter) throw new NotFoundException('존재하지 않는 Planter입니다.');
    if (withSetting) {
      const [onHour, onMin] = planter.setting.turnOn.split(':');
      const turnOnTimeToMin = parseInt(onHour) * 60 + parseInt(onMin);
      const [offHour, offMin] = planter.setting.turnOff.split(':');
      const turnOffTimeToMin = parseInt(offHour) * 60 + parseInt(offMin);
      const now = new Date();
      const nowHourToMin = now.getHours() * 60 + now.getMinutes();
      if (turnOnTimeToMin < turnOffTimeToMin) {
        if (turnOnTimeToMin < nowHourToMin && turnOffTimeToMin > nowHourToMin)
          return 200;
      } else {
        if (turnOnTimeToMin < nowHourToMin || turnOffTimeToMin > nowHourToMin)
          return 200;
      }
    }
    const res: AxiosResponse = await lastValueFrom(
      this.httpService.get(planter.getUrl(['turnOn'])),
    );
    return res.status;
  }

  // turn off 트리거 하기전에는 무족선
  async turnOff(id: string, withSetting: boolean) {
    const planter = await this.planterModel.findById(id);
    if (!planter) throw new NotFoundException('존재하지 않는 Planter입니다.');
    if (withSetting) {
      const [onHour, onMin] = planter.setting.turnOn.split(':');
      const [offHour, offMin] = planter.setting.turnOff.split(':');
      const now = new Date();

      const turnOnTimeToMin = parseInt(onHour) * 60 + parseInt(onMin);
      const turnOffTimeToMin = parseInt(offHour) * 60 + parseInt(offMin);
      const nowHourToMin = now.getHours() * 60 + now.getMinutes();
      //아침에 키고 저녁에 끈다면
      if (turnOnTimeToMin < turnOffTimeToMin) {
        // 켜져있는 시간대는 now가 아침보다 크고, 저녁보다 작아야한다.
        // 이경우 끄지 않는다.
        if (turnOnTimeToMin < nowHourToMin && turnOffTimeToMin > nowHourToMin) {
          return 200;
        }
        // 저녁에키고 아침에 끈다면
      } else {
        // 켜져 있는 시간대는 저녁보다 크거나, 아침보다 작아야한다.
        if (turnOnTimeToMin < nowHourToMin || turnOffTimeToMin > nowHourToMin) {
          return 200;
        }
      }
    }

    const res: AxiosResponse = await lastValueFrom(
      this.httpService.get(planter.getUrl(['turnOff'])),
    );
    return res.status;
  }
}
