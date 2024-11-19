import { API } from '@editorjs/editorjs';

class MentionsTool {
  private readonly api: API;
  private element: HTMLDivElement | null;
  constructor({ api }: { api: API }) {
    this.api = api;
    this.element = null;
  }

  render() {
    this.element = document.createElement('div');
    this.element.textContent = "I'm a lil div";
    this.element.classList.add(this.api.styles.inlineToolButton);
    console.log('divvvvvv');
    return this.element;
  }
}

export default MentionsTool;
