import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosResponse } from 'axios';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { Planter } from 'src/schemas/planter.schema';
import { Snapshot } from 'src/schemas/snapshot.schema';
import * as sharp from 'sharp'
import { Cron, CronExpression } from '@nestjs/schedule';
import { ControlService } from 'src/planters/control.service';
import { Topics } from 'src/events/topics';
import { ClientKafka } from '@nestjs/microservices';
import { GoogleStorageService } from 'src/storage/google-stoage.service';
import { GCS_IMAGE_BUCKET } from 'src/storage/gcp-storage.provider';
import { ImageCreatedEvent } from 'src/events/image-created.event';
import { ImageCalculatedEvent } from 'src/events/image-calculated.event';

@Injectable()
export class SnapshotsService implements OnApplicationShutdown, OnModuleInit {
  constructor(
    @InjectModel(Snapshot.name)
    private snapshotModel: Model<Snapshot>,
    @InjectModel(Planter.name)
    private planterModel: Model<Planter>,
    @Inject('IMAGE_CREATED_EMITTER') private client: ClientKafka,
    private httpService: HttpService,
    private controlService: ControlService,
    @Inject(GCS_IMAGE_BUCKET)
    private storageService: GoogleStorageService,
  ) {
  }
  async onModuleInit() {
    await this.client.connect();
  }
  async onApplicationShutdown() {
    await this.client.close();
  }
  private readonly logger = new Logger(SnapshotsService.name);
  private failedPlanterList = [];

  async findAll(): Promise<Snapshot[]> {
    return this.snapshotModel.find().exec();
  }



  @Cron('0 5 * * * *')
  async createSnapshotsPeriodically() {
    this.logger.debug('Call create Snapshot every 1 hours');
    const plantersIncludeCam = (await this.planterModel.find({})).filter(
      (planter) => planter.cameras.length > 0,
    );

    if (!plantersIncludeCam) return this.logger.debug('????????? ?????? ????????? DB?????? ???????????? ????????????');

    await Promise.allSettled(plantersIncludeCam.map((planter) => this.controlService.turnOn(planter.id, false)));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await Promise.allSettled(plantersIncludeCam.map((planter) => this.createSnapshot(planter)));
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await Promise.allSettled(plantersIncludeCam.map((planter) => this.controlService.turnOff(planter.id, true)));
    console.log('reach to end');
    this.handleFailedPlanter(0);
    return 200;
  }

  async handleFailedPlanter(cnt: number) {
    cnt = cnt + 1;
    if (this.failedPlanterList.length === 0) return;
    console.log(this.failedPlanterList.map((planter: Planter) => planter.planterId).join(','));
    this.logger.debug(`remaining failed planter ${this.failedPlanterList.map((planter: Planter) => planter.planterId).join(',')}`);
    await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 5));
    await Promise.allSettled(this.failedPlanterList.map((planter) => this.controlService.turnOn(planter.id, false)));
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await Promise.allSettled(this.failedPlanterList.map((planter) => this.createSnapshot(planter)));
    await new Promise((resolve) => setTimeout(resolve, 4000));
    await Promise.allSettled(this.failedPlanterList.map((planter) => this.controlService.turnOff(planter.id, true)));
    this.logger.debug(`remaining failed planter ${this.failedPlanterList.map((planter: Planter) => planter.planterId).join(',')}`);
    if (cnt < 2) {
      return this.handleFailedPlanter(cnt);
    } else {
      this.logger.debug(`end with remaining failed planter ${this.failedPlanterList.map((planter: Planter) => planter.planterId).join(',')}`);
      this.failedPlanterList = [];
    }
  }

  async createSnapshot(planter: Planter) {
    let res: AxiosResponse;
    try {
      res = await lastValueFrom(
        this.httpService.get(planter.getUrl(['current'])),
      );

      if (res.status != 200) {
        this.logger.debug(`This connection of planter failed: ${planter.planterId}`);
        if (this.failedPlanterList.filter(failedPlanter => failedPlanter.planterId === planter.planterId).length === 0) {
          this.failedPlanterList.push(planter);
        }
        return;
      }
    } catch (error) {
      if (this.failedPlanterList.filter(failedPlanter => failedPlanter.planterId === planter.planterId).length === 0) {
        this.failedPlanterList.push(planter);
      }
      return this.logger.debug(planter.planterId + error);
    }
    for (const cam of planter.cameras) {
      try {
        const snapshot = new this.snapshotModel();
        Object.assign(snapshot, res.data);
        snapshot.planterId = planter.planterId;
        const current = new Date();
        current.setHours(current.getHours() + 9);
        snapshot.createdAt = current;
        const imageName = `${cam.cameraId}_${current.getTime()}.jpeg`;
        snapshot.cameraId = cam.cameraId;
        if (cam.plantId) snapshot.plantId = cam.plantId;
        if (cam.transferredAt) snapshot.transferredAt = cam.transferredAt;

        const response: AxiosResponse = await this.httpService.axiosRef({
          url: `http://${cam.publicIP}:${cam.webPort}/capture`,
          method: 'GET',
          responseType: 'arraybuffer',
          timeout: 1500,
        });

        const buffer = Buffer.from(response.data, "utf-8");
        const resized = await sharp(buffer).extract({
          left: 100,
          top: 0,
          width: 600,
          height: 600,
        }).resize().toBuffer();
        const imageUrl = await this.storageService.upload(process.env.GCS_BUCKET_PATH, {
          name: imageName,
          buffer: resized
        });
        snapshot.imageUrl = imageUrl;
        await snapshot.save();
        this.client.emit(Topics.ImageCreated, new ImageCreatedEvent(imageUrl, snapshot.id));
        // This is code for remove failed planter if  success
        this.failedPlanterList = this.failedPlanterList.filter(failedPlanter => failedPlanter.planterId !== planter.planterId);
      } catch (error) {
        if (this.failedPlanterList.filter(failedPlanter => failedPlanter.planterId === planter.planterId).length === 0) {
          this.failedPlanterList.push(planter);
        }
        this.logger.debug(cam.cameraId + error);
      }
    }
  }
  async updateSnapshotWhenCalculated(imageCalculatedEvent: ImageCalculatedEvent) {
    if (imageCalculatedEvent.pixel === -1) {

      const snapshot = await this.snapshotModel.findByIdAndDelete(imageCalculatedEvent.snapshotId);
      return this.logger.debug(`Snapshot Deleted! for ${snapshot.cameraId}`);
    }
    const snapshot = await this.snapshotModel.findByIdAndUpdate(imageCalculatedEvent.snapshotId, {
      numOfPixel: imageCalculatedEvent.pixel
    });
    this.logger.debug(`Num of pixel is ${imageCalculatedEvent.pixel} for ${snapshot.cameraId}`);

  }
}