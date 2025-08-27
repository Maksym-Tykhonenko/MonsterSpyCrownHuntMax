
import {
    Dimensions as SpyDimensionOfMonster,
    View as SpyVieOfMonster,
    Text as SpyTextOfMonster,
    Image as SpyImgOfMonster,
    TouchableOpacity as SpyTouchOfMonster,
} from 'react-native';

import React from 'react';

interface MonsterSpyRulesProps {
    setMonsterSpyPage: (page: string) => void;
}

const MonsterSpyRules: React.FC<MonsterSpyRulesProps> = ({ setMonsterSpyPage }) => {
    const spyScreenDis = SpyDimensionOfMonster.get('window');

    return (
        <SpyVieOfMonster style={{ flex: 1 }}>
            <SpyVieOfMonster style={{
                flexDirection: 'row',
                alignItems: 'center',
                width: spyScreenDis.width * 0.90546,
                alignSelf: 'center',
            }}>
                <SpyTouchOfMonster
                    onPress={() => setMonsterSpyPage('Monster Home Screen')}
                    style={{
                        marginRight: spyScreenDis.width * 0.016,
                    }}
                >
                    <SpyImgOfMonster
                        style={{
                            height: spyScreenDis.height * 0.08,
                            
                            width: spyScreenDis.width * 0.19,
                        }}
                        resizeMode='contain'
                        source={require('../monsterSpyAssets/monsterSpyImages/monsterBackButton.png')}
                    />
                </SpyTouchOfMonster>

                <SpyVieOfMonster style={{
                    height: spyScreenDis.height * 0.07,
                    justifyContent: 'center',
                    backgroundColor: '#91181D',
                    alignItems: 'center',
                    flex: 1,
                    borderRadius: spyScreenDis.width * 0.059,
                }}>
                    <SpyTextOfMonster style={{
                        color: '#F4B331',
                        fontWeight: 'bold',
                        fontSize: spyScreenDis.width * 0.05,
                    }}>
                        RULES
                    </SpyTextOfMonster>
                </SpyVieOfMonster>
            </SpyVieOfMonster>

            <SpyVieOfMonster style={{
                width: spyScreenDis.width * 0.90546,
                marginTop: spyScreenDis.height * 0.0210435,
                backgroundColor: '#91181D',
                borderRadius: spyScreenDis.width * 0.05,
                padding: spyScreenDis.width * 0.031,
                alignSelf: 'center',
                alignItems: 'center',
            }}>
                <SpyTextOfMonster style={{
                    fontWeight: 'bold',
                    color: '#F4B331',
                    fontSize: spyScreenDis.width * 0.04,

                }}>
                    {`In Monster Spy: Crown Hunt, every player receives a secret role 🎭. One is the cunning Vampire 🦇, the Crown Thief 👑, while the others are quirky monsters 🧟⚡🐺👻💀 who know exactly where the crown is hidden 🗝️. The game begins when players enter their nicknames ✏️ and choose a location theme 🏰🌲🎡. The crown’s hiding place is randomly selected 🎲 from that theme and revealed only to the monsters, leaving the Vampire in the dark 🌑.

Players pass the device 📱 around so each can discover their role in secret 🤫, and then the discussion rounds ⏳ begin. Use the timer ⏱️ to keep each round moving, ask questions 💬, and watch for clues 👀 in what others say. The Vampire listens carefully 👂, trying to figure out the exact location 📍, while the monsters work together 🤝 to mislead without revealing too much 🙊.

After the final round 🏁, the Vampire makes a guess 🎯. If they name the correct location ✅, they win the game 🏆. If not ❌, the monsters keep the crown safe 🔒 and claim victory 🎉.`}
                </SpyTextOfMonster>
            </SpyVieOfMonster>
        </SpyVieOfMonster>
    );
};

export default MonsterSpyRules;
