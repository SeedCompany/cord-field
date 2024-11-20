import { ApolloClient } from '@apollo/client';
import {
  API,
  InlineTool,
  InlineToolConstructorOptions,
} from '@editorjs/editorjs';

export class MentionsTool implements InlineTool {
  private readonly api: API;
  private readonly apollo: ApolloClient<unknown>;

  private button: HTMLButtonElement | null;
  // apparently this has to be here for checkState to work???
  private readonly state: boolean;

  static get isInline() {
    return true;
  }

  static get sanitize() {
    return {
      span: { class: true },
    };
  }

  constructor({ api, config }: InlineToolConstructorOptions) {
    console.log('MentionsInlineTool initialized');
    this.api = api;
    this.state = false;
    this.button = null;
    this.apollo = config.apollo;

    this.addInputListener();
  }

  render() {
    console.log('MentionsInlineTool render called');
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.textContent = '@'; // The button's label
    this.button.classList.add(this.api.styles.inlineToolButton);

    return this.button;
  }

  surround(range: Range) {
    console.log('MentionsInlineTool surround called with range:', range);
  }

  checkState(selection: Selection) {
    console.log(
      'MentionsInlineTool checkState called with selection:',
      selection
    );
    return false;
  }

  private addInputListener() {
    console.log('Adding input listener');
    document.addEventListener('input', this.handleInput);
  }

  private readonly handleInput = (event: Event) => {
    const selection = window.getSelection();
    const anchorNode = selection?.anchorNode;

    if (anchorNode?.nodeType === Node.TEXT_NODE) {
      const typedText = anchorNode.textContent;
      console.log('User is typing:', typedText);

      if (typedText?.startsWith('@')) {
        console.log('User started typing a mention');
      }
    }
  };
}
