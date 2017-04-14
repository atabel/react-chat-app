// @flow
const STORAGE_VERSION = 1;
const SESSION_TOKEN_STORAGE_KEY = 'CHAT_APP_SESSION_TOKEN';

const getStorageKey = userId => `CHAT_APP_V${STORAGE_VERSION}_${userId}`;

export const loadState = (userId: string): Object => {
    try {
        const storageKey = getStorageKey(userId);
        const serializedState = localStorage.getItem(storageKey);
        if (!serializedState) {
            return {};
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error(`Error loading state from storage`);
        return {};
    }
};

const tryStore = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch (err) {
        console.error(`Error storing ${key} => ${value}`);
    }
};

export const storeState = (state: Object, userId: string) => {
    const serializedState = JSON.stringify(state);
    tryStore(getStorageKey(userId), serializedState);
};

export const storeSession = (sessionToken: string, user: Object) => {
    const serializedSessionInfo = JSON.stringify({sessionToken, user});
    tryStore(SESSION_TOKEN_STORAGE_KEY, serializedSessionInfo);
};

export const loadSession = (): {sessionToken?: string, user?: Object} => {
    const serializedSessionInfo = localStorage.getItem(SESSION_TOKEN_STORAGE_KEY);
    return serializedSessionInfo ? JSON.parse(serializedSessionInfo) : {};
};
