import { makeQueryHandler, StringParam } from '../../hooks';

const useState = makeQueryHandler({
  state: StringParam,
});
export const useHighlightedState = () => useState()[0].state;
