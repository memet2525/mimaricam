import React, { useState, useEffect } from 'react';
import { getStorageUrl, DEFAULT_REPLACEMENT_IMAGE } from '../../services/imageService';

export interface StorageImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fileName?: string;
  imageName?: string;
  fallbackSrc?: string;
}

export const StorageImage: React.FC<StorageImageProps> = ({
  fileName,
  imageName,
  fallbackSrc = DEFAULT_REPLACEMENT_IMAGE,
  alt = 'MimariCam',
  className = '',
  ...props
}) => {
  const getInitialSrc = () => {
    const rawPath = fileName || imageName || '';
    return getStorageUrl(rawPath) || fallbackSrc;
  };

  const [src, setSrc] = useState<string>(getInitialSrc());

  useEffect(() => {
    const rawPath = fileName || imageName || '';
    const resolvedUrl = getStorageUrl(rawPath) || fallbackSrc;
    setSrc(resolvedUrl);
  }, [fileName, imageName, fallbackSrc]);

  const handleError = () => {
    if (src !== fallbackSrc) {
      setSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={src || undefined}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};
