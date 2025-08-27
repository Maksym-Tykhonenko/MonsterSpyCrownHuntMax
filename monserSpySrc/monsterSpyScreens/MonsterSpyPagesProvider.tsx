import MonsterSpyPlayMonsterGame from './MonsterSpyPlayMonsterGame';
import MonsterSpyLocations from './MonsterSpyLocations';
import { View as SpyVieOfMonster, SafeAreaView, ImageBackground, Dimensions, Platform, } from 'react-native';

import MonsterSpyHome from './MonsterSpyHome';
import MonsterSpyFindYourMonster from './MonsterSpyFindYourMonster';
import MonsterSpyRules from './MonsterSpyRules';
import MonsterSpySettings from './MonsterSpySettings';
import React, { useState } from 'react';

type MonsterSpuPages =
  | 'LOCATIONS'
  | 'PLAY'
  | 'Monster Home Screen'
  | 'SETTINGS'
  | 'RULES'
  | 'FIND YOUR MONSTER';

const MonsterSpyPagesProvider: React.FC = () => {
  const [monsterSpyPage, setMonsterSpyPage] = useState<MonsterSpuPages>('Monster Home Screen');
  const [presetChosen, changePresetChosen] = useState<any>(null);
  const [finderStarted, toggleFinderStarted] = useState(false);
  const [monsterSpyScrSi, setMonsterSpyScrSi] = useState(Dimensions.get('window'));

  const renderActivePage = () => {
    if (monsterSpyPage === 'Monster Home Screen') {
      return (
        <MonsterSpyHome
          setMonsterSpyPage={setMonsterSpyPage}
          setSelectedPreset={changePresetChosen}
          monsterSpyScrSi={monsterSpyScrSi}
        />
      );
    }
    if (monsterSpyPage === 'PLAY') {
      return (
        <MonsterSpyPlayMonsterGame
          setMonsterSpyPage={setMonsterSpyPage}

          monsterSpyScrSi={monsterSpyScrSi}
        />
      );
    }
    if (monsterSpyPage === 'SETTINGS') {
      return (
        <MonsterSpySettings
          monsterSpyScrSi={monsterSpyScrSi}
          setMonsterSpyPage={setMonsterSpyPage}
        />
      );
    }
    if (monsterSpyPage === 'FIND YOUR MONSTER') {
      return (
        <MonsterSpyFindYourMonster
          setIsMonsterFinderStarted={toggleFinderStarted}

          isMonsterFinderStarted={finderStarted}

          monsterSpyScrSi={monsterSpyScrSi}

          setMonsterSpyPage={setMonsterSpyPage}
        />
      );
    }
    if (monsterSpyPage === 'RULES') {
      return <MonsterSpyRules setMonsterSpyPage={setMonsterSpyPage} />;
    }
    if (monsterSpyPage === 'LOCATIONS') {
      return (
        <MonsterSpyLocations
          setMonsterSpyPage={setMonsterSpyPage}

          selectedPreset={presetChosen}

          monsterSpyScrSi={monsterSpyScrSi}
        />
      );
    }
    return null;
  };

  const getBackgroundSource = () => {
    return monsterSpyPage === 'FIND YOUR MONSTER' && !finderStarted
      ? require('../monsterSpyAssets/monsterSpyImages/monsterLoadingSpy.png')
      : require('../monsterSpyAssets/monsterSpyImages/monsterBackgro.png');
  };

  return (
    <SpyVieOfMonster
      style={{
        height: monsterSpyScrSi.height,
        width: monsterSpyScrSi.width,
        backgroundColor: '#000',
        flex: 1,
      }}
    >
      <ImageBackground
        source={getBackgroundSource()}
        style={{
          zIndex: 0,
          left: 0,
          height: monsterSpyScrSi.height,
          position: 'absolute',
          top: 0,
          width: monsterSpyScrSi.width * 1.1,
        }}
        resizeMode="cover"
      />
      <SafeAreaView />
      {Platform.OS === 'android' && <SpyVieOfMonster style={{paddingTop: monsterSpyScrSi.height * 0.0320546}}/>}
      {renderActivePage()}
    </SpyVieOfMonster>
  );
};

export default MonsterSpyPagesProvider;
