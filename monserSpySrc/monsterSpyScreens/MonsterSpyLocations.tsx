interface CrownPropsMonster {
    setMonsterSpyPage: (page: string) => void;
}

import monsterSpyLocationsAndThemes from '../monsterSpyData/monsterSpyLocationsAndThemes';
import { SafeAreaView as CrownSafeMonster } from 'react-native-safe-area-context';
import React, { useRef as useMonsterRef, useEffect as useMonsterEffect } from 'react';
import { ScrollView as CrownScrollMonster } from 'react-native-gesture-handler';
import {
    Animated as CrownAnimMonster,
    TouchableOpacity as CrownTouchMonster,
    Dimensions as CrownDimsMonster,
    Text as CrownTxtMonster,
    View as CrownVieMonster,
    Image as CrownImgMonster,
}
    from 'react-native';



const MonsterSpyLocations: React.FC<CrownPropsMonster> = ({ setMonsterSpyPage }) => {
    const slideAnim = useMonsterRef(new CrownAnimMonster.Value(20)).current;
    
    const fadeAnim = useMonsterRef(new CrownAnimMonster.Value(0)).current;
    const spyScreenDis = CrownDimsMonster.get('window');

    useMonsterEffect(() => {
        CrownAnimMonster.parallel([
            CrownAnimMonster.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            CrownAnimMonster.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    return (
        <CrownVieMonster style={{ flex: 1 }}>
            <CrownVieMonster
                style={{
                    flexDirection: 'row',
                    width: spyScreenDis.width * 0.90546,
                    alignSelf: 'center',
                    alignItems: 'center',
                }}
            >
                <CrownTouchMonster
                    onPress={() => setMonsterSpyPage('Monster Home Screen')}
                    style={{
                        marginRight: spyScreenDis.width * 0.016,
                    }}
                >
                    <CrownImgMonster
                        source={require('../monsterSpyAssets/monsterSpyImages/monsterBackButton.png')}
                        style={{
                            width: spyScreenDis.width * 0.19,
                            height: spyScreenDis.height * 0.08,
                        }}
                        resizeMode="contain"
                    />
                </CrownTouchMonster>

                <CrownVieMonster
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        height: spyScreenDis.height * 0.07,
                        borderRadius: spyScreenDis.width * 0.059,
                        backgroundColor: '#91181D',
                        alignItems: 'center',
                    }}
                >
                    <CrownTxtMonster
                        style={{
                            fontWeight: 'bold',
                            color: '#F4B331',
                            fontSize: spyScreenDis.width * 0.05,
                        }}
                    >
                        LOCATIONS
                    </CrownTxtMonster>
                </CrownVieMonster>
            </CrownVieMonster>

            <CrownScrollMonster
                style={{
                    width: spyScreenDis.width * 0.90546,
                    alignSelf: 'center',
                }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: spyScreenDis.height * 0.1,
                }}
            >
                {monsterSpyLocationsAndThemes.map((monsterTheme, index) => (
                    <React.Fragment key={monsterTheme.id}>
                        <CrownAnimMonster.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            }}
                        >
                            <CrownVieMonster
                                style={{
                                    alignItems: 'center',
                                    marginTop: spyScreenDis.height * 0.04,
                                    borderColor: '#F48131',
                                    justifyContent: 'center',
                                    width: '100%',
                                    borderRadius: spyScreenDis.width * 0.08,
                                    height: spyScreenDis.height * 0.07,
                                    borderWidth: spyScreenDis.width * 0.019,
                                    backgroundColor: '#91181D',
                                    alignSelf: 'center',
                                    paddingHorizontal: spyScreenDis.width * 0.031,
                                }}
                            >
                                <CrownTxtMonster style={{
                                        textAlign: 'center',
                                        color: '#F4B331',
                                        fontWeight: 'bold',
                                        fontSize: spyScreenDis.width * 0.04444,
                                    }}
                                >
                                    {monsterTheme.monsterThemeName}
                                </CrownTxtMonster>
                            </CrownVieMonster>
                        </CrownAnimMonster.View>

                        <CrownAnimMonster.View
                            style={{
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            }}
                        >
                            <CrownVieMonster
                                style={{
                                    marginTop: spyScreenDis.height * 0.0210435,
                                    borderRadius: spyScreenDis.width * 0.05,
                                    alignItems: 'center',
                                    padding: spyScreenDis.width * 0.031,
                                    backgroundColor: '#91181D',
                                    alignSelf: 'center',
                                    width: spyScreenDis.width * 0.90546,
                                }}
                            >
                                {monsterTheme.monsterLocations.map((monsterLoc, locIndex) => (
                                    <CrownVieMonster
                                        key={locIndex}
                                        style={{ marginBottom: spyScreenDis.height * 0.015 }}
                                    >
                                        <CrownTxtMonster
                                            style={{
                                                textAlign: 'center',
                                                fontSize: spyScreenDis.width * 0.05,
                                                color: 'white',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {monsterLoc.monsterLocName}
                                        </CrownTxtMonster>
                                        <CrownTxtMonster
                                            style={{
                                                marginTop: spyScreenDis.height * 0.004,
                                                color: '#F4B331',
                                                fontWeight: '600',
                                                textAlign: 'center',
                                                fontSize: spyScreenDis.width * 0.04,
                                            }}
                                        >
                                            {monsterLoc.monsterLocDescription}
                                        </CrownTxtMonster>
                                    </CrownVieMonster>
                                ))}
                            </CrownVieMonster>
                        </CrownAnimMonster.View>
                    </React.Fragment>
                ))}
            </CrownScrollMonster>
        </CrownVieMonster>
    );
};

export default MonsterSpyLocations;
