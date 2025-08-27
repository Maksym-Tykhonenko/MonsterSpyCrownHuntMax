import React, {
  useLayoutEffect as useCrownLayout,
  useEffect as useCrownEffect,
  useRef as useCrownRef,
} from 'react';
import {
  Dimensions as CrownDims,
  Image as CrownSpyImg,
  Easing as CrownEase,
  Animated as CrownAnim,
  View as CrownSpyContainer,
} from 'react-native';
import { Text as CrownSpyTxt } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation as useCrownNav } from '@react-navigation/native';

const KEY_CROWN_ONBOARD = 'crown_hunt_user_onboarding';
const KEY_CROWN_SAFETY  = 'crown_hunt_ack_safety';

const CrownHuntLoading: React.FC = () => {
  const screenSize = CrownDims.get('window');
  const navigation = useCrownNav();

  // ==== Анімаційні значення
  const crownScale = useCrownRef(new CrownAnim.Value(0.9)).current; // старт з трохи меншого
  const textFade   = useCrownRef(new CrownAnim.Value(0)).current;

  // Збережемо ref на цикл, щоб уміти його зупинити при анмаунті
  const loopRef = useCrownRef<CrownAnim.CompositeAnimation | null>(null);

  // Безкінечне «підстрибування» корони
  useCrownEffect(() => {
    // пульс: 0.9 -> 1.05 -> 0.9 (spring + timing)
    const loop = CrownAnim.loop(
      CrownAnim.sequence([
        CrownAnim.spring(crownScale, {
          toValue: 1.05,
          tension: 90,
          friction: 6,
          useNativeDriver: true,
        }),
        CrownAnim.timing(crownScale, {
          toValue: 0.9,
          duration: 450,
          easing: CrownEase.inOut(CrownEase.ease),
          useNativeDriver: true,
        }),
      ]),
      { resetBeforeIteration: true }
    );

    loopRef.current = loop;
    loop.start();

    // одноразовий fade-in тексту
    CrownAnim.timing(textFade, {
      toValue: 1,
      duration: 2200,
      easing: CrownEase.inOut(CrownEase.ease),
      useNativeDriver: true,
    }).start();

    // зупиняємо цикл, якщо екран зникає
    return () => {
      loopRef.current?.stop();
      loopRef.current = null;
    };
  }, [crownScale, textFade]);

  // Логіка маршрутизації (коли перейдете — цикл зупиниться у cleanup)
  useCrownLayout(() => {
    (async () => {
      let goToOnboarding = false;
      let goToSafety = false;

      try {
        const [onboardFlag, safetyFlag] = await Promise.all([
          AsyncStorage.getItem(KEY_CROWN_ONBOARD),
          AsyncStorage.getItem(KEY_CROWN_SAFETY),
        ]);

        if (!onboardFlag) {
          goToOnboarding = true;
          await AsyncStorage.setItem(KEY_CROWN_ONBOARD, 'done');
        } else if (!safetyFlag || safetyFlag === 'false') {
          goToSafety = true;
        }
      } catch (err) {
        if (__DEV__) console.log('CrownHuntLoading error', err);
      }

      // 🔓 Розкоментуйте, коли будете переходити далі
      // setTimeout(() => {
      //   if (goToOnboarding) {
      //     navigation.replace('MonsterSpyOnboarding');
      //   } else {
      //     navigation.replace('MonsterSpyPagesProvider');
      //   }
      // }, 3000);
    })();
  }, [navigation]);

  return (
    <CrownSpyContainer style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Фон */}
      <CrownSpyImg
        source={require('../monsterSpyAssets/monsterSpyImages/monsterLoadingSpy.png')}
        style={{ position: 'absolute', width: screenSize.width, height: screenSize.height }}
        resizeMode="cover"
      />

      {/* Корона з безкінечним scale-пульсом */}
      <CrownAnim.View style={{ transform: [{ scale: crownScale }] }}>
        <CrownSpyImg
          source={require('../monsterSpyAssets/monsterSpyImages/monsterCrownImage.png')}
          style={{ width: screenSize.width * 0.44, height: screenSize.height * 0.25 }}
          resizeMode="contain"
        />
      </CrownAnim.View>

      {/* Fade-in текст унизу */}
      <CrownAnim.View
        style={{
          position: 'absolute',
          bottom: screenSize.height * 0.05,
          opacity: textFade,
        }}
      >
        <CrownSpyTxt
          style={{
            color: '#fff',
            textAlign: 'center',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: screenSize.width * 0.059,
          }}
        >
          Monster Spy{'\n'}Crown Hunt
        </CrownSpyTxt>
      </CrownAnim.View>
    </CrownSpyContainer>
  );
};

export default CrownHuntLoading;

