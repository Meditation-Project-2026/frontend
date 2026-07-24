import type { ThumbnailTheme } from '../types/content';

export const THUMBNAIL_GRADIENTS: Record<ThumbnailTheme, string> = {
  sunrise: 'bg-[linear-gradient(160deg,#F4C9A0_0%,#8B6F9E_55%,#362F52_100%)]',
  night: 'bg-[linear-gradient(160deg,#3a2e5c_0%,#1a1330_60%,#0d0a1c_100%)]',
  ocean: 'bg-[linear-gradient(160deg,#bfe9df_0%,#4fa3a0_55%,#1c4a52_100%)]',
  forest: 'bg-[linear-gradient(160deg,#2c4a34_0%,#16301f_60%,#0c1c12_100%)]',
};
