import React from 'react';
import Banner from '@components/ui/Banner';
import { BannerData } from '@services/homeService';

interface HomeBannerProps extends BannerData {}

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