interface CrownHuntHomeProps {
    setMonsterSpyPage: (page: string) => void;
}
const crownHuntMainPages = [
    'PLAY',
    'LOCATIONS',
    'FIND YOUR MONSTER',
];

const crownHuntSecondaryPages = [
    'RULES',
    'SETTINGS',
];

import GoldenMonsterButton from '../monsterSpyComponents/MonsterYellowBtn';
import React from 'react';
import {
    Dimensions as CrownHuntDims,
    Text as CrownHuntTxt,
    View as CrownHuntVie,
    Platform,
    SafeAreaView,
    Image as CrownHuntImg,
} from 'react-native';


const MonsterSpyHome: React.FC<CrownHuntHomeProps> = ({ setMonsterSpyPage }) => {
    const spyScreenDis = CrownHuntDims.get('window');

    return (
        <CrownHuntVie
            style={{
                width: spyScreenDis.width,
                alignItems: 'center',
                alignSelf: 'center',
                flex: 1,
                marginTop: Platform.OS === 'ios' ? 0 : spyScreenDis.height * 0.029543,
            }}
        >
            <SafeAreaView />
            <CrownHuntTxt
                style={{
                    fontWeight: 'bold',
                    color: '#F4B331',
                    textAlign: 'center',
                    fontSize: spyScreenDis.width * 0.057,
                }}
            >
                MONSTER SPY:{'\n'}
                CROWN HUNT
            </CrownHuntTxt>

            <CrownHuntImg
                source={require('../monsterSpyAssets/monsterSpyImages/monsterCards.png')}
                style={{
                    marginVertical: spyScreenDis.height * 0.02,
                    height: spyScreenDis.height * 0.4,
                    width: spyScreenDis.width * 1.3,
                }}
                resizeMode="contain"
            />

            <CrownHuntVie
                style={{
                    alignItems: 'center',
                    bottom: spyScreenDis.height * 0.12,
                    alignSelf: 'center',
                    width: spyScreenDis.width * 0.90546,
                    position: 'absolute',
                }}
            >
                {crownHuntMainPages.map((page, index) => (
                    <CrownHuntVie key={index}>
                        <GoldenMonsterButton
                            monsterPropsText={page}
                            fontSize={spyScreenDis.width * 0.08}
                            buttonWidth={spyScreenDis.width * 0.90546}
                            buttonHeight={spyScreenDis.height * 0.08888}
                            onPress={() => { setMonsterSpyPage(page); }}
                            textStyle={{
                                color: '#91181D',
                                fontSize: spyScreenDis.width * 0.059,
                                fontWeight: 'bold',
                            }}
                        />
                    </CrownHuntVie>
                ))}

                <CrownHuntVie
                    style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', }}>
                    {crownHuntSecondaryPages.map((page, index) => (
                        <CrownHuntVie key={index}>
                            <GoldenMonsterButton
                                onPress={() => {
                                    setMonsterSpyPage(page);
                                }}
                                buttonHeight={spyScreenDis.height * 0.08888}
                                monsterPropsText={page}
                                fontSize={spyScreenDis.width * 0.08}
                                buttonWidth={spyScreenDis.width * 0.43044}
                                textStyle={{
                                    fontSize: spyScreenDis.width * 0.059,
                                    fontWeight: 'bold',
                                    color: '#91181D',
                                }}
                            />
                        </CrownHuntVie>
                    ))}
                </CrownHuntVie>
            </CrownHuntVie>
        </CrownHuntVie>
    );
};

export default MonsterSpyHome;
