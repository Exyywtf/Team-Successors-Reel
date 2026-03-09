import React from 'react';
import './index.css';
import './imported-site/site/app/globals.css';
import { Composition } from 'remotion';
import { Reel } from './compositions/Reel';
import { TOTAL_FRAMES, FPS } from './lib/timing';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SuccessorsReel"
        component={Reel}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
