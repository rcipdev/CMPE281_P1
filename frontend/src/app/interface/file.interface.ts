export interface File {
  id: number;
  name: string;
  fileData: FileData;
}

export interface FileData {
  data: ArrayBuffer;
  type: string;
  blob?: any;
}
