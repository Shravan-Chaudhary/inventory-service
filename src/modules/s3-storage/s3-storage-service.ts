import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import Config from "../../config";
import { IFile, IStorageService } from "../../types/storage";
import { CreateHttpError } from "../../common/http";

export class S3StorageService implements IStorageService {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: Config.S3_REGION,
            credentials: {
                accessKeyId: Config.S3_ACCESS_KEY!,
                secretAccessKey: Config.S3_SECRET_ACCESS_KEY!
            }
        });
    }

    public async upload(file: IFile): Promise<void> {
        const objectParams = {
            Bucket: Config.S3_BUCKET_NAME,
            Key: file.fileName,
            Body: file.fileData
        };

        try {
            //TODO: Add proper types
            // @ts-ignore
            await this.client.send(new PutObjectCommand(objectParams));
        } catch (error) {
            if (error instanceof Error) {
                const err = CreateHttpError.InternalServerError(error.message);
                throw err;
            }
        }
    }
    public delete(_fileName: string): void {
        throw new Error("Method not implemented.");
    }
    public getObjectUrl(_fileName: string): string {
        throw new Error("Method not implemented.");
    }
}
