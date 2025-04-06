import React from 'react';
import { Box } from '@adminjs/design-system';

const ShowImage = (props) => {
  const { record } = props;
  const srcImg = record.params.image;
  
  if (!srcImg) {
    return null;
  }
  
  return (
    <Box>
      <img src={srcImg} alt={record.params.title || 'Image'} style={{ maxWidth: '100%' }} />
    </Box>
  );
};

export default ShowImage;