import { Box } from '@mui/material';
import type { PostHog } from 'posthog-js';
import {
  useFeatureFlagPayload,
  useFeatureFlagVariantKey,
  usePostHog,
} from 'posthog-js/react';
import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { ChildrenProp, StyleProps } from '~/common';

export type FeatureProps = {
  flag: string;
  children: ReactNode | ((payload: any) => ReactNode);
  fallback?: ReactNode;
  match?: string | boolean;
  visibilityObserverOptions?: IntersectionObserverInit;
  trackInteraction?: boolean;
  trackView?: boolean;
} & StyleProps;

/**
 * Adapted from PostHog's {@link import('posthog-js/react').PostHogFeature Feature} component.
 * Rendering as Box giving the ability to pass style props.
 * Added a crude option for an env override flag.
 */
export function Feature({
  flag,
  match,
  children,
  fallback,
  visibilityObserverOptions,
  trackInteraction,
  trackView,
  ...props
}: FeatureProps) {
  const payload = useFeatureFlagPayload(flag);
  const variant = useFeatureFlagVariantKey(flag);

  const shouldTrackInteraction = trackInteraction ?? true;
  const shouldTrackView = trackView ?? true;

  if (
    !(
      match === undefined ||
      variant === match ||
      process.env[`RAZZLE_POSTHOG_FLAG_${flag}`]
    )
  ) {
    return <>{fallback}</>;
  }
  const childNode: ReactNode =
    typeof children === 'function' ? children(payload) : children;
  return (
    <VisibilityAndClickTracker
      flag={flag}
      options={visibilityObserverOptions}
      trackInteraction={shouldTrackInteraction}
      trackView={shouldTrackView}
      {...props}
    >
      {childNode}
    </VisibilityAndClickTracker>
  );
}

export interface VisibilityAndClickTrackerProps
  extends UseVisibilityAndClickTrackerProps,
    ChildrenProp,
    StyleProps {}

export function VisibilityAndClickTracker({
  flag,
  children,
  trackInteraction,
  trackView,
  options,
  ...props
}: VisibilityAndClickTrackerProps) {
  const tracking = useVisibilityAndClickTracker({
    flag,
    trackInteraction,
    trackView,
    options,
  });
  return (
    <Box {...props} {...tracking}>
      {children}
    </Box>
  );
}

export interface UseVisibilityAndClickTrackerProps {
  flag: string;
  trackInteraction: boolean;
  trackView: boolean;
  options?: IntersectionObserverInit;
}
export const useVisibilityAndClickTracker = ({
  flag,
  trackInteraction,
  trackView,
  options,
}: UseVisibilityAndClickTrackerProps) => {
  const ref = useRef<Element | any>(null);
  const posthog = usePostHog();
  const visibilityTrackedRef = useRef(false);
  const clickTrackedRef = useRef(false);

  const cachedOnClick = useCallback(() => {
    if (!clickTrackedRef.current && trackInteraction) {
      captureFeatureInteraction(flag, posthog);
      clickTrackedRef.current = true;
    }
  }, [flag, posthog, trackInteraction]);

  useEffect(() => {
    if (ref.current === null || !trackView) return;

    const onIntersect = (entry: IntersectionObserverEntry) => {
      if (!visibilityTrackedRef.current && entry.isIntersecting) {
        captureFeatureView(flag, posthog);
        visibilityTrackedRef.current = true;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => onIntersect(entry!),
      {
        threshold: 0.1,
        ...options,
      }
    );
    observer.observe(ref.current as Element);
    return () => observer.disconnect();
  }, [flag, options, posthog, ref, trackView]);

  return { ref, onClick: cachedOnClick };
};

function captureFeatureInteraction(flag: string, posthog: PostHog) {
  posthog.capture('$feature_interaction', {
    feature_flag: flag,
    $set: { [`$feature_interaction/${flag}`]: true },
  });
}

function captureFeatureView(flag: string, posthog: PostHog) {
  posthog.capture('$feature_view', { feature_flag: flag });
}
