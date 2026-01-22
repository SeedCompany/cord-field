import { ApolloClient } from '@apollo/client';
import {
  API,
  InlineTool,
  InlineToolConstructorOptions,
} from '@editorjs/editorjs';
import { UserLookupDocument } from '../form/Lookup/User/UserLookup.graphql';

const applyStyle = (element: HTMLLIElement | HTMLUListElement, style: any) => {
  Object.assign(element.style, style);
};

export class MentionsTool implements InlineTool {
  private readonly api: API;
  private readonly apollo: ApolloClient<unknown>;

  private button: HTMLButtonElement | null;
  private container: HTMLDivElement | null;
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
    this.api = api;
    this.state = false;
    this.button = null;
    this.container = null;
    this.apollo = config.apollo;
    // leaving the below for now as we want to implement search on typing later
    // this.addInputListener();
  }

  render() {
    this.container = document.createElement('div');
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.textContent = '@'; // The button's label
    this.button.classList.add(this.api.styles.inlineToolButton);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    this.button.addEventListener('click', async () => {
      await this.replaceTextWithUser(this.container);
      return this.container;
    });
    this.container.style.position = 'relative';
    this.container.appendChild(this.button);
    return this.container;
  }

  surround(range: Range) {
    this.wrap(range);
  }

  wrap(range: Range) {
    const wrapper = document.createElement('span');
    wrapper.classList.add('user-tag');
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
    this.api.selection.expandToTag(wrapper);
  }

  checkState() {
    return false;
  }
  // Leaving this for now as we should later implement the search on typing vs the button click
  // private addInputListener() {
  //   console.log('Adding input listener');
  //   document.addEventListener('input', this.handleInput);
  // }

  private async replaceTextWithUser(container: HTMLDivElement | null) {
    const selection = window.getSelection();
    if (selection?.focusNode?.textContent) {
      const selectedText = selection.focusNode.textContent.slice(
        selection.anchorOffset,
        selection.focusOffset
      );
      // const beforeSearch = selection.focusNode.textContent.slice(
      //   0,
      //   selection.anchorOffset
      // );
      // const afterSearch = selection.focusNode.textContent.slice(
      //   selection.focusOffset
      // );
      // console.log('beforeAfterSearch', beforeSearch, afterSearch);
      const { data } = await this.apollo.query({
        query: UserLookupDocument,
        variables: {
          query: selectedText,
        },
      });
      if (data.search.items.length > 0) {
        const list = document.createElement('ul');
        const listStyle = {
          listStyleType: 'none',
          position: 'absolute',
          top: '0',
          left: '0',
          zIndex: '10',
          backgroundColor: '#fff',
          padding: '5px 5px 0px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          borderRadius: '4px',
        };
        Object.assign(list.style, listStyle);
        data.search.items.forEach((item: any, index) => {
          const user = document.createElement('li');
          const userStyle = {
            cursor: 'pointer',
            width: '100%',
            whiteSpace: 'nowrap',
            backgroundColor: '#fff',
            padding: '0px 5px 5px',
          };
          const userHoverChanges = {
            backgroundColor: '#eff2f5',
          };
          user.className = index.toString();
          user.id = item?.id;
          user.innerHTML = item?.fullName;
          Object.assign(user.style, userStyle);
          user.addEventListener('click', () => {
            // @ts-expect-error - this selection shouldn't ever be null because of the context this is being called in
            selection.focusNode.textContent = `@${item?.fullName}(${item?.id})`;
          });
          user.addEventListener('mouseover', () =>
            applyStyle(user, userHoverChanges)
          );
          user.addEventListener('mouseout', () => applyStyle(user, userStyle));
          list.appendChild(user);
        });
        container?.appendChild(list);
      }
    }
  }

  // TODO - should implement the logic to have this update the user search list on typing - so leaving the below in the code for now
  // private readonly handleInput = (event: Event) => {
  //   const selection = window.getSelection();
  //   const anchorNode = selection?.anchorNode;
  //
  //   if (anchorNode?.nodeType === Node.TEXT_NODE) {
  //     const typedText = anchorNode.textContent;
  //     console.log('User is typing:', typedText);
  //
  //     if (typedText?.startsWith('@')) {
  //       console.log('User started typing a mention');
  //     }
  //   }
  // };
}
