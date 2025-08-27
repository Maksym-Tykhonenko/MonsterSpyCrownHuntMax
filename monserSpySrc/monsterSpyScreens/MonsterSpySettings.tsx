import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState as useSpyState, useEffect, } from 'react';
import {
    Share,
    View as SpyMonsterView,
    Linking,
    TouchableOpacity as SpyMonsterTouch,
    Dimensions as SpyMonsterDimensions,
    Text as SpyMonsterText,
    Image as SpyMonsterImage,
    Platform,
} from 'react-native';


interface MonsterSpySettingsProps {setMonsterSpyPage: (screen: string) => void;}

const MonsterSpySettings: React.FC<MonsterSpySettingsProps> = ({ setMonsterSpyPage }) => {
    const [monsterSoundEnabled, setMonsterSoundEnabled] = useSpyState(true);
    // Стан для перемикачів
    
    const spyScreenSize = SpyMonsterDimensions.get('window');
    
    const [monsterMusicEnabled, setMonsterMusicEnabled] = useSpyState(true);
    
    // Завантаження станів з AsyncStorage
    useEffect(() => {
        (async () => {
            try {
                const storedMusic = await AsyncStorage.getItem('monsterSpyMusicEnabled');
                const storedSounds = await AsyncStorage.getItem('monsterSpySoundEnabled');

                if (storedMusic !== null) setMonsterMusicEnabled(storedMusic === 'true');
                if (storedSounds !== null) setMonsterSoundEnabled(storedSounds === 'true');
            } catch (err) {
                console.log('MonsterSpy settings load error:', err);
            }
        })();
    }, []);

    // Хендлери перемикання
    const toggleMonsterMusic = async () => {
        const updatedVal = !monsterMusicEnabled;
        setMonsterMusicEnabled(updatedVal);
        await AsyncStorage.setItem('monsterSpyMusicEnabled', updatedVal.toString());
    };

    const toggleMonsterSound = async () => {
        const updatedVal = !monsterSoundEnabled;
        setMonsterSoundEnabled(updatedVal);
        await AsyncStorage.setItem('monsterSpySoundEnabled', updatedVal.toString());
    };

    return (
        <SpyMonsterView style={{ flex: 1 }}>
            {/* Header */}
            <SpyMonsterView style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: spyScreenSize.width * 0.91,
                alignSelf: 'center',
            }}>
                <SpyMonsterTouch
                    onPress={() => setMonsterSpyPage('Monster Home Screen')}
                    style={{ marginRight: spyScreenSize.width * 0.016 }}
                >
                    <SpyMonsterImage
                        source={require('../monsterSpyAssets/monsterSpyImages/monsterBackButton.png')}
                        style={{
                            width: spyScreenSize.width * 0.19,
                            height: spyScreenSize.height * 0.08,
                        }}
                        resizeMode="contain"
                    />
                </SpyMonsterTouch>

                <SpyMonsterView style={{
                    height: spyScreenSize.height * 0.07,
                    justifyContent: 'center',
                    flex: 1,
                    backgroundColor: '#91181D',
                    borderRadius: spyScreenSize.width * 0.06,
                    alignItems: 'center',
                }}>
                    <SpyMonsterText style={{
                        fontSize: spyScreenSize.width * 0.05,
                        color: '#F4B331',
                        fontWeight: 'bold',
                    }}>
                        SETTINGS
                    </SpyMonsterText>
                </SpyMonsterView>
            </SpyMonsterView>

            {/* Налаштування */}
            {['NOTIFICATIONS', 'SOUNDS', 'SHARE THE APP'].map((option) => {
                if (option === 'SOUNDS' && Platform.OS === 'android') return null;
                return (
                <SpyMonsterView
                    key={option}
                    style={{
                        alignSelf: 'center',
                        width: spyScreenSize.width * 0.91,
                        alignItems: 'center',
                        flexDirection: 'row',
                    }}
                >
                    <SpyMonsterView style={{
                        borderWidth: spyScreenSize.width * 0.019,
                        borderColor: '#F48131',
                        paddingHorizontal: spyScreenSize.width * 0.03,
                        justifyContent: 'center',
                        marginVertical: spyScreenSize.height * 0.021,
                        borderRadius: spyScreenSize.width * 0.08,
                        flex: 1,
                        height: spyScreenSize.height * 0.08,
                        marginRight: spyScreenSize.width * 0.016,
                        alignItems: 'flex-start',
                        backgroundColor: '#91181D',
                    }}>
                        <SpyMonsterText style={{
                            textAlign: 'left',
                            fontSize: spyScreenSize.width * 0.044,
                            color: '#F4B331',
                            fontWeight: 'bold',
                        }}>
                            {option}
                        </SpyMonsterText>
                    </SpyMonsterView>

                    {option === 'NOTIFICATIONS' && (
                        <SpyMonsterTouch onPress={toggleMonsterMusic}>
                            <SpyMonsterImage
                                source={
                                    monsterMusicEnabled
                                        ? require('../monsterSpyAssets/monsterSpyImages/monsterMusicOn.png')
                                        : require('../monsterSpyAssets/monsterSpyImages/monsterMusicOff.png')
                                }
                                style={{
                                    width: spyScreenSize.width * 0.19,
                                    height: spyScreenSize.height * 0.08,
                                }}
                                resizeMode="contain"
                            />
                        </SpyMonsterTouch>
                    )}

                    {option === 'SOUNDS' && (
                        <SpyMonsterTouch onPress={toggleMonsterSound}>
                            <SpyMonsterImage
                                source={
                                    monsterSoundEnabled
                                        ? require('../monsterSpyAssets/monsterSpyImages/monsterMusicOn.png')
                                        : require('../monsterSpyAssets/monsterSpyImages/monsterMusicOff.png')
                                }
                                style={{
                                    width: spyScreenSize.width * 0.19,
                                    height: spyScreenSize.height * 0.08,
                                }}
                                resizeMode="contain"
                            />
                        </SpyMonsterTouch>
                    )}

                    {option === 'SHARE THE APP' && (
                        <SpyMonsterTouch
                            onPress={() => {
                                Share.share({
                                    message: 'Join the Monster Spy: Crown Hunt adventure! Download now and start your quest!',
                                });
                            }}
                        >
                            <SpyMonsterImage
                                source={require('../monsterSpyAssets/monsterSpyImages/monsterShareApp.png')}
                                style={{
                                    width: spyScreenSize.width * 0.19,
                                    height: spyScreenSize.height * 0.08,
                                }}
                                resizeMode="contain"
                            />
                        </SpyMonsterTouch>
                    )}
                </SpyMonsterView>
            );
            })}

            {/* Terms of Use */}
            <SpyMonsterTouch
                style={{
                    position: 'absolute',
                    width: spyScreenSize.width * 0.59,
                    justifyContent: 'center',
                    backgroundColor: '#91181D',
                    alignItems: 'center',
                    borderRadius: spyScreenSize.width * 0.08,
                    height: spyScreenSize.height * 0.08,
                    alignSelf: 'center',
                    borderWidth: spyScreenSize.width * 0.019,
                    borderColor: '#F48131',
                    marginVertical: spyScreenSize.height * 0.021,
                    bottom: spyScreenSize.height * 0.05,
                    paddingHorizontal: spyScreenSize.width * 0.03,
                }}
                onPress={() => Linking.openURL('https://www.termsfeed.com/live/0d2a35b3-4359-42a0-b930-c20a0c75617b')}
            >
                <SpyMonsterText style={{
                    fontWeight: 'bold',
                    fontSize: spyScreenSize.width * 0.044,
                    textAlign: 'center',
                    color: '#F4B331',
                }}>
                    TERMS OF USE
                </SpyMonsterText>
            </SpyMonsterTouch>
        </SpyMonsterView>
    );
};

export default MonsterSpySettings;
