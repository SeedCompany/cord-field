import { queryByTestId, render } from '@testing-library/react';
import { DateTime } from 'luxon';
import { TestContext } from '~/TestContext';
import {
  CommentPropsFragment,
  CommentThreadPropsFragment,
} from '../CommentsBar.graphql';
import { CommentItem } from './CommentItem';

const commentText = 'This is a comment';

const comment: CommentPropsFragment = {
  __typename: 'Comment',
  id: '1',
  createdAt: DateTime.fromISO('2021-01-01T00:00:00.000Z'),
  modifiedAt: DateTime.fromISO('2021-01-01T00:00:00.000Z'),
  canDelete: true,
  creator: {
    id: '1',
    fullName: 'Full Name',
    avatarLetters: 'FN',
  },
  body: {
    value: {
      time: 1666023476823,
      blocks: [
        {
          id: 'nDNN-GePQ1',
          type: 'paragraph',
          data: {
            text: commentText,
          },
        },
      ],
      version: '2.24.3',
    },
  },
};

const parent: CommentThreadPropsFragment = {
  __typename: 'CommentThread',
  id: '1',
  firstComment: comment,
  comments: {
    __typename: 'CommentList',
    items: [comment],
    total: 1,
  },
};

const resourceId = '1';

test('matches snapshot', () => {
  const tree = render(
    <TestContext url={`/projects/${resourceId}`}>
      <CommentItem comment={comment} resourceId={resourceId} parent={parent} />
    </TestContext>
  );

  expect(tree).toMatchSnapshot();
  const body = tree.getByTestId('comment-body');
  expect(body).toBeInTheDocument();
  expect(body).toHaveTextContent(commentText);
});

test('menu options do not exist when can not delete', () => {
  const commentNoOptions: CommentPropsFragment = {
    ...comment,
    canDelete: false,
  };

  const parentNoOptions: CommentThreadPropsFragment = {
    ...parent,
    firstComment: commentNoOptions,
    comments: {
      __typename: 'CommentList',
      items: [commentNoOptions],
      total: 1,
    },
  };

  const tree = render(
    <TestContext url={`/projects/${resourceId}`}>
      <CommentItem
        comment={commentNoOptions}
        resourceId={resourceId}
        parent={parentNoOptions}
      />
    </TestContext>
  );

  expect(queryByTestId(tree.container, 'comment-menu-button')).toBeNull();
});

test('menu options exist when can delete', () => {
  const tree = render(
    <TestContext url={`/projects/${resourceId}`}>
      <CommentItem comment={comment} resourceId={resourceId} parent={parent} />
    </TestContext>
  );

  expect(queryByTestId(tree.container, 'comment-menu-button')).not.toBeNull();
});
