import createContainer from 'constate';
import { unionBy } from 'lodash';
import { useEffect, useState } from 'react';

export const Title = ({ title }: { title: string }) => {
  useTitle(title);
  return null;
};

export const useTitle = (title?: string) => {
  const context = useTitleContext();
  const [id] = useState(uniqid);
  // Ignore context changes which change when the title changes
  // which creates an infinite loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => context.register(id, title), [id, title]);
};

interface TitleState {
  string?: string;
  id?: string;
}

const useTitles = ({ title = '', divider = ' - ', append = false }) => {
  const [titles, setTitles] = useState<TitleState[]>([]);

  // Reset old title on unmount
  useEffect(() => {
    const oldTitle = document.title;
    return () => {
      document.title = oldTitle;
    };
  }, []);

  useEffect(() => {
    const allTitles = [{ string: title }, ...titles];
    if (!append) {
      allTitles.reverse();
    }
    document.title = joinTitles(allTitles, divider);
  }, [titles, divider, append, title]);

  function register(id: string, string?: string) {
    const object = { id, string };
    setTitles((state) => unionBy(state, [object], 'id'));
    return function unregister() {
      const id = object.id;
      setTitles((state) => state.filter((item) => item.id !== id));
    };
  }

  return { register, titles };
};

const [TitleProvider, useTitleContext] = createContainer(useTitles);
export { TitleProvider };

const joinTitles = (titles: TitleState[], divider: string) =>
  titles
    .map((item) => item.string)
    .filter((item) => item)
    .join(divider);

const uniqid = () => {
  const time = Date.now();
  const last = uniqid.last || time;
  return (uniqid.last = time > last ? time : last + 1).toString(36);
};
uniqid.last = 0;
