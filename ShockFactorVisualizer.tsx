import React, { useState, useEffect, useRef } from 'react';
import { visualizerBus, handleEffectEvent, EffectEvent, FramePayload } from './shockFactor';

const ShockFactorVisualizer: React.FC = () => {
  const [frame, setFrame] = useState<FramePayload | null>(null);
  const containerRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const handleFrame = (newFrame: FramePayload) => {
      setFrame(newFrame);
    };

    visualizerBus.on('frame', handleFrame);

    return () => {
      visualizerBus.off('frame', handleFrame);
    };
  }, []);

  // Effect to trigger the visualizer when the component is active
  useEffect(() => {
    const event: EffectEvent = { id: 'active', name: 'pulse', intensity: 0.8 };
    const interval = setInterval(() => {
        handleEffectEvent(event, Math.random() < 0.5 ? 'pulse' : 'wordfire');
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/50 p-4 rounded-lg border border-purple-500/30">
        <h3 className="text-lg font-semibold text-purple-300 mb-2">Stage FX: Shock Factor</h3>
        <pre
            ref={containerRef}
            className="font-mono text-xs text-green-400 overflow-hidden"
            style={{ lineHeight: '1.2' }}
        >
            {frame ? frame.asciiLines.join('\n') : 'Activating...'}
        </pre>
    </div>
  );
};

export default ShockFactorVisualizer;
