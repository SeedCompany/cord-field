import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// iOS Safari & IE don't
export const SUPPORTS_DOWNLOADS = (() => {
  if (typeof document === 'undefined') {
    return false;
  }

  const anchor = document.createElement('a');
  return 'download' in anchor;
})();

@Injectable({
  providedIn: 'root'
})
export class DownloaderService {

  constructor(private http: HttpClient) {
  }

  async downloadUrl(url: string, fileName: string): Promise<void> {
    if (!SUPPORTS_DOWNLOADS) {
      return;
    }

    const blob = await this.http.get(url, { responseType: 'blob' }).toPromise();
    await this.downloadBlob(blob, fileName);
  }

  async downloadBlob(blob: Blob, fileName: string): Promise<void> {
    if (!SUPPORTS_DOWNLOADS) {
      return;
    }

    const url = window.URL.createObjectURL(blob);
    await this.save(url, fileName);
    await this.sleep(251);
    window.URL.revokeObjectURL(url);
  }

  private async save(url: string, fileName: string): Promise<void> {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.setAttribute('download', fileName);
    anchor.style.display = 'none';
    this.listenOnce(anchor, 'click', e => e.stopPropagation());
    document.body.appendChild(anchor);
    await this.sleep(66);
    anchor.click();
    document.body.removeChild(anchor);
  }

  private sleep(timeout: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  private listenOnce(el: HTMLElement, type: string, listener: EventListener): void {
    const outerListener = (e: Event) => {
      listener(e);
      el.removeEventListener(type, outerListener);
    };
    el.addEventListener(type, outerListener);
  }
}
