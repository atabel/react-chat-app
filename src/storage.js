const STORAGE_VERSION = 1;

const getStorageKey = userId =>
    `CHAT_APP_V${STORAGE_VERSION}_${userId}`;

export const loadState = (userId) => {
    try {
        const storageKey = getStorageKey(userId);
        const serializedState = localStorage.getItem(storageKey);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        console.error('Error loading state from storage');
        return undefined;
    }
};

export const storeState = (state, userId) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(getStorageKey(userId), serializedState);
    } catch (err) {
        console.error('Error storing state');
    }
};