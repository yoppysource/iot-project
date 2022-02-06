import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Storage } from "@google-cloud/storage";
import { GoogleStorageService } from "./google-stoage.service";
export const GCS_IMAGE_BUCKET = 'GCS_IMAGE_BUCKET';


export const GCStorageProvider: Provider =
{
    provide: GCS_IMAGE_BUCKET,
    useFactory: (configService: ConfigService) => {
        const bucketName = process.env.GCS_BUCKET;
        const baseUrl = `https://storage.googleapis.com`;

        const bucket = new Storage({
            projectId: process.env.GCLOUD_PROJECT,
            credentials: {
                client_email: process.env.GCLOUD_CLIENT_EMAIL,
                private_key: process.env.GCLOUD_PRIVATE_KEY
            }
        }).bucket(bucketName);
        return new GoogleStorageService(bucket, baseUrl);
    },
    inject: [ConfigService],
};