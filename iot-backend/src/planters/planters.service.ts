import { UpdateCameraDTO } from './dto/update-camera.dto';
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosResponse } from 'axios';
import { FilterQuery, Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InitializeCameraDTO } from './dto/initialize-camera.dto';
import { InitializePlanterDTO } from './dto/initialize-planter.dto';
import { Planter, PlanterDocument } from '../schemas/planter.schema';
import { Farm, FarmDocument } from '../schemas/farm.schema';

@Injectable()
export class PlantersService {
  constructor(
    @InjectModel(Planter.name)
    private planterModel: Model<PlanterDocument>,
    private httpService: HttpService,
    @InjectModel(Farm.name)
    private farmModel: Model<FarmDocument>,
  ) { }

  async findAll(): Promise<Planter[]> {
    return this.planterModel.find().exec();
  }

  async findOne(id: string): Promise<Planter> {
    return this.planterModel.findOne({ id }).exec();
  }

  async findAllByFarm(farmId: string) {
    return this.planterModel
      .find({
        farm: farmId,
      } as FilterQuery<PlanterDocument>)
      .exec();
  }

  async createOrUpdate(data: InitializePlanterDTO): Promise<Planter> {
    const planter = await this.planterModel.findOne({
      planterId: data.planterId,
    });

    const farm = await this.farmModel.findById(data.farm);

    if (!farm) throw new NotFoundException('farm is not found');
    if (!planter) {
      const newPlanter = new this.planterModel(data);
      newPlanter.setting = farm.defaultSetting;
      return newPlanter.save();
    }

    Object.assign(planter, data);
    return planter.save();
  }

  async createOrUpdateCamera(
    planterId: string,
    cameraId: string,
    data: InitializeCameraDTO,
  ): Promise<Planter> {
    const planter = await this.planterModel.findOne({ planterId });

    // if there is no such id in database
    if (!planter) {
      throw new NotFoundException('planter not found');
    }
    console.log(planter.cameras);
    let existedCamera = planter.cameras.find(
      (cam) => cam.cameraId === cameraId,
    );

    existedCamera
      ? Object.assign(existedCamera, data)
      : planter.cameras.push(data);

    return planter.save();
  }

  async updateCamera(
    planterId: string,
    cameraId: string,
    data: UpdateCameraDTO,
  ) {
    const planter = await this.planterModel.findOne({ planterId });

    // if there is no such id in database
    if (!planter) {
      throw new NotFoundException('planter not found');
    }

    const camera = planter.cameras.find((cam) => cam.cameraId === cameraId);
    if (!camera) throw new NotFoundException('cam not found');

    Object.assign(camera, data);
    console.log(camera);
    return planter.save();
  }

  async getCurrentStatus(id: string) {
    const planter = await this.planterModel.findById(id);

    // if there is no such id in database
    if (!planter) {
      throw new NotFoundException('planter not found');
    }
    try {
      const res: AxiosResponse = await lastValueFrom(
        this.httpService.get(planter.getUrl(['current'])),
        // http://{PUBILC_IP}:{PORT}
        // Http 1.1 get /current
      );
      if (res.status != 200) {
        throw new NotFoundException('cannot link to arduino');
      }
      // body:
      const data = res.data;
      let streamingUrlList = [];
      planter.cameras.forEach((cam) =>
        streamingUrlList.push({
          floor: cam.floor,
          url: `http://${cam.publicIP}:${cam.streamingPort}`,
        }),
      );
      data.streamingUrlList = streamingUrlList;
      return data;
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException('요청시간 만료!');
    }
  }

  async updateSetting(id: string, body: UpdateSettingDto): Promise<Planter> {
    const planter = await this.planterModel.findById(id);

    if (!planter) {
      throw new NotFoundException('planter not found');
    }
    try {
      const res: AxiosResponse = await lastValueFrom(
        this.httpService.post(
          planter.getUrl(['setting']),
          JSON.stringify(body),
        ),
      );

      if (res.status != 200) {
        throw new NotFoundException('cannot link to arduino');
      }
      Object.assign(planter.setting, res.data);
      return await planter.save();
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException('요청시간 만료!');
    }
  }
}
