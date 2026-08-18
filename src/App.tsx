import React, { useState, useEffect } from 'react';
import { BirthdayConfig } from './types';
import { DEFAULT_CONFIG, loadConfigFromUrl } from './utils/constants';
import { HamsterBirthdayStage } from './components/HamsterBirthdayStage';

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(DEFAULT_CONFIG);

  // Load configuration from URL if shared
  useEffect(() => {
    const loaded = loadConfigFromUrl();
    setConfig(loaded);
  }, []);

  const handleUpdateConfig = (newConfig: BirthdayConfig) => {
    setConfig(newConfig);
  };

  return (
    <div className="min-h-screen bg-beige-canvas text-[#2c221a] flex flex-col justify-center items-center relative overflow-x-hidden selection:bg-[#ecdcc9] selection:text-[#382618] font-crayon">
      {/* Main Cute Hamster Birthday Stage */}
      <main className="w-full flex-1 flex flex-col justify-center items-center relative">
        <HamsterBirthdayStage
          config={config}
          onUpdateConfig={handleUpdateConfig}
        />
      </main>
    </div>
  );
}
