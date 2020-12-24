import { useContext, useDebugValue, useState } from 'react';
import { RequestContext } from './useRequest';

// Use sparingly. Doing things based on User Agent is unreliable and not recommended.
export const useUserAgent = () => {
  const req = useContext(RequestContext);
  const ua = req ? req.header('user-agent')! : window.navigator.userAgent;
  useDebugValue(ua);
  return ua;
};

// Use sparingly. This is an imperfect check.
export const useIsBot = () => {
  const agent = useUserAgent();
  const [isBot] = useState(
    () =>
      (typeof window !== 'undefined' && !('onscroll' in window)) ||
      /(gle|ing|ro)bot|crawl|spider/i.test(agent)
  );
  useDebugValue(isBot);

  return isBot;
};
