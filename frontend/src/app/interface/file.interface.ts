export interface FileObject {
  id: number;
  name: string;
  fileData: FileData;
  createdAt: string;
  desc: string;
  fileType: string;
  updatedAt: string;
  cloudfronturl: string;
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
