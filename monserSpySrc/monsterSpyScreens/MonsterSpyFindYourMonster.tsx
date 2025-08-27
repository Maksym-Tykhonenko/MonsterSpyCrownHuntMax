import React, { useEffect, useState as useMonsterFinderState, useRef } from 'react';

import MonsterYellowBtn from '../monsterSpyComponents/MonsterYellowBtn';

import monsterSpyQuizData from '../monsterSpyData/monsterSpyWhichYourMonsterQ';

import monsterSpyCharacters from '../monsterSpyData/monstersSpy';



import {
    Text as MonsterSpyFinderText,

    View as MonsterSpyFinderView,

    ImageBackground as MonsterSpyFinderBackground,

    TouchableOpacity as MonsterSpyFinderTouch,

    Dimensions as MonsterSpyFinderDimensions,

    Image as MonsterSpyFinderImage,

} from 'react-native';



interface MonsterSpyFinderProps {
    setIsMonsterFinderStarted: (started: boolean) => void;
    isMonsterFinderStarted: boolean;
    setMonsterSpyPage: (page: string) => void;
}

const MonsterSpyFindYourMonster: React.FC<MonsterSpyFinderProps> = ({
    setMonsterSpyPage,
    isMonsterFinderStarted,
    setIsMonsterFinderStarted
}) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [quizStep, setQuizStep] = useMonsterFinderState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [identifiedMonsterId, setIdentifiedMonsterId] = useMonsterFinderState<number | null>(null);
    const [loadingMonster, setLoadingMonster] = useMonsterFinderState(false);
    const [loadingDots, setLoadingDots] = useMonsterFinderState('');
    const monsterScrSi = MonsterSpyFinderDimensions.get('window');
    const [chosenAnswers, setChosenAnswers] = useMonsterFinderState<number[]>([]);

    // Обробка відповіді
    const handleAnswerSelect = (answerId: number) => {
        const updatedAnswers = [...chosenAnswers, answerId];
        setChosenAnswers(updatedAnswers);

        if (quizStep < monsterSpyQuizData.length - 1) {
            setQuizStep(quizStep + 1);
        } else {
            setLoadingMonster(true);
            setLoadingDots('');
            let dotCounter = 0;
            intervalRef.current = setInterval(() => {
                dotCounter = (dotCounter + 1) % 4;
                setLoadingDots('.'.repeat(dotCounter));
            }, 250);

            timeoutRef.current = setTimeout(() => {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setLoadingDots('');
                // Визначення монстра
                const counts: { [key: number]: number } = {};
                updatedAnswers.forEach(id => {
                    counts[id] = (counts[id] || 0) + 1;
                });
                const maxCount = Math.max(...Object.values(counts));
                const maxIds = Object.keys(counts)
                    .filter(id => counts[Number(id)] === maxCount)
                    .map(id => Number(id));
                const selectedMonsterId = maxIds[Math.floor(Math.random() * maxIds.length)];
                setIdentifiedMonsterId(selectedMonsterId);
                setLoadingMonster(false);
            }, 3000);
        }
    };

    // Чистка таймерів
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // Рестарт
    const restartFinder = () => {
        setChosenAnswers([]);
        setQuizStep(0);
        setIdentifiedMonsterId(null);
        setIsMonsterFinderStarted(false);
    };

    return (
        <MonsterSpyFinderView style={{ flex: 1 }}>
            <MonsterSpyFinderView style={{
                alignItems: 'center',
                flexDirection: 'row',
                width: monsterScrSi.width * 0.91,
                alignSelf: 'center',
            }}>
                <MonsterSpyFinderTouch
                    onPress={() => setMonsterSpyPage('Monster Home Screen')}
                    style={{ marginRight: monsterScrSi.width * 0.016 }}
                >
                    <MonsterSpyFinderImage
                        source={require('../monsterSpyAssets/monsterSpyImages/monsterBackButton.png')}
                        style={{
                            width: monsterScrSi.width * 0.19,
                            height: monsterScrSi.height * 0.08,
                        }}
                        resizeMode="contain"
                    />
                </MonsterSpyFinderTouch>

                <MonsterSpyFinderView style={{
                    height: monsterScrSi.height * 0.07,
                    flex: 1,
                    alignItems: 'center',
                    backgroundColor: '#91181D',
                    borderRadius: monsterScrSi.width * 0.06,
                    justifyContent: 'center',
                }}>
                    <MonsterSpyFinderText style={{
                        fontWeight: 'bold',
                        color: '#F4B331',
                        fontSize: monsterScrSi.width * 0.05,
                    }}>
                        {!isMonsterFinderStarted
                            ? 'FIND YOUR MONSTER'
                            : identifiedMonsterId === null
                                ? loadingMonster
                                    ? `YOU ARE${loadingDots}`
                                    : `QUESTION ${quizStep + 1} / 12`
                                : 'YOU ARE...'}
                    </MonsterSpyFinderText>
                </MonsterSpyFinderView>
            </MonsterSpyFinderView>

            {/* Start Screen */}
            {!isMonsterFinderStarted && (
                <MonsterSpyFinderView style={{
                    alignItems: 'center',
                    width: monsterScrSi.width * 0.59,
                    bottom: monsterScrSi.height * 0.031,
                    alignSelf: 'center',
                    position: 'absolute',
                }} >
                    <MonsterYellowBtn
                        fontSize={monsterScrSi.width * 0.08}
                        onPress={() => setIsMonsterFinderStarted(true)}
                        buttonWidth={monsterScrSi.width * 0.7}
                        buttonHeight={monsterScrSi.height * 0.088}
                        monsterPropsText="START"
                        textStyle={{
                            color: '#91181D',
                            fontSize: monsterScrSi.width * 0.059,
                            fontWeight: 'bold',
                        }}
                    />
                </MonsterSpyFinderView>
            )}

            {/* Quiz Questions */}
            {isMonsterFinderStarted && identifiedMonsterId === null && !loadingMonster && (
                <MonsterSpyFinderView style={{ flex: 1 }}>
                    <MonsterSpyFinderView style={{
                        height: monsterScrSi.height * 0.064,
                        paddingHorizontal: monsterScrSi.width * 0.031,
                        backgroundColor: '#91181D',
                        borderRadius: monsterScrSi.width * 0.06,
                        width: monsterScrSi.width * 0.91,
                        marginTop: monsterScrSi.height * 0.05,
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                    }}>
                        <MonsterSpyFinderText style={{
                            fontSize: monsterScrSi.width * 0.05,
                            color: '#F4B331',
                            fontWeight: 'bold',
                        }} numberOfLines={1} adjustsFontSizeToFit>
                            {monsterSpyQuizData[quizStep].monsterTextForFindYourMonster}
                        </MonsterSpyFinderText>
                    </MonsterSpyFinderView>

                    <MonsterSpyFinderView style={{ marginTop: monsterScrSi.height * 0.08 }}>
                        {monsterSpyQuizData[quizStep].monsterFindOptions.map((option, index) => (
                            <MonsterSpyFinderTouch
                                key={index}
                                onPress={() => handleAnswerSelect(option.id)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderRadius: monsterScrSi.width * 0.064,
                                    alignSelf: 'center',
                                    paddingHorizontal: monsterScrSi.width * 0.031,
                                    marginVertical: monsterScrSi.height * 0.004,
                                    width: monsterScrSi.width * 0.91,
                                    backgroundColor: '#91181D',
                                    paddingVertical: monsterScrSi.height * 0.016,
                                }}>
                                <MonsterSpyFinderView style={{
                                    marginRight: monsterScrSi.width * 0.031,
                                    justifyContent: 'center',
                                    borderRadius: monsterScrSi.width * 0.1,
                                    backgroundColor: '#F4B331',
                                    alignItems: 'center',
                                    width: monsterScrSi.width * 0.089,
                                    height: monsterScrSi.width * 0.089,
                                }}>
                                    <MonsterSpyFinderText style={{
                                        fontSize: monsterScrSi.width * 0.05,
                                        color: 'white',
                                        fontWeight: '500',
                                    }}>
                                        {index + 1}
                                    </MonsterSpyFinderText>
                                </MonsterSpyFinderView>
                                <MonsterSpyFinderText style={{
                                    fontSize: monsterScrSi.width * 0.046,
                                    color: 'white',
                                    fontWeight: '500',
                                    maxWidth: monsterScrSi.width * 0.7,
                                }}>
                                    {option.monsterFindText}
                                </MonsterSpyFinderText>
                            </MonsterSpyFinderTouch>
                        ))}
                    </MonsterSpyFinderView>
                </MonsterSpyFinderView>
            )}

            {isMonsterFinderStarted && loadingMonster && (
                <MonsterSpyFinderView style={{justifyContent: 'center', alignItems: 'center', flex: 1,}}>
                    {/* Empty while dots animate */}
                </MonsterSpyFinderView>
            )}

            {/* Result Screen */}
            {isMonsterFinderStarted && identifiedMonsterId !== null && (
                <MonsterSpyFinderView style={{
                    marginTop: -monsterScrSi.height * 0.08,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                }}>
                    {(() => {
                        const monster = monsterSpyCharacters.find(m => m.id === identifiedMonsterId);
                        if (!monster) return null;
                        return (
                            <>
                                <MonsterSpyFinderBackground
                                    style={{
                                        alignSelf: 'center',
                                        alignItems: 'center',
                                        width: monsterScrSi.width * 0.91,
                                        justifyContent: 'center',
                                        paddingBottom: monsterScrSi.height * 0.03,
                                        minHeight: monsterScrSi.height * 0.59,
                                        padding: monsterScrSi.width * 0.05,
                                    }}
                                    source={require('../monsterSpyAssets/monsterSpyImages/monsterCardImage.png')}
                                    resizeMode="stretch"
                                >
                                    <MonsterSpyFinderImage
                                        source={monster.monsterImage}
                                        style={{
                                            width: monsterScrSi.width * 0.5,
                                            height: monsterScrSi.width * 0.5,
                                            marginBottom: monsterScrSi.height * 0.03,
                                            alignSelf: 'center',
                                        }}
                                        resizeMode="contain"
                                    />
                                    <MonsterSpyFinderText style={{
                                        textTransform: 'uppercase',
                                        color: '#91181D',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        marginBottom: monsterScrSi.height * 0.01,
                                        fontSize: monsterScrSi.width * 0.07,
                                        paddingHorizontal: monsterScrSi.width * 0.05,
                                    }} numberOfLines={1} adjustsFontSizeToFit>
                                        {monster.monsterName}
                                    </MonsterSpyFinderText>
                                </MonsterSpyFinderBackground>

                                <MonsterSpyFinderView style={{
                                    position: 'absolute',
                                    alignSelf: 'center',
                                    bottom: monsterScrSi.height * 0.05,
                                }}>
                                    <MonsterYellowBtn
                                        onPress={restartFinder}
                                        textStyle={{
                                            color: '#91181D',
                                            fontSize: monsterScrSi.width * 0.055,
                                            fontWeight: 'bold',
                                        }}
                                        fontSize={monsterScrSi.width * 0.05}
                                        buttonWidth={monsterScrSi.width * 0.7}
                                        buttonHeight={monsterScrSi.height * 0.08}
                                        monsterPropsText="HOME"
                                    />
                                </MonsterSpyFinderView>
                            </>
                        );
                    })()}
                </MonsterSpyFinderView>
            )}
        </MonsterSpyFinderView>
    );
};

export default MonsterSpyFindYourMonster;
