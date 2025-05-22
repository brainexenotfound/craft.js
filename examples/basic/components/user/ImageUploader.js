import { useNode } from '@craftjs/core';
import React, { useEffect } from 'react';
import { Paper, Typography } from '@mui/material';

export const ImageUploader = ({ images = [], ...props }) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
  } = useNode();

  // Clean up object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        if (image.startsWith('blob:')) {
          URL.revokeObjectURL(image);
        }
      });
    };
  }, [images]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setProp((props) => ({ ...props, images: [...props.images, ...newImages] }));
  };

  return (
    <Paper
      {...props}
      ref={(ref) => connect(drag(ref))}
      style={{
        padding: '20px',
        border: '2px dashed #ccc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        style={{ marginBottom: '10px' }}
      />
      <Typography variant="h6">Uploaded Images:</Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`uploaded-${index}`}
            style={{ width: '100px', height: '100px', margin: '5px', objectFit: 'cover' }}
          />
        ))}
      </div>
    </Paper>
  );
};

export const ImageUploaderSettings = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props,
  }));

  return (
    <div>
      <Typography variant="subtitle2">
        {props.images?.length || 0} images uploaded
      </Typography>
      {props.images?.length > 0 && (
        <button
          onClick={() => setProp((props) => ({ ...props, images: [] }))}
          style={{ marginTop: '10px' }}
        >
          Clear All Images
        </button>
      )}
    </div>
  );
};

export const ImageUploaderDefaultProps = {
  images: [],
};

ImageUploader.craft = {
  props: ImageUploaderDefaultProps,
  related: {
    settings: ImageUploaderSettings,
  },
};