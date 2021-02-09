/**
 * Adopted from https://github.com/eligrey/FileSaver.js
 * Dropped support for IE
 */
import { noop } from 'ts-essentials';

interface FileSaveOptions {
  skipCorsCheck?: boolean;
}

export const download = (
  url: string,
  name?: string,
  options?: FileSaveOptions
) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.onload = () => {
    saveAs(xhr.response, name, options);
  };
  xhr.onerror = () => {
    console.error('could not download file');
  };
  xhr.send();
};

export const saveAs =
  // probably in some web worker
  typeof window !== 'object' || window !== globalThis
    ? noop
    : // Use download attribute first if possible (#193 Lumia mobile)
    'download' in HTMLAnchorElement.prototype
    ? saveAsAnchorDownload
    : saveAsWithFileReader;

function saveAsAnchorDownload(
  blob: File | Blob | string,
  name?: string,
  options?: FileSaveOptions
) {
  // Namespace is used to prevent conflict w/ Chrome Poper Blocker extension (Issue #561)
  const a = document.createElementNS(
    'http://www.w3.org/1999/xhtml',
    'a'
  ) as HTMLAnchorElement;
  const fileName = name || (blob as File).name || 'download';

  a.download = fileName;
  a.rel = 'noopener'; // tabnabbing

  // TODO: detect chrome extensions & packaged apps
  // a.target = '_blank'

  if (typeof blob === 'string') {
    // Support regular links
    a.href = blob;
    if (a.origin !== globalThis.location.origin) {
      if (options?.skipCorsCheck || corsEnabled(a.href)) {
        download(blob, fileName);
      } else {
        a.target = '_blank';
        click(a);
      }
    } else {
      click(a);
    }
  } else {
    // Support blobs
    a.href = URL.createObjectURL(blob);
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
    }, 4e4); // 40s
    setTimeout(() => {
      click(a);
    }, 0);
  }
}

// Fallback to using FileReader and a popup
function saveAsWithFileReader(blob: File | Blob | string, name?: string) {
  // Open a popup immediately do go around popup blocker
  // Mostly only available on user interaction and the fileReader is async so...
  let popup = globalThis.open('', '_blank');
  if (popup) {
    popup.document.title = popup.document.body.innerText = 'downloading...';
  }

  if (typeof blob === 'string') {
    return void download(blob, name);
  }

  const force = blob.type === 'application/octet-stream';
  const isSafari =
    /constructor/i.test(HTMLElement.toString()) || (globalThis as any).safari;
  const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);

  if ((isChromeIOS || (force && isSafari)) && typeof FileReader === 'object') {
    // Safari doesn't allow downloading of blob URLs
    const reader = new globalThis.FileReader();
    reader.onloadend = () => {
      let url = reader.result as string;
      url = isChromeIOS
        ? url
        : url.replace(/^data:[^;]*;/, 'data:attachment/file;');
      if (popup) {
        popup.location.href = url;
      } else {
        globalThis.location.href = url;
      }
      popup = null; // reverse-tabnabbing #460
    };
    reader.readAsDataURL(blob);
  } else {
    const url = URL.createObjectURL(blob);
    if (popup) {
      popup.location.href = url;
    } else {
      globalThis.location.href = url;
    }
    popup = null; // reverse-tabnabbing #460
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 4e4); // 40s
  }
}

function corsEnabled(url: string) {
  const xhr = new XMLHttpRequest();
  // use sync to avoid popup blocker
  xhr.open('HEAD', url, false);
  try {
    xhr.send();
  } catch (e) {
    // ignore
  }
  return xhr.status >= 200 && xhr.status <= 299;
}

// `a.click()` doesn't work for all browsers (#465)
function click(node: HTMLAnchorElement) {
  try {
    node.dispatchEvent(new MouseEvent('click'));
  } catch (e) {
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent(
      'click',
      true,
      true,
      window,
      0,
      0,
      0,
      80,
      20,
      false,
      false,
      false,
      false,
      0,
      null
    );
    node.dispatchEvent(evt);
  }
}
