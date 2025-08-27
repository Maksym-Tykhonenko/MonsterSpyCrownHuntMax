import monsterDataOnboarding from '../monsterSpyData/monsterDataOnboarding';
import { useNavigation as useCrownNav } from '@react-navigation/native';
import { fonts as crownFonts } from '../fonts';
import React, { useRef as useCrownRef, useEffect as useCrownEffect, useState as useCrownState, } from 'react';
import MonsterYellowBtn from '../monsterSpyComponents/MonsterYellowBtn';
import {
    Image as CrownImgMonster,
    View as CrownVieMonster,
    Animated as CrownAnimMonster,
    Text as CrownTxtMonster,
    Dimensions as CrownDimsMonster,
} from 'react-native';

const MonsterSpyOnboarding: React.FC = () => {
    const [crownSlide, setCrownSlide] = useCrownState(0);
    const crownScreen = CrownDimsMonster.get('window');
    const crownNav = useCrownNav();

    const fadeAnim = useCrownRef(new CrownAnimMonster.Value(0)).current;
    // анімація для появи текстового контейнера
    const slideAnim = useCrownRef(new CrownAnimMonster.Value(20)).current;

    useCrownEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(20);
        CrownAnimMonster.parallel([
            CrownAnimMonster.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
            CrownAnimMonster.timing(slideAnim, {
                toValue: 0,
                duration: 700,
                useNativeDriver: true,
            }),
        ]).start();
    }, [crownSlide]);

    const handleNextSlide = () => {
        if (crownSlide < monsterDataOnboarding.length - 1) {
            setCrownSlide(prev => prev + 1);
        } else {
            crownNav.replace?.('MonsterSpyPagesProvider');
        }
    };

    return (
        <CrownVieMonster style={{ flex: 1 }}>
            {/* фон */}
            <CrownImgMonster
                source={require('../monsterSpyAssets/monsterSpyImages/monsterBackgro.png')}
                style={{
                    top: 0,
                    width: crownScreen.width * 1.1,
                    height: crownScreen.height,
                    left: 0,
                    position: 'absolute',
                    zIndex: 0,
                }}
                resizeMode="cover"
            />
            {/* картинка слайду */}
            <CrownImgMonster
                source={monsterDataOnboarding[crownSlide].monsterImage}
                style={{
                    alignSelf: 'center',
                    position: 'absolute',
                    width: crownScreen.width * 1.03,
                    height: crownScreen.height,
                }}
                resizeMode="cover"
            />

            {/* текст + кнопка */}
            <CrownVieMonster
                style={{
                    alignItems: 'center',
                    bottom: crownScreen.height * 0.05,
                    position: 'absolute',
                    alignSelf: 'center',
                }}
            >
                <CrownAnimMonster.View
                    style={{
                        borderRadius: crownScreen.width * 0.05,
                        transform: [{ translateY: slideAnim }],
                        padding: crownScreen.width * 0.05,
                        alignSelf: 'center',
                        opacity: fadeAnim,
                        backgroundColor: '#91181D',
                        width: crownScreen.width * 0.84,
                    }}
                >
                    <CrownTxtMonster
                        style={{
                            textAlign: 'center',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            fontSize: crownScreen.width * 0.04,
                            color: '#F4B331',
                        }}
                    >
                        {monsterDataOnboarding[crownSlide].monsterText}
                    </CrownTxtMonster>
                </CrownAnimMonster.View>

                <MonsterYellowBtn
                    buttonWidth={crownScreen.width * 0.75}
                    onPress={handleNextSlide}
                    textStyle={{
                        color: '#91181D',
                        fontWeight: 'bold',
                        fontSize: crownScreen.width * 0.064,
                    }}
                    fontSize={crownScreen.width * 0.08}
                    monsterPropsText={'CONTINUE'}
                    buttonHeight={crownScreen.height * 0.1}
                    />
            </CrownVieMonster>
        </CrownVieMonster>
    );
};

export default MonsterSpyOnboarding;
