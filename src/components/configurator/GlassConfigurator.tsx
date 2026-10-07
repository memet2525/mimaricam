import React from 'react';
import { FireplaceGlassConfigurator } from './FireplaceGlassConfigurator';
import { CustomDesignConfig } from '../../types';

interface GlassConfiguratorProps {
  initialCategoryId?: string;
  onAddToCart?: (config: CustomDesignConfig) => void;
}

export const GlassConfigurator: React.FC<GlassConfiguratorProps> = () => {
  return (
    <div className="w-full">
      <FireplaceGlassConfigurator />
    </div>
  );
};
