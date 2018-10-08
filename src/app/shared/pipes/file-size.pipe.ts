import { Pipe, PipeTransform } from '@angular/core';

const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

@Pipe({
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {
  transform(bytes: number, args?: any): string {
    if (bytes === 0) {
      return `${bytes} ${sizes[0]}`;
    }
    const sizeIndex = Number(Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${Math.round(bytes / Math.pow(1024, sizeIndex))} ${sizes[sizeIndex]}`;
  }
}
