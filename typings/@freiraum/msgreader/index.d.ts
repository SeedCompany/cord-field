declare module '@freiraum/msgreader' {
  // eslint-disable-next-line import/no-default-export
  export default class MsgReader {
    constructor(buffer: ArrayBuffer);
    getFileData(): OutlookMsgData | ErrorObj;
    getAttachment(attach: number): {
      fileName: string;
      content: any;
    };
  }

  export interface ErrorObj {
    error: string;
  }
  export interface OutlookMsgData {
    attachment: Attachment[];
    recipients: Recipient[];
    senderName: string; // email
    body: string;
    headers?: string;
    subject: string;
    [prop: string]: any;
  }
  export interface Recipient {
    name?: string;
    email: string;
  }
  export interface Attachment {
    dataId: number;
    contentLength: number;
    fileName: string;
    fileNameShort: string;
  }
  export interface AttachmentContent {
    fileName: string;
    content: ArrayBuffer;
  }
}
