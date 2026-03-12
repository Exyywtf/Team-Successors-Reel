import React from 'react';
import './index.css';
import './imported-site/site/app/globals.css';
import { Composition } from 'remotion';
import { Reel } from './compositions/Reel';
import { TOTAL_FRAMES, FPS } from './lib/timing';

const REEL_RENDER_DEFAULTS = {
  width: 1080,
  height: 1920,
  fps: FPS,
  durationInFrames: TOTAL_FRAMES,
  defaultCodec: 'h264' as const,
  defaultVideoImageFormat: 'png' as const,
  defaultPixelFormat: 'yuv444p' as const,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SuccessorsReel"
        component={Reel}
        calculateMetadata={() => REEL_RENDER_DEFAULTS}
      />
    </>
  );
};
