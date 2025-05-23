import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import Config from "../../config";
import { IFile, IStorageService } from "../../types/storage";
import { CreateHttpError } from "../../common/http";

export class S3StorageService implements IStorageService {
    private readonly client: S3Client;

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
            return await this.client.send(new PutObjectCommand(objectParams));
        } catch (error) {
            if (error instanceof Error) {
                const err = CreateHttpError.InternalServerError(error.message);
                throw err;
            }
        }
    }
    public async delete(imageName: string): Promise<void> {
        const objectParams = {
            Bucket: Config.S3_BUCKET_NAME,
            Key: imageName
        };
        try {
            //TODO: Add proper types
            // @ts-ignore
            return await this.client.send(new DeleteObjectCommand(objectParams));
        } catch (error) {
            if (error instanceof Error) {
                const err = CreateHttpError.InternalServerError(error.message);
                throw err;
            }
        }
    }
    public getObjectUrl(imageName: string): string {
        const url = `https://${Config.S3_BUCKET_NAME}.s3.${Config.S3_REGION}.amazonaws.com/${imageName}`;
        return url;
    }
}
