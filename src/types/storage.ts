export interface IFile {
    fileName: string;
    fileData: ArrayBuffer;
}

export interface IStorageService {
    upload(file: IFile): Promise<void>;
    delete(fileName: string): void;
    getObjectUrl(fileName: string): string;
}
