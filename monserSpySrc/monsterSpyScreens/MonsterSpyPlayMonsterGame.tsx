import { ScrollView as UniqueMonsterScrollView } from 'react-native-gesture-handler';
import monsterSpyLocationsAndThemes from '../monsterSpyData/monsterSpyLocationsAndThemes';
import monstersSpy from '../monsterSpyData/monstersSpy';
import { Alert as UniqueMonsterAlert } from 'react-native';
import {
    TextInput as UniqueMonsterTextInput,
    Modal as UniqueMonsterModal,
    TouchableOpacity as UniqueMonsterTouchable,
    Animated as UniqueMonsterAnimated,
    Text as UniqueMonsterText,
    ImageBackground as UniqueMonsterImageBackground,
    View as UniqueMonsterView,
    Image as UniqueMonsterImage,
    Dimensions as UniqueMonsterDimensions,
} from 'react-native';

import MonsterYellowBtn from '../monsterSpyComponents/MonsterYellowBtn';
import { BlurView as UniqueMonsterBlurView } from '@react-native-community/blur';

import React, { useEffect as useUniqueEffect, useState as useUniqueState, useRef as useUniqueRef } from 'react';

interface UniqueMonsterGameProps {
    setMonsterSpyPage: (page: string) => void;
}

const MonsterSpyPlayMonsterGame: React.FC<UniqueMonsterGameProps> = ({
    setMonsterSpyPage: setUniqueMonsterSpyPage,
}) => {
    const uniqueScreen = UniqueMonsterDimensions.get('window');
    const [isSetupPhase, setIsSetupPhase] = useUniqueState(false);
    const [isGamePhase, setIsGamePhase] = useUniqueState(false);
    const [isTimerActive, setIsTimerActive] = useUniqueState(false);
    const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useUniqueState(false);
    const [uniquePlayers, setUniquePlayers] = useUniqueState([{ name: 'Player 1' }]);
    const [uniqueRoles, setUniqueRoles] = useUniqueState<any[]>([]);
    const [activePlayerIndex, setActivePlayerIndex] = useUniqueState(0);
    const [isCardRevealed, setIsCardRevealed] = useUniqueState(false);
    const [uniqueLocation, setUniqueLocation] = useUniqueState<string | null>(null);
    const [isThiefRevealed, setIsThiefRevealed] = useUniqueState(false);
    const uniqueScrollRef = useUniqueRef<any>(null);
    const [themeIndex, setThemeIndex] = useUniqueState(0);
    const [isPauseModalVisible, setIsPauseModalVisible] = useUniqueState(false);
    const themeDropdownAnim = useUniqueRef(new UniqueMonsterAnimated.Value(0)).current;
    const [timerValue, setTimerValue] = useUniqueState(60);

    // Animate dropdown open/close
    useUniqueEffect(() => {
        UniqueMonsterAnimated.timing(themeDropdownAnim, {
            toValue: isThemeDropdownOpen ? 1 : 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [isThemeDropdownOpen]);

    // Add player and scroll to end
    const handleAddUniquePlayer = () => {
        if (uniquePlayers.length < 6) {
            setUniquePlayers(prevPlayers => {
                const newPlayersArr = [...prevPlayers, { name: `Player ${prevPlayers.length + 1}` }];
                setTimeout(() => {
                    uniqueScrollRef.current?.scrollToEnd({ animated: true });
                }, 100);
                return newPlayersArr;
            });
        }
    };

    // Remove player by index
    const handleRemoveUniquePlayer = (idx: number) => {
        if (uniquePlayers.length > 1) {
            setUniquePlayers(prevPlayers => prevPlayers.filter((_, i) => i !== idx));
        }
    };

    // Handle name change
    const handleUniquePlayerNameChange = (idx: number, newName: string) => {
        setUniquePlayers(prevPlayers => {
            const updatedPlayers = [...prevPlayers];
            updatedPlayers[idx] = { ...updatedPlayers[idx], name: newName };
            return updatedPlayers;
        });
    };

    // Helper to randomize roles (no repeats, always one vampire, order preserved)
    const assignUniqueRolesToPlayers = () => {
        const uniqueVampire = monstersSpy.find(m => m.monsterName === 'Count Fangmore');
        if (!uniqueVampire) {
            UniqueMonsterAlert.alert('Error', 'Vampire character not found!');
            return [];
        }
        const uniqueOtherMonsters = monstersSpy.filter(m => m.monsterName !== 'Count Fangmore');
        const playerCount = uniquePlayers.length;
        if (playerCount > uniqueOtherMonsters.length + 1) {
            UniqueMonsterAlert.alert('Too many players for unique roles!');
            return [];
        }
        // Pick random index for vampire
        const vampireIdx = Math.floor(Math.random() * playerCount);
        // Shuffle monsters for assignment
        const shuffledMonstersArr = [...uniqueOtherMonsters].sort(() => Math.random() - 0.5);
        let monsterIdx = 0;
        const rolesArr: any[] = [];
        for (let i = 0; i < playerCount; i++) {
            if (i === vampireIdx) {
                rolesArr.push({
                    ...uniquePlayers[i],
                    monster: uniqueVampire,
                    isVampire: true,
                });
            } else {
                rolesArr.push({
                    ...uniquePlayers[i],
                    monster: shuffledMonstersArr[monsterIdx],
                    isVampire: false,
                });
                monsterIdx++;
            }
        }
        return rolesArr;
    };

    // Handle start game
    const handleStartUniqueGame = () => {
        if (uniquePlayers.length < 3) {
            UniqueMonsterAlert.alert('Minimum 3 players required!');
            return;
        }
        // Pick one random location for all (except vampire)
        const locationsArr =
            monsterSpyLocationsAndThemes[themeIndex] &&
                Array.isArray(monsterSpyLocationsAndThemes[themeIndex].monsterLocations)
                ? monsterSpyLocationsAndThemes[themeIndex].monsterLocations
                : [];
        let loc = null;
        if (locationsArr.length > 0) {
            const randomLocObj = locationsArr[Math.floor(Math.random() * locationsArr.length)];
            loc = randomLocObj.monsterLocName;
        }
        setUniqueLocation(loc);
        setUniqueRoles(assignUniqueRolesToPlayers());
        setIsSetupPhase(true);
        setActivePlayerIndex(0);
        setIsCardRevealed(false);
    };

    useUniqueEffect(() => {
        console.log('Players: ', uniquePlayers);
    }, [uniquePlayers]);

    useUniqueEffect(() => {
        let interval: any = null;
        // Таймер не йде, якщо isPauseModalVisible === true
        if (isTimerActive && timerValue > 0 && !isPauseModalVisible) {
            interval = setInterval(() => {
                setTimerValue(prev => prev - 1);
            }, 1000);
        }
        if ((timerValue === 0 || isPauseModalVisible) && interval) {
            clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerActive, timerValue, isPauseModalVisible]);

    const handleStartUniqueTimer = () => {
        setIsTimerActive(true);
        setTimerValue(60);
    };

    const handleNextUniqueDiscussion = () => {
        setIsTimerActive(false);
        setTimerValue(60);
    };

    const handleRevealUniqueThief = () => {
        setIsThiefRevealed(true);
    };

    const handleUniqueHome = () => {
        setIsThiefRevealed(false);
        setIsGamePhase(false);
        setIsSetupPhase(false);
        setUniqueRoles([]);
        setActivePlayerIndex(0);
        setIsCardRevealed(false);
        setUniqueLocation(null);
        setIsTimerActive(false);
        setTimerValue(60);
    };

    const uniqueThiefRole = uniqueRoles.find(r => r.isVampire);

    return (
        <UniqueMonsterView style={{ flex: 1 }}>
            <UniqueMonsterView style={{
                alignSelf: 'center',
                width: uniqueScreen.width * 0.90546,
                alignItems: 'center',
                flexDirection: 'row',
            }}>
                <UniqueMonsterTouchable
                    onPress={() => {
                        if (!isGamePhase) {
                            setUniqueMonsterSpyPage('Monster Home Screen');
                        } else {
                            setIsPauseModalVisible(true);
                        }
                    }}
                    style={{
                        marginRight: uniqueScreen.width * 0.016,
                    }}
                >
                    <UniqueMonsterImage
                        source={!isGamePhase
                            ? require('../monsterSpyAssets/monsterSpyImages/monsterBackButton.png')
                            : require('../monsterSpyAssets/monsterSpyImages/pauseMonster.png')
                        }
                        style={{
                            width: uniqueScreen.width * 0.19,
                            height: uniqueScreen.height * 0.08,
                        }}
                        resizeMode='contain'
                    />
                </UniqueMonsterTouchable>

                <UniqueMonsterView style={{
                    flex: 1,
                    alignItems: 'center',
                    height: uniqueScreen.height * 0.07,
                    backgroundColor: '#91181D',
                    borderRadius: uniqueScreen.width * 0.059,
                    justifyContent: 'center',
                }}>
                    <UniqueMonsterText style={{
                        fontSize: uniqueScreen.width * 0.05,
                        color: '#F4B331',
                        fontWeight: 'bold',
                        paddingHorizontal: uniqueScreen.width * 0.03,
                    }} numberOfLines={1} adjustsFontSizeToFit>
                        {!isSetupPhase
                            ? 'SET UP'
                            : !isGamePhase
                                ? 'ASSINING ROLES...'
                                : !isThiefRevealed ? 'DISCUSSION' : 'AND THE CROWN THIED IS...'}
                    </UniqueMonsterText>
                </UniqueMonsterView>
            </UniqueMonsterView>


            {!isSetupPhase && (
                <UniqueMonsterView style={{
                    flex: 1,
                    width: uniqueScreen.width * 0.90546,
                    alignSelf: 'center',
                }}>
                    <UniqueMonsterText style={{
                        marginTop: uniqueScreen.height * 0.04,
                        color: '#F4B331',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: uniqueScreen.width * 0.05,
                    }}>
                        CHOOSE THE LOCATION THEME FOR THIS GAME
                    </UniqueMonsterText>

                    {/* Theme dropdown */}
                    <UniqueMonsterView style={{
                        justifyContent: 'space-between',
                        width: uniqueScreen.width * 0.90546,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: uniqueScreen.height * 0.019,
                        alignSelf: 'center',
                    }}>
                        <UniqueMonsterTouchable
                            style={{
                                justifyContent: 'center',
                                borderRadius: uniqueScreen.width * 0.5,
                                backgroundColor: '#91181D',
                                width: uniqueScreen.width * 0.71,
                                alignItems: 'flex-start',
                                height: uniqueScreen.height * 0.064,
                            }}
                            activeOpacity={1}
                            onPress={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
                        >
                            <UniqueMonsterText style={{
                                paddingHorizontal: uniqueScreen.width * 0.05,
                                color: '#F4B331',
                                fontWeight: 'bold',
                                fontSize: uniqueScreen.width * 0.05,
                                textTransform: 'uppercase',
                                textAlign: 'center',
                            }}>
                                {monsterSpyLocationsAndThemes[themeIndex].monsterThemeName}
                            </UniqueMonsterText>
                        </UniqueMonsterTouchable>

                        <UniqueMonsterTouchable onPress={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}>
                            <UniqueMonsterImage
                                source={require('../monsterSpyAssets/monsterSpyImages/bottomArrowMonster.png')}
                                style={{
                                    width: uniqueScreen.width * 0.23,
                                    height: uniqueScreen.height * 0.064,
                                    transform: [{ rotate: isThemeDropdownOpen ? '180deg' : '0deg' }],
                                }}
                                resizeMode='contain'
                            />
                        </UniqueMonsterTouchable>
                    </UniqueMonsterView>

                    {/* Animated dropdown menu */}
                    <UniqueMonsterAnimated.View style={{
                        borderRadius: uniqueScreen.width * 0.05,
                        maxHeight: themeDropdownAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, uniqueScreen.height * 0.32],
                        }),
                        width: uniqueScreen.width * 0.71,
                        marginTop: uniqueScreen.height * 0.01,
                        alignSelf: 'center',
                        opacity: themeDropdownAnim,
                        overflow: 'hidden',
                        backgroundColor: '#91181D',
                    }}>
                        {monsterSpyLocationsAndThemes.map((theme, idx) => (
                            <UniqueMonsterTouchable
                                key={theme.id}
                                onPress={() => {
                                    setThemeIndex(idx);
                                    setIsThemeDropdownOpen(false);
                                }}
                                style={{
                                    borderBottomColor: '#F4B331',
                                    paddingHorizontal: uniqueScreen.width * 0.05,
                                    borderBottomWidth: idx !== monsterSpyLocationsAndThemes.length - 1 ? 1 : 0,
                                    backgroundColor: idx === themeIndex ? '#F4B331' : '#91181D',
                                    paddingVertical: uniqueScreen.height * 0.018,
                                }}
                            >
                                <UniqueMonsterText style={{
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    color: idx === themeIndex ? '#91181D' : '#F4B331',
                                    fontSize: uniqueScreen.width * 0.045,
                                }}>
                                    {theme.monsterThemeName}
                                </UniqueMonsterText>
                            </UniqueMonsterTouchable>
                        ))}
                    </UniqueMonsterAnimated.View>

                    <UniqueMonsterScrollView
                        ref={uniqueScrollRef}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: uniqueScreen.height * 0.10534,
                        }}>
                        <UniqueMonsterText style={{
                            textAlign: 'center',
                            color: '#F4B331',
                            fontWeight: 'bold',
                            marginTop: uniqueScreen.height * 0.04,
                            fontSize: uniqueScreen.width * 0.05,
                        }}>
                            ENTER PLAYERS
                        </UniqueMonsterText>

                        {/* Render all players */}
                        {uniquePlayers.map((player, idx) => (
                            <UniqueMonsterView
                                key={idx}
                                style={{
                                    justifyContent: 'space-between',
                                    width: uniqueScreen.width * 0.90546,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: uniqueScreen.height * 0.014,
                                    alignSelf: 'center',
                                }}>
                                <UniqueMonsterView style={{
                                    flexDirection: 'row',
                                    height: uniqueScreen.height * 0.064,
                                    justifyContent: 'center',
                                    backgroundColor: '#91181D',
                                    borderRadius: uniqueScreen.width * 0.5,
                                    alignItems: 'flex-center',
                                    width: uniqueScreen.width * 0.71,
                                }} activeOpacity={1}>
                                    <UniqueMonsterTextInput
                                        value={player.name}
                                        onChangeText={text => handleUniquePlayerNameChange(idx, text)}
                                        placeholder={`Player ${idx + 1}`}
                                        style={{
                                            paddingHorizontal: uniqueScreen.width * 0.05,
                                            fontSize: uniqueScreen.width * 0.05,
                                            flex: 1,
                                            fontWeight: 'bold',
                                            textAlign: 'left',
                                            textTransform: 'uppercase',
                                            color: '#F4B331',
                                        }}
                                        placeholderTextColor="#F4B331"
                                        maxLength={16}
                                    />
                                </UniqueMonsterView>

                                <UniqueMonsterTouchable
                                    onPress={() => handleRemoveUniquePlayer(idx)}
                                    disabled={uniquePlayers.length === 1}
                                    style={{ opacity: uniquePlayers.length === 1 ? 0.4 : 1 }}
                                >
                                    <UniqueMonsterImage
                                        source={require('../monsterSpyAssets/monsterSpyImages/monsterMinus.png')}
                                        style={{
                                            width: uniqueScreen.width * 0.21,
                                            height: uniqueScreen.height * 0.064,
                                        }}
                                        resizeMode='contain'
                                    />
                                </UniqueMonsterTouchable>
                            </UniqueMonsterView>
                        ))}

                        <UniqueMonsterTouchable
                            onPress={handleAddUniquePlayer}
                            disabled={uniquePlayers.length === 6}
                            style={{
                                alignSelf: 'center',
                                marginTop: uniqueScreen.height * 0.025,
                                opacity: uniquePlayers.length === 6 ? 0.4 : 1,
                            }}>
                            <UniqueMonsterImage
                                source={require('../monsterSpyAssets/monsterSpyImages/monsterPlus.png')}
                                style={{
                                    width: uniqueScreen.width * 0.25,
                                    height: uniqueScreen.height * 0.073,
                                }}
                                resizeMode='contain'
                            />
                        </UniqueMonsterTouchable>
                    </UniqueMonsterScrollView>


                    <UniqueMonsterView style={{
                        alignItems: 'center',
                        width: uniqueScreen.width * 0.59,
                        bottom: uniqueScreen.height * 0.031,
                        alignSelf: 'center',
                        position: 'absolute',
                    }} >
                        <MonsterYellowBtn
                            onPress={handleStartUniqueGame}
                            fontSize={uniqueScreen.width * 0.08}
                            buttonWidth={uniqueScreen.width * 0.7}
                            monsterPropsText={'START'}
                            textStyle={{
                                fontSize: uniqueScreen.width * 0.059,
                                fontWeight: 'bold',
                                color: '#91181D',
                            }}
                            buttonHeight={uniqueScreen.height * 0.08888}
                        />
                    </UniqueMonsterView>
                </UniqueMonsterView>
            )}

            {isSetupPhase && !isGamePhase && uniqueRoles.length > 0 && (
                <UniqueMonsterView style={{ flex: 1 }}>
                    {/* Card back or front */}
                    {!isCardRevealed ? (
                        <>
                            <UniqueMonsterImage
                                source={require('../monsterSpyAssets/monsterSpyImages/closedMonsterCard.png')}
                                style={{
                                    alignSelf: 'center',
                                    width: uniqueScreen.width * 0.90546,
                                    marginBottom: uniqueScreen.height * 0.03,
                                    minHeight: uniqueScreen.height * 0.59,
                                }}
                                resizeMode="contain"
                            />
                            <UniqueMonsterText style={{
                                paddingHorizontal: uniqueScreen.width * 0.05,
                                top: -uniqueScreen.height * 0.023,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: '#FFFFFF',
                                textTransform: 'uppercase',
                                fontSize: uniqueScreen.width * 0.08,
                            }} numberOfLines={1} adjustsFontSizeToFit>
                                {uniqueRoles[activePlayerIndex]?.name ?? ''}
                            </UniqueMonsterText>
                        </>
                    ) : (
                        <UniqueMonsterImageBackground
                            style={{
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: uniqueScreen.height * 0.59,
                                paddingBottom: uniqueScreen.height * 0.03,
                                width: uniqueScreen.width * 0.90546,
                                alignSelf: 'center',
                                padding: uniqueScreen.width * 0.05,
                                marginTop: uniqueScreen.height * 0.03,
                            }}
                            source={require('../monsterSpyAssets/monsterSpyImages/monsterCardImage.png')}
                            resizeMode='stretch'
                        >
                            <UniqueMonsterImage
                                source={uniqueRoles[activePlayerIndex]?.monster?.monsterImage}
                                style={{
                                    width: uniqueScreen.width * 0.5,
                                    height: uniqueScreen.width * 0.5,
                                    marginBottom: uniqueScreen.height * 0.03,
                                    alignSelf: 'center',
                                }}
                                resizeMode="contain"
                            />
                            <UniqueMonsterText style={{
                                paddingHorizontal: uniqueScreen.width * 0.05,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                marginBottom: uniqueScreen.height * 0.01,
                                color: '#AD2FC1',
                                fontSize: uniqueScreen.width * 0.07,
                                textTransform: 'uppercase',
                            }} numberOfLines={1} adjustsFontSizeToFit>
                                {uniqueRoles[activePlayerIndex]?.name ?? ''}
                            </UniqueMonsterText>
                            <UniqueMonsterText style={{
                                fontSize: uniqueScreen.width * 0.05,
                                color: '#91181D',
                                fontWeight: '700',
                                textAlign: 'center',
                                marginBottom: uniqueScreen.height * 0.01,
                                textTransform: 'uppercase',
                                paddingHorizontal: uniqueScreen.width * 0.05,
                            }} numberOfLines={1} adjustsFontSizeToFit>
                                {uniqueRoles[activePlayerIndex]?.monster?.monsterName ?? ''}
                            </UniqueMonsterText>
                            {!uniqueRoles[activePlayerIndex]?.isVampire && (
                                <UniqueMonsterView style={{
                                    borderWidth: uniqueScreen.width * 0.019,
                                    justifyContent: 'center',
                                    borderColor: '#F48131',
                                    backgroundColor: '#91181D',
                                    width: uniqueScreen.width * 0.7,
                                    height: uniqueScreen.height * 0.07,
                                    borderRadius: uniqueScreen.width * 0.07,
                                    marginTop: uniqueScreen.height * 0.025,
                                    alignItems: 'center',
                                }}>
                                    <UniqueMonsterText style={{
                                        fontSize: uniqueScreen.width * 0.044,
                                        color: '#F4B331',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                    }}>
                                        {uniqueLocation ?? ''}
                                    </UniqueMonsterText>
                                </UniqueMonsterView>
                            )}
                            {uniqueRoles[activePlayerIndex]?.isVampire && (
                                <UniqueMonsterView style={{
                                    marginTop: uniqueScreen.height * 0.025,
                                    paddingHorizontal: uniqueScreen.width * 0.03,
                                    justifyContent: 'center',
                                    backgroundColor: '#91181D',
                                    borderRadius: uniqueScreen.width * 0.07,
                                    borderColor: '#F48131',
                                    height: uniqueScreen.height * 0.08,
                                    width: uniqueScreen.width * 0.7,
                                    borderWidth: uniqueScreen.width * 0.019,
                                    alignItems: 'center',
                                }}>
                                    <UniqueMonsterText style={{
                                        fontSize: uniqueScreen.width * 0.044,
                                        color: '#F4B331',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                    }}>
                                        (You don't know the location)
                                    </UniqueMonsterText>
                                </UniqueMonsterView>
                            )}
                        </UniqueMonsterImageBackground>
                    )}

                    <UniqueMonsterView style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        bottom: uniqueScreen.height * 0.05,
                    }}>
                        <MonsterYellowBtn
                            fontSize={uniqueScreen.width * 0.05}
                            buttonHeight={uniqueScreen.height * 0.1}
                            buttonWidth={uniqueScreen.width * 0.7}
                            monsterPropsText={isCardRevealed ? 'GOT IT' : 'SHOW'}
                            textStyle={{
                                fontWeight: 'bold',
                                fontSize: uniqueScreen.width * 0.055,
                                color: '#91181D',
                            }}
                            onPress={isCardRevealed ? () => {
                                if (activePlayerIndex < uniqueRoles.length - 1) {
                                    setActivePlayerIndex(activePlayerIndex + 1);
                                    setIsCardRevealed(false);
                                } else {
                                    setIsGamePhase(true);
                                }
                            } : () => setIsCardRevealed(true)}
                        />
                    </UniqueMonsterView>
                </UniqueMonsterView>
            )}

            {isGamePhase && !isThiefRevealed && (
                <UniqueMonsterView style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: -uniqueScreen.height * 0.08,
                }}>
                    <UniqueMonsterView style={{
                        alignItems: 'center',
                        paddingHorizontal: uniqueScreen.width * 0.03,
                        marginTop: uniqueScreen.height * 0.025,
                        backgroundColor: '#91181D',
                        borderRadius: uniqueScreen.width * 0.1,
                        borderColor: '#F48131',
                        height: uniqueScreen.height * 0.1111,
                        width: uniqueScreen.width * 0.8,
                        borderWidth: uniqueScreen.width * 0.019,
                        justifyContent: 'center',
                    }}>
                        <UniqueMonsterText style={{
                            fontSize: uniqueScreen.width * 0.08,
                            color: '#F4B331',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                        }}>
                            {`${String(Math.floor(timerValue / 60)).padStart(2, '0')}:${String(timerValue % 60).padStart(2, '0')}`}
                        </UniqueMonsterText>
                    </UniqueMonsterView>

                    {/* Кнопки нижче показуються лише якщо isThiefRevealed === false */}
                    {!isThiefRevealed && (
                        <UniqueMonsterView style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            bottom: uniqueScreen.height * 0.05,
                        }}>
                            <MonsterYellowBtn
                                fontSize={uniqueScreen.width * 0.05}
                                buttonHeight={uniqueScreen.height * 0.1}
                                buttonWidth={uniqueScreen.width * 0.7}
                                monsterPropsText={isTimerActive && timerValue > 0 ? 'RUNNING...' : (timerValue === 0 ? 'NEXT DISCUSSION' : 'START')}
                                textStyle={{
                                    fontSize: uniqueScreen.width * 0.055,
                                    fontWeight: 'bold',
                                    color: '#91181D',
                                }}
                                onPress={() => {
                                    if (!isTimerActive && timerValue === 60) {
                                        handleStartUniqueTimer();
                                    } else if (timerValue === 0) {
                                        handleNextUniqueDiscussion();
                                    }
                                }}
                                disabled={isTimerActive && timerValue > 0}
                            />

                            {timerValue === 0 && (
                                <UniqueMonsterTouchable style={{
                                    alignSelf: 'center',
                                }} onPress={handleRevealUniqueThief}>
                                    <UniqueMonsterImage
                                        source={require('../monsterSpyAssets/monsterSpyImages/revealThiefButton.png')}
                                        style={{
                                            marginTop: uniqueScreen.height * 0.016,
                                            width: uniqueScreen.width * 0.68,
                                            height: uniqueScreen.height * 0.093,
                                        }}
                                        resizeMode='stretch'
                                    />
                                </UniqueMonsterTouchable>
                            )}
                        </UniqueMonsterView>
                    )}
                </UniqueMonsterView>
            )}

            {isGamePhase && isThiefRevealed && uniqueThiefRole && (
                <UniqueMonsterView style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <UniqueMonsterImageBackground
                        style={{
                            top: -uniqueScreen.height * 0.08,
                            alignItems: 'center',
                            flexDirection: 'column',
                            minHeight: uniqueScreen.height * 0.59,
                            alignSelf: 'center',
                            paddingBottom: uniqueScreen.height * 0.03,
                            width: uniqueScreen.width * 0.90546,
                            justifyContent: 'center',
                            padding: uniqueScreen.width * 0.05,
                        }}
                        source={require('../monsterSpyAssets/monsterSpyImages/monsterCardImage.png')}
                        resizeMode='stretch'
                    >
                        <UniqueMonsterImage
                            source={uniqueThiefRole.monster.monsterImage}
                            style={{
                                marginBottom: uniqueScreen.height * 0.03,
                                alignSelf: 'center',
                                height: uniqueScreen.width * 0.5,
                                width: uniqueScreen.width * 0.5,
                            }}
                            resizeMode="contain"
                        />
                        <UniqueMonsterText style={{
                            paddingHorizontal: uniqueScreen.width * 0.05,
                            color: '#AD2FC1',
                            textTransform: 'uppercase',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            marginBottom: uniqueScreen.height * 0.01,
                            fontSize: uniqueScreen.width * 0.07,

                        }} numberOfLines={1} adjustsFontSizeToFit>
                            {uniqueThiefRole.name}
                        </UniqueMonsterText>
                        <UniqueMonsterText style={{
                            paddingHorizontal: uniqueScreen.width * 0.05,
                            color: '#91181D',
                            marginBottom: uniqueScreen.height * 0.01,
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            fontWeight: '700',
                            fontSize: uniqueScreen.width * 0.05,
                        }} numberOfLines={1} adjustsFontSizeToFit>
                            {uniqueThiefRole.monster.monsterName}
                        </UniqueMonsterText>
                    </UniqueMonsterImageBackground>
                    <UniqueMonsterView style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        bottom: uniqueScreen.height * 0.05,
                    }}>
                        <MonsterYellowBtn
                            onPress={handleUniqueHome}

                            fontSize={uniqueScreen.width * 0.05}

                            buttonHeight={uniqueScreen.height * 0.1}

                            buttonWidth={uniqueScreen.width * 0.7}

                            monsterPropsText={'HOME'}

                            textStyle={{
                                color: '#91181D',

                                fontSize: uniqueScreen.width * 0.055,

                                fontWeight: 'bold',
                            }}
                        />
                    </UniqueMonsterView>
                </UniqueMonsterView>
            )}

            <UniqueMonsterModal
                onRequestClose={() => setIsPauseModalVisible(false)}
                animationType="fade"
                visible={isPauseModalVisible}
                transparent
            >
                <UniqueMonsterView style={{
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.35)',
                    alignItems: 'center',
                    flex: 1,
                }}>
                    <UniqueMonsterBlurView style={{
                        top: 0,
                        width: uniqueScreen.width,
                        height: uniqueScreen.height,
                        position: 'absolute',
                        alignItems: 'center',
                        left: 0,
                        justifyContent: 'center',
                        flex: 1,
                    }} blurType="dark" blurAmount={3} />

                    <UniqueMonsterImageBackground
                        source={require('../monsterSpyAssets/monsterSpyImages/pauseModalBg.png')}
                        style={{
                            width: uniqueScreen.width * 0.85,
                            height: uniqueScreen.height * 0.35,
                        }}
                        resizeMode="stretch"
                    >
                        <UniqueMonsterView style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <UniqueMonsterView style={{
                                alignSelf: 'center',
                                backgroundColor: '#91181D',
                                alignItems: 'center',
                                justifyContent: 'center',
                                top: uniqueScreen.height * 0.025,
                                width: uniqueScreen.width * 0.7,
                                borderRadius: uniqueScreen.width * 0.05,
                                paddingVertical: uniqueScreen.height * 0.0160435,
                            }}>
                                <UniqueMonsterText style={{
                                    paddingHorizontal: uniqueScreen.width * 0.04,
                                    textAlign: 'center',
                                    fontSize: uniqueScreen.width * 0.04,
                                    fontWeight: 'bold',
                                    color: '#F4B331',
                                }}>
                                    THE INVESTIGATION IS ON HOLD.{"\n"}DON'T LET THE CROWN THIEF SLIP AWAY WHILE YOU'RE RESTING!
                                </UniqueMonsterText>
                            </UniqueMonsterView>
                            <UniqueMonsterView style={{
                                bottom: -uniqueScreen.height * 0.04,
                                justifyContent: 'center',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: uniqueScreen.height * 0.03,
                                position: 'absolute',
                            }}>
                                <UniqueMonsterTouchable
                                    onPress={() => {
                                        setIsPauseModalVisible(false);
                                        handleUniqueHome();
                                    }}
                                    style={{ marginHorizontal: uniqueScreen.width * 0.05 }}
                                >
                                    <UniqueMonsterImage
                                        source={require('../monsterSpyAssets/monsterSpyImages/pauseHomeBtn.png')}
                                        style={{
                                            width: uniqueScreen.width * 0.21,
                                            height: uniqueScreen.height * 0.1,
                                        }}
                                        resizeMode="contain"
                                    />
                                </UniqueMonsterTouchable>
                                <UniqueMonsterTouchable
                                    onPress={() => setIsPauseModalVisible(false)}
                                    style={{ marginHorizontal: uniqueScreen.width * 0.05 }}
                                >
                                    <UniqueMonsterImage
                                        source={require('../monsterSpyAssets/monsterSpyImages/pausePlayBtn.png')}
                                        style={{
                                            height: uniqueScreen.height * 0.1,
                                            width: uniqueScreen.width * 0.21,
                                        }}
                                        resizeMode="contain"
                                    />
                                </UniqueMonsterTouchable>
                            </UniqueMonsterView>
                            <UniqueMonsterTouchable
                                onPress={() => setIsPauseModalVisible(false)}
                                style={{
                                    position: 'absolute',
                                    top: uniqueScreen.height * 0.05,
                                    right: uniqueScreen.width * 0.0,
                                }}
                            >
                                <UniqueMonsterImage
                                    source={require('../monsterSpyAssets/monsterSpyImages/pauseCloseBtn.png')}
                                    style={{
                                        height: uniqueScreen.height * 0.04,
                                        width: uniqueScreen.height * 0.04,
                                    }}
                                    resizeMode="contain"
                                />
                            </UniqueMonsterTouchable>
                        </UniqueMonsterView>
                    </UniqueMonsterImageBackground>
                </UniqueMonsterView>
            </UniqueMonsterModal>
        </UniqueMonsterView>
    );
};

export default MonsterSpyPlayMonsterGame;