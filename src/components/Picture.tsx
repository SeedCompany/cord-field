import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { toFinite } from 'lodash';
import React from 'react';
import { Merge } from 'type-fest';
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
  /** Whether the image should stretch to the full width of its parent */
  fullWidth?: boolean;
}

export type PictureProps = Merge<
  Omit<JSX.IntrinsicElements['img'], 'src' | 'srcSet'>,
  SourceProps & LayoutProps
>;

const useStyles = makeStyles(() => ({
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
  fullWidth,
  // HTML Image Props
  ...rest
}: PictureProps) => {
  const classes = useStyles();
  const sizes = sizesProp ? many(sizesProp).join(', ') : undefined;
  const srcSet = formatSrcSet(source);

  return (
    <img
      alt=""
      {...rest}
      srcSet={srcSet}
      sizes={sizes}
      className={clsx({
        [classes.fullWidth]: fullWidth,
        [rest.className ?? '']: rest.className,
      })}
    />
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
