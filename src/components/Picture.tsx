import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { toFinite } from 'lodash';
import React, { useState } from 'react';
import { IntersectionOptions, useInView } from 'react-intersection-observer';
import { Merge } from 'type-fest';
import { useIsBot } from '../hooks';
import { many } from '../util';

export interface SourceProps {
  /**
   * An image url or set of image urls with sizes
   *
   * @example
   *   source="https://via.placeholder.com/150x150"
   * @example
   *   source={[
   *     ['https://via.placeholder.com/150x150', 150],
   *     ['https://via.placeholder.com/300x300', 300],
   *   ]}
   * @example
   *   source={[
   *     ['https://via.placeholder.com/small.jpg', '1x'],
   *     ['https://via.placeholder.com/large.jpg', '2x'],
   *   ]}
   */
  source: ImageSourceSet;
  /** Sizes attribute to be used with src for determine best image for user's viewport. */
  sizes?: string | string[];
}

export type ImageSourceSet = string | ImageSource[];

export type ImageSource = string | [string, string | number];

export interface LayoutProps {
  /**
   * Image's aspect ratio
   *
   * Used to correctly allocate layout height before image is loaded.
   * This isn't the image's actual size, which most of the time is dynamic
   * anyways. It's the natural width divided by the natural height.
   */
  aspectRatio?: number;
  /** Whether the image should stretch to the full width of its parent */
  fullWidth?: boolean;
}

export interface LazyProps {
  /**
   * Whether to load the image lazily (while in / just before in view).
   * - `native` or `true` just uses the native lazy loading functionality, no JS.
   *    If native is not supported we fallback to `observe`.
   *    This should generally be the option specified.
   *    @see https://web.dev/native-lazy-loading/
   * - `observe` uses `IntersectionObserver` to determine when image is first
   *    in view / close to in view. This can be useful when images are hidden
   *    out of view, but still positioned in the viewport. i.e. carousels
   */
  lazy?: 'native' | 'observe' | true;
  /**
   * Options for `IntersectionObserver` when using `lazy=observe`.
   * These should probably also be specified for `lazy=native`
   * because it still falls back to observe when native is not supported.
   */
  lazyOptions?: IntersectionOptions;
}

export type PictureProps = Merge<
  Omit<JSX.IntrinsicElements['img'], 'src' | 'srcSet'>,
  SourceProps & LayoutProps & LazyProps
>;

const useStyles = makeStyles(() => ({
  aspectRatio: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  fullWidth: {
    width: '100%',
  },
}));

/**
 * An Image/Picture wrapper.
 *
 * Named picture to not conflict with global DOM Image class.
 * Auto imports will not work with `Image` because editor thinks
 * you are referencing the global class.
 */
export const Picture = ({
  // Source Props
  source,
  sizes: sizesProp,
  // Layout Props
  aspectRatio,
  fullWidth,
  // Lazy Props
  lazy: lazyProp,
  lazyOptions,
  // HTML Image Props
  className: classNameProp,
  style: styleProp,
  ...rest
}: PictureProps) => {
  const classes = useStyles();
  const sizes = sizesProp ? many(sizesProp).join(', ') : undefined;
  const srcSet = formatSrcSet(source);

  const isBot = useIsBot();
  const [supportsNativeLazyLoading] = useState(
    () => 'loading' in HTMLImageElement.prototype
  );
  const lazyNative =
    (lazyProp === true || lazyProp === 'native') && supportsNativeLazyLoading;
  const lazyObserve =
    lazyProp === 'observe' || (lazyProp && !supportsNativeLazyLoading);
  const [ref, inView] = useInView({
    rootMargin: '200px 0px',
    ...lazyOptions,
    triggerOnce: true,
  });
  const hideImg = lazyObserve && !inView && !isBot;
  const needsWrapper = aspectRatio || hideImg;

  const img = hideImg ? null : (
    <img
      alt=""
      {...rest}
      srcSet={srcSet}
      sizes={sizes}
      className={clsx({
        [classes.aspectRatio]: aspectRatio,
        [classes.fullWidth]: fullWidth,
        [classNameProp ?? '']: !needsWrapper && classNameProp,
      })}
      style={!needsWrapper && styleProp ? styleProp : undefined}
      {...(lazyNative ? { loading: 'lazy' } : {})}
    />
  );

  return needsWrapper ? (
    <div
      ref={lazyObserve && !inView ? ref : undefined}
      className={classNameProp}
      style={{
        position: 'relative',
        paddingBottom: aspectRatio ? `${(1 / aspectRatio) * 100}%` : undefined,
        ...styleProp,
      }}
    >
      {img}
    </div>
  ) : (
    img
  );
};

const formatSrcSet = (source: ImageSourceSet) =>
  many(source)
    .map((src) => {
      const [url, size] = many(src);
      const sizeStr = !size
        ? undefined
        : toFinite(size) === 0
        ? size
        : `${size}w`;
      return sizeStr ? `${url} ${sizeStr}` : url;
    })
    .join(', ');
