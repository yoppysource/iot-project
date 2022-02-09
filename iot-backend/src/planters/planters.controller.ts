import { InitializeCameraDTO } from './dto/initialize-camera.dto';
import { Body, Controller, Get, Logger, Param, Patch, Post } from '@nestjs/common';
import { InitializePlanterDTO } from './dto/initialize-planter.dto';
import { PlantersService } from './planters.service';
import { ControlService } from './control.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { UpdateCameraDTO } from './dto/update-camera.dto';

@Controller('planters')
export class PlantersController {
  constructor(
    private plantersService: PlantersService,
    private controlService: ControlService,
  ) { }

  private readonly logger = new Logger(PlantersService.name);

  @Get('/farm/:id')
  findPlantersInFarms(@Param('id') id: string) {
    return this.plantersService.findAllByFarm(id);
  }

  @Get('/:id')
  findPlanter(@Param('id') id: string) {
    return this.plantersService.findOne(id);
  }

  @Get()
  findPlanters() {
    return this.plantersService.findAll();
  }

  //initalize planter
  @Post()
  initializePlanter(@Body() body: InitializePlanterDTO) {
    this.logger.debug('Planter is initialted with data' + body);

    return this.plantersService.createOrUpdate(body);
  }

  @Post('/:planterId/cameras/:cameraId')
  initializeCamera(
    @Param('planterId') planterId: string,
    @Param('cameraId') cameraId: string,
    @Body() body: InitializeCameraDTO,
  ) {
    this.logger.debug('Camera is initialted: ' + cameraId);

    return this.plantersService.createOrUpdateCamera(planterId, cameraId, body);
  }

  @Patch('/:planterId/cameras/:cameraId')
  updateCamera(
    @Param('planterId') planterId: string,
    @Param('cameraId') cameraId: string,
    @Body() body: UpdateCameraDTO,
  ) {
    console.log(body);
    return this.plantersService.updateCamera(planterId, cameraId, body);
  }

  //create Planters id
  @Get('/:id/current')
  sendCurrentStatus(@Param('id') id: string) {
    return this.plantersService.getCurrentStatus(id);
  }

  /*
    This is function for remote control, it only should be excuted based on object id for security reason
   */
  @Patch('/:id/setting')
  updatePlanterSetting(
    @Param('id') id: string,
    @Body() body: UpdateSettingDto,
  ) {
    return this.plantersService.updateSetting(id, body);
  }

  @Get('/:id/turnOn')
  async turnOn(@Param('id') id: string) {
    return this.controlService.turnOn(id, false);
  }

  @Get('/:id/turnOff')
  async turnOff(@Param('id') id: string) {
    return this.controlService.turnOff(id, false);
  }
}
