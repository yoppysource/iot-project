import { PlantersModule } from './../planters/planters.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SnapshotsService } from './snapshots.service';
import { SnapshotsController } from './snapshots.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Planter, PlanterSchema } from 'src/schemas/planter.schema';
import { Snapshot, SnapshotSchema } from 'src/schemas/snapshot.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { GCStorageProvider } from 'src/storage/gcp-storage.provider';

@Module({
  imports: [
    HttpModule,
    ClientsModule.registerAsync([{
      name: "IMAGE_CREATED_EMITTER",
      useFactory: (configService: ConfigService) => {
        return {
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: [configService.get('KAFKA_BROKER')],
              ssl: true,
              sasl: {
                mechanism: 'plain',
                username: configService.get('KAFKA_API_KEY'),
                password: configService.get('KAFKA_API_SECRET'),
              },
            },
            consumers: {
              groupId: "nestjs-group-client"
            }
          }
        }
      },
      inject: [ConfigService]
    }]),

    MongooseModule.forFeature([
      {
        name: Planter.name,
        schema: PlanterSchema,
      },
      {
        name: Snapshot.name,
        schema: SnapshotSchema,
      },
    ]),
    PlantersModule,
  ],
  providers: [SnapshotsService, GCStorageProvider
  ],
  controllers: [SnapshotsController],
})
export class SnapshotsModule { }
