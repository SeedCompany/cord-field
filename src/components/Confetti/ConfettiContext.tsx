import { useTheme } from '@mui/material/styles';
import { useMap, useSize } from 'ahooks';
import { noop } from 'lodash';
import { createContext, useCallback, useContext } from 'react';
import ReactConfetti from 'react-confetti';
import { IConfettiOptions } from 'react-confetti/dist/types/Confetti';
import { ChildrenProp } from '~/common';

export type ConfettiOptions = Partial<IConfettiOptions>;

export type AddConfettiFn = (options: ConfettiOptions) => ConfettiRef;

export interface ConfettiRef {
  /**
   * Stop the confetti animation, used with `recycle` is true.
   * This waits for particles to fall of screen before destroying.
   */
  stop: () => void;
  /**
   * Destroy the confetti animation. This will stop animations immediately.
   */
  destroy: () => void;
}

export const useConfetti = () => useContext(ConfettiContext);

const ConfettiContext = createContext<AddConfettiFn>(() => ({
  stop: noop,
  destroy: noop,
}));

let lastId = 0;

interface ConfettiInstance {
  id: number;
  options: ConfettiOptions;
  ref: ConfettiRef;
}

export const ConfettiProvider = ({ children }: ChildrenProp) => {
  const theme = useTheme();
  const windowSize = useSize(
    typeof document !== 'undefined' ? document.body : null
  );

  const [instances, instanceMap] = useMap<number, ConfettiInstance>();

  const addConfetti = useCallback(
    (options: ConfettiOptions) => {
      const instance: ConfettiInstance = {
        id: lastId++,
        options: {
          recycle: false,
          ...options,
          onConfettiComplete: (confetti) => {
            instance.ref.destroy();
            options.onConfettiComplete?.(confetti);
          },
        },
        ref: {
          stop: () =>
            instanceMap.set(instance.id, {
              ...instance,
              options: { ...instance.options, recycle: false },
            }),
          destroy: () => instanceMap.remove(instance.id),
        },
      };

      instanceMap.set(instance.id, instance);

      return instance.ref;
    },
    [instanceMap]
  );

  return (
    <>
      <ConfettiContext.Provider value={addConfetti}>
        {children}
      </ConfettiContext.Provider>

      {[...instances.values()].map((instance) => (
        <ReactConfetti
          style={{
            zIndex: theme.zIndex.modal + 1,
          }}
          key={instance.id}
          data-id={instance.id}
          {...windowSize}
          {...instance.options}
        />
      ))}
    </>
  );
};
