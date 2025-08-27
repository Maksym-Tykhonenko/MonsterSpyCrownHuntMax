import AsyncStorage from '@react-native-async-storage/async-storage';

import React, {
    type ReactNode,
    useMemo,
    useState,
    createContext,
    useEffect,
} from 'react';

type TUserPayload = Record<string, unknown> | null;

interface IUserSessionCtx {
    resetUser: () => Promise<void>;
    updateUser: (data: TUserPayload) => Promise<void>;
    userData: TUserPayload;
}

export const UserSessionContext = createContext<IUserSessionCtx>({
    resetUser: async () => { },
    updateUser: async () => { },
    userData: null,
});

type MonsterSpyUserContextProps = { children: ReactNode };

export const MonsterSpyUserContext: React.FC<MonsterSpyUserContextProps> = ({ children }) => {
    const SESSION_KEY = 'app_session_profile';
    
    const [userProfileState, changeUserProfileState] = useState<TUserPayload>(null);

    const loadProfileFromStorage = async () => {
        try {
            const snapshot = await AsyncStorage.getItem(SESSION_KEY);
            if (snapshot) {
                changeUserProfileState(JSON.parse(snapshot));
            }
        } catch (error) {
            if (__DEV__) console.warn('UserSession: load error', error);
        }
    };

    useEffect(() => {
        let active = true;
        (async () => {
            if (active) await loadProfileFromStorage();
        })();
        return () => {
            active = false;
        };
    }, []);

    const persistProfile = async (payload: TUserPayload) => {
        changeUserProfileState(payload);
        try {
            if (payload) {
                await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(payload));
            } else {
                await AsyncStorage.removeItem(SESSION_KEY);
            }
        } catch (error) {
            if (__DEV__) console.warn('UserSession: save error', error);
        }
    };

    const updateUser = async (data: TUserPayload) => {
        await persistProfile(data);
    };

    const resetUser = async () => {
        await persistProfile(null);
    };

    const contextBundle = useMemo(
        () => ({
            userData: userProfileState,
            updateUser,
            resetUser,
        }),
        [userProfileState]
    );

    return (
        <UserSessionContext.Provider value={contextBundle}>
            {children}
        </UserSessionContext.Provider>
    );
};
