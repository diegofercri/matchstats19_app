import React from 'react';
import Banner from '@components/ui/Banner';
import { BannerData } from '@services/homeService';

/**
 * Props interface for HomeBanner component
 * Extends BannerData interface to maintain type consistency
 */
interface HomeBannerProps extends BannerData {}

/**
 * Home banner wrapper component for promotional content
 * Provides a typed wrapper around the generic Banner component
 * Specifically designed for home screen promotional banners
 * 
 * @param props - Banner data including slug, title, date, and image URL
 * @returns JSX element containing Banner component with home-specific styling context
 */
export function HomeBanner({ slug, title, date, imageUrl }: HomeBannerProps) {
  return (
    <Banner
      slug={slug}
      title={title}
      date={date}
      imageUrl={imageUrl}
    />
  );
}