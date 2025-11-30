import { MediaItem } from '../types';

const CameraService = {
  capture(kind: MediaItem['type']): Promise<MediaItem> {
    return new Promise((resolve) => {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      resolve({
        id,
        type: kind,
        url: `https://placehold.co/600x400?text=${kind}+${id.slice(0, 5)}`,
        timestamp: now,
      });
    });
  },
};

export default CameraService;
