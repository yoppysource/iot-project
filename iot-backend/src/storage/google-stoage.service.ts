import { Bucket } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class GoogleStorageService {
    constructor(private readonly bucket: Bucket, private readonly baseUrl: string) { }

    async upload(
        directory: string,
        image: {
            name: string;
            buffer: Buffer;
        },
        metadata?: object,
    ): Promise<string> {
        const filePath = path.join(directory, image.name);
        const file = this.bucket.file(filePath);

        const options = metadata ? { metadata } : undefined;

        await file.save(image.buffer, options);
        const uri = new URL(this.baseUrl);

        uri.pathname = path.join(this.bucket.name, directory, image.name);

        return uri.toString();
    }
}