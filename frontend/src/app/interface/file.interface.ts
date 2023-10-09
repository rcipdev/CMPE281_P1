export interface File {
  id: number;
  name: string;
  fileData: FileData;
  createdAt: string;
  desc: string;
  fileType: string;
  updatedAt: string;
  user: User;
}

export interface FileData {
  data: ArrayBuffer;
  type: string;
  blob?: any;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
}
