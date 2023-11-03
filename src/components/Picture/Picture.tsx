import { many } from '@seedcompany/common';
import { toFinite } from 'lodash';
import { memo, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { makeStyles } from 'tss-react/mui';
import { Merge } from 'type-fest';
import { useIsBot } from '../../hooks';
import { usePictureSizes } from '../PictureSizes';

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
  /** The image's natural width */
  width?: number;
  /** The image's natural height */
  height?: number;
  /**
   * How does the image fit itself in regards to its parent?
   * - `scale`    - image will grow proportionally as large as it can
   * - `contain`  - image will not go beyond its natural size
   *                and will center itself within its parent
   * - `cover`    - image WILL go beyond its natural size to completely cover the
   *                parent. This could result in parts of the image being hidden.
   *
   * If `background` is true, then the default will be `cover`, else `scale`.
   */
  fit?: 'scale' | 'contain' | 'cover';
  /**
   * Image is to be used as a background
   * This will absolutely position the element to fill the parent.
   * Note: This requires the parent element to be styled `position: relative`
   */
  background?: boolean;
}

export interface LazyProps {
  /**
   * Whether to load the image lazily (while in / just before in view).
   *
   * Optionally specify the lazy loading implementation:
   * - `native` just uses the native lazy loading functionality, no JS.
   *    If native is not supported we fallback to `observe`.
   *    This should generally be the option specified.
   *    @see https://web.dev/native-lazy-loading/
   * - `observe` uses `IntersectionObserver` to determine when image is first
   *    in view / close to in view. This can be useful when images are hidden
   *    out of view, but still positioned in the viewport. i.e. carousels
   */
  lazy?: boolean | 'native' | 'observe';
  /**
   * Margin around the image in which to trigger loading.
   *
   * Can have values similar to the CSS margin property,
   * e.g. "10px 20px 30px 40px" (top, right, bottom, left).
   */
  lazyMargin?: string;
}

export interface PlaceholderProps {
  /** Placeholder image url to show until the source loads */
  placeholder?: string;
  /** Filters to use while showing placeholder */
  placeholderStyles?: PlaceholderStyles;
  /** Filters to use when an image fails to load */
  errorStyles?: PlaceholderStyles;

  /** Time in millisecond to transition the effects */
  transitionTime?: number;
  /** Timing function to use for the effects */
  timingFunction?: string;
}

export interface PlaceholderStyles {
  /** Initial value for the blur filter */
  blur?: number;
  /** Initial value for the grayscale filter */
  grayscale?: number;
  /** Initial value for the opacity filter */
  opacity?: number;
  /**
   * Custom filter - using this ignores blur, grayscale, opacity.
   * The filter CSS property to applies graphical effects.
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/filter
   **/
  filter?: string;
}

export interface EffectsProps {
  /**
   * Darken the image by a percentage (0-100)
   */
  darken?: number;
}

export type PictureProps = Merge<
  Omit<JSX.IntrinsicElements['img'], 'ref' | 'src' | 'srcSet'>,
  SourceProps & LayoutProps & LazyProps & PlaceholderProps & EffectsProps
>;

const useStyles = makeStyles()(() => ({
  root: {
    borderRadius: 0,
  },
  contain: {
    margin: 'auto',
  },
  coverHolder: {
    height: '100%',
  },
  coverImg: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  },
  holder: {
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  img: {
    maxWidth: '100%',
    borderRadius: 'inherit',
  },
  aspectRatio: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  darkener: {
    background: 'black',
    opacity: 0,
  },
}));

/**
 * An Image/Picture wrapper.
 *
 * Named picture to not conflict with global DOM Image class.
 * Auto imports will not work with `Image` because editor thinks
 * you are referencing the global class.
 */
const PictureImpl = ({
  // Source Props
  source,
  sizes: sizesProp,
  // Layout Props
  width,
  height,
  fit: fitProp,
  background,
  // Lazy Props
  lazy: lazyProp,
  lazyMargin,
  // Placeholder Props
  placeholder,
  placeholderStyles = {},
  errorStyles = {},
  transitionTime = undefined,
  timingFunction = 'ease',
  // Effects Props
  darken,
  // HTML Image Props
  className: classNameProp,
  style: styleProp,
  ...rest
}: PictureProps) => {
  const { classes, cx } = useStyles();
  const sizesContext = usePictureSizes();
  const sizes = sizesProp ? many(sizesProp).join(', ') : sizesContext;
  const srcSet = formatSrcSet(source);
  const aspectRatio = width && height ? width / height : 0;
  const fit = fitProp ? fitProp : background ? 'cover' : 'scale';
  const fitCover = fit === 'cover';
  const fitContain = fit === 'contain';

  const isBot = useIsBot();
  const [supportsNativeLazyLoading] = useState(
    () =>
      typeof HTMLImageElement !== 'undefined' &&
      'loading' in HTMLImageElement.prototype
  );
  const lazyNative = lazyProp === 'native' && supportsNativeLazyLoading;
  const lazyObserve =
    lazyProp === true ||
    lazyProp === 'observe' ||
    (lazyProp && !supportsNativeLazyLoading);
  const [ref, inView] = useInView({
    rootMargin: lazyMargin || '200px 0px',
    triggerOnce: true,
  });
  const hideImg = !placeholder && lazyObserve && !inView && !isBot;
  const needsHolder = Boolean(aspectRatio || hideImg || darken);

  // We use the DOM callbacks to determine state as this is closest to what
  // the UI shows. Calling loadImage here still requires the image to load again
  // on DOM if "Disable cache" in DevTools is used. This makes it hard to
  // determine what it will actually look like outside of dev.
  const [urlLoaded, setLoaded] = useState<string | undefined>();
  const [urlErrored, setErrored] = useState<string | undefined>();

  useEffect(() => {
    if (urlLoaded === srcSet) {
      // console.log('source has been loaded');
    } else if (urlLoaded === placeholder) {
      // console.log('placeholder has been loaded');
    } else if (urlLoaded) {
      // console.log('resetting loaded url');
      setLoaded(undefined);
      setErrored(undefined);
    }
  }, [placeholder, sizes, srcSet, urlLoaded]);

  // Show placeholder if...
  const renderPlaceholder =
    // it's given and
    placeholder &&
    // has not errored out and
    urlErrored !== placeholder &&
    // this is not a bot and
    !isBot &&
    // it is loading, or src has errored, or lazy and out of view
    (!urlLoaded || urlErrored === srcSet || (lazyObserve && !inView));

  const filter =
    urlLoaded === srcSet || lazyNative || isBot
      ? undefined // done, remove filters
      : urlErrored === srcSet
      ? formatStyles({
          blur: 10,
          grayscale: 1,
          opacity: 1,
          ...errorStyles,
        })
      : formatStyles({
          blur: 10,
          grayscale: 0,
          opacity: placeholder ? 1 : 0,
          ...placeholderStyles,
        });

  const transTime =
    transitionTime !== undefined ? transitionTime : placeholder ? 750 : 250;
  const styles = {
    filter,
    transition: `filter ${transTime}ms ${timingFunction}`,
  };

  const img = hideImg ? null : (
    <img
      alt=""
      {...rest}
      ref={lazyObserve && !inView ? ref : undefined}
      srcSet={renderPlaceholder ? placeholder : srcSet}
      sizes={sizes}
      width={width}
      height={height}
      className={cx({
        [classes.img]: true,
        [classes.aspectRatio]: Boolean(aspectRatio),
        [classes.coverImg]: fitCover,
        [classes.root]: !needsHolder,
        [classNameProp ?? '']: Boolean(!needsHolder && classNameProp),
      })}
      style={!needsHolder ? { ...styles, ...styleProp } : styles}
      {...(lazyNative ? { loading: 'lazy' } : {})}
      onLoad={(e) => {
        setLoaded(e.currentTarget.srcset);
        if (rest.onLoad) {
          rest.onLoad(e);
        }
      }}
      onError={(e) => {
        const url = e.currentTarget.srcset;
        setErrored(url);
        if (rest.onError) {
          rest.onError(e);
        } else {
          // eslint-disable-next-line no-console
          console.error('Image failed to load\n', url);
        }
      }}
    />
  );

  const held = needsHolder ? (
    <div
      ref={lazyObserve && !inView ? ref : undefined}
      className={cx({
        [classes.holder]: true,
        [classes.coverHolder]: fitCover,
        [classes.root]: true,
        [classNameProp ?? '']: Boolean(classNameProp),
      })}
      style={{
        paddingBottom: aspectRatio ? `${(1 / aspectRatio) * 100}%` : undefined,
        ...styleProp,
      }}
    >
      {img}
      {darken && (
        <div
          className={cx(classes.background, classes.darkener)}
          style={{
            ...styles,
            opacity: darken / 100,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  ) : (
    img
  );

  if (background || fitContain) {
    return (
      <div
        className={cx({
          [classes.background]: background,
          [classes.contain]: fitContain,
        })}
        style={fitContain ? { maxWidth: width, maxHeight: height } : undefined}
      >
        {held}
      </div>
    );
  }

  return held;
};
PictureImpl.displayName = 'Picture';
export const Picture = memo(PictureImpl);

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

const formatStyles = ({
  filter,
  blur,
  grayscale,
  opacity,
}: PlaceholderStyles) =>
  filter ||
  [
    blur ? `blur(${blur}px)` : '',
    grayscale ? `grayscale(${grayscale})` : '',
    opacity !== 1 ? `opacity(${opacity})` : '',
  ].join(' ');
