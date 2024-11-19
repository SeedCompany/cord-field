import {
  API,
  BlockTool,
  BlockToolConstructable,
  BlockToolConstructorOptions,
  BlockToolData,
} from '@editorjs/editorjs';

export class MentionsTool implements BlockTool {
  private readonly api: API;
  private element: HTMLDivElement | null;
  constructor({ api }: BlockToolConstructorOptions) {
    this.api = api;
    this.element = null;
  }

  static get toolbox(): BlockToolConstructable['toolbox'] {
    return {
      title: 'Mentions',
    };
  }

  save(_block: HTMLElement): BlockToolData {
    return { foo: 'bar' };
  }

  render() {
    this.element = document.createElement('div');
    this.element.textContent = "I'm a lil div";
    this.element.classList.add(this.api.styles.inlineToolButton);
    console.log('divvvvvv');
    return this.element;
  }
}
