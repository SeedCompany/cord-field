import { Button, Typography } from '@material-ui/core';
import { action } from '@storybook/addon-actions';
import { number, object, radios, select, text } from '@storybook/addon-knobs';
import React, { useState } from 'react';
import { listToMap } from '../../util';
import { Picture, PictureProps } from './Picture';

export default {
  title: 'Components/Picture',
};

export const Simple = () => (
  <Picture source="https://via.placeholder.com/150x150" />
);

export const MultipleSources = () => (
  <Picture
    placeholder={undefined}
    source={[
      ['https://via.placeholder.com/150x150', 150],
      ['https://via.placeholder.com/500x500', '1x'],
      ['https://via.placeholder.com/1000x1000', 1000],
      // only considered on double density displays
      ['https://via.placeholder.com/1001x1001', '2x'],
    ]}
    width={500}
    height={500}
    {...defaultProps()}
  />
);

export const AsBackground = () => (
  <div
    style={object('Parent Styles', {
      border: '1px solid red',
      width: 300,
      height: 450,
      position: 'relative',
      color: 'white',
      borderRadius: 10,
      display: 'flex',
    })}
  >
    <Picture
      source="https://via.placeholder.com/150x150"
      width={150}
      height={150}
      background
      {...defaultProps({ fit: 'cover', darken: 30 })}
    />
    <Typography color="inherit" variant="h2" style={{ zIndex: 1 }}>
      Hello there
    </Typography>
  </div>
);

export const LoadEffects = () => {
  const randomPic = () => `https://picsum.photos/200?hash=${Date.now()}`;
  const [source, setSource] = useState(randomPic);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px red solid',
        // so the container doesn't expand to fit the size of the loaded image
        height: 300,
      }}
    >
      <Button
        color="primary"
        onClick={async () => {
          setSource('');
          setTimeout(() => setSource(randomPic()), 500);
        }}
      >
        Next Pic
      </Button>{' '}
      {source ? (
        <Picture
          source={source}
          transitionTime={number(
            'Transition Time',
            750,
            {
              min: 0,
              max: 10000,
              step: 50,
              range: true,
            },
            'Transition'
          )}
          timingFunction={select(
            'Timing Function',
            ['ease', 'ease-in', 'ease-out', 'ease-in-out', 'linear'],
            'ease',
            'Transition'
          )}
          width={200}
          height={200}
          {...defaultProps({ fit: 'contain' })}
        />
      ) : null}{' '}
    </div>
  );
};

export const Placeholder = () => (
  <Picture
    source=""
    placeholder="https://via.placeholder.com/150x150"
    width={300}
    height={300}
    {...defaultProps({
      fit: 'contain',
      darken: 50,
      placeholderStyles: {
        opacity: 0.05,
      },
    })}
  />
);
const defaultProps = (
  props: Partial<PictureProps> = {}
): Partial<PictureProps> => ({
  placeholderStyles: {
    blur: number(
      'Blur',
      props.placeholderStyles?.blur ?? 10,
      {
        min: 0,
        max: 25,
        range: true,
      },
      'Placeholder'
    ),
    grayscale: number(
      'Grayscale',
      props.placeholderStyles?.grayscale ?? 1,
      {
        min: 0,
        max: 1,
        step: 0.01,
        range: true,
      },
      'Placeholder'
    ),
    opacity: number(
      'Opacity',
      props.placeholderStyles?.opacity ?? props.placeholder ? 1 : 0,
      {
        min: 0,
        max: 1,
        step: 0.01,
        range: true,
      },
      'Placeholder'
    ),
    filter: text('Custom Filter', '', 'Placeholder'),
  },
  fit: radios(
    'Fit',
    listToMap<NonNullable<PictureProps['fit']>>(
      ['scale', 'contain', 'cover'],
      (i) => [i, i]
    ),
    props.fit ?? 'scale',
    'Layout'
  ),
  darken: number(
    'Darken',
    props.darken ?? 0,
    {
      min: 0,
      max: 100,
      range: true,
    },
    'Effects'
  ),
  style: object('Picture Styles', {}),
  onLoad: action('loaded'),
  onError: action('error'),
});
