import { Typography } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import React from 'react';

export const ProductTypeSection = ({
  open,
  selectedItem,
  submitSelection,
  setExpandedSection,
}) => {
  const title = open ? 'Choose Product' : 'Product';

  const options = open
    ? ['scripture', 'story', 'film', 'song', 'literacyMaterial']
    : [selectedItem];

  return (
    <div>
      <Typography variant="h4">{title}</Typography>
      {!open && (
        <Typography
          variant="body2"
          color="primary"
          style={{ cursor: 'pointer' }}
          onClick={() => setExpandedSection('product')}
        >
          Edit Product
        </Typography>
      )}

      {open && (
        <Typography>
          What methods will be used to communicate God's Word?
        </Typography>
      )}

      {options.map((option) => (
        <ToggleButton
          key={option}
          onClick={() => submitSelection(option)}
          selected={option === selectedItem}
          value={option}
        >
          {option}
        </ToggleButton>
      ))}
    </div>
  );
};
