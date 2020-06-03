import { createContext, useContext, useDebugValue, useState } from 'react';

// Allows user agent to be overridden/defined during SSR
export const UserAgentContext = createContext(
  typeof window !== 'undefined' ? window.navigator.userAgent : undefined
);

// Use sparingly. Doing things based on User Agent is unreliable and not recommended.
export const useUserAgent = () => {
  const ua = useContext(UserAgentContext);
  if (!ua) {
    throw new Error('User agent has not been defined');
  }
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
