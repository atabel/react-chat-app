// @flow
import WebSocket from 'reconnecting-websocket';

type EventType = 'getUsers' | 'message' | 'user' | 'disconnect';

type MessagePayload = {
    text: string,
    media?: Object,
};

type UserPayload = {
    id: string,
    fullName: string,
    avatar: string,
    name: string,
    familyName: string,
    email: string,
};

type DisconnectPayload = string;

type MessageChatAction = {
    type: 'message',
    payload: MessagePayload,
    time?: number,
    receiver: string,
    sender?: string,
};
type GetUsersChatAction = {
    type: 'getUsers',
    receiver: 'server',
    time?: number,
};
type UserChatAction = {
    type: 'user',
    payload: UserPayload,
    time?: number,
    receiver: string,
    sender?: string,
};
type DisconnectChatAction = {
    type: 'disconnect',
    payload: DisconnectPayload,
    time?: number,
    receiver: string,
    sender?: string,
};

type ChatAction = MessageChatAction | GetUsersChatAction | UserChatAction | DisconnectChatAction;
type Listener<A: ChatAction> = (action: A) => void;

let ws;
const listeners = {};

const CONNECTING = 0;
const OPEN = 1;

const handleMessage = m => {
    const action = JSON.parse(m.data);
    (listeners[action.type] || []).forEach(l => l(action));
};

const dev = process.env.NODE_ENV !== 'production';
const PRODUCTION_CHAT_SERVER = 'wss://react-chat-server.herokuapp.com';
const DEV_CHAT_SERVER = 'ws://localhost:8080';
const chatServerUrl = dev ? DEV_CHAT_SERVER : PRODUCTION_CHAT_SERVER;

/**
 * Inits the chat connection with the server
 * @param {string} token the google auth session token
 */
const init = (token: string) => {
    ws = new WebSocket(`${chatServerUrl}/${token}`);
    ws.addEventListener('message', handleMessage);
};

/**
 * Sends an action to the chat server
 */
function send<A: ChatAction>(action: A): A {
    action.time = action.time || Date.now();
    if (ws.readyState === CONNECTING) {
        setTimeout(() => send(action), 100);
    } else if (ws.readyState === OPEN) {
        ws.send(JSON.stringify(action));
    }
    return action;
}

/**
 * Asks the server for the users list.
 */
const getUsers = (): GetUsersChatAction => {
    return send({type: 'getUsers', receiver: 'server'});
};

/**
 * Sends a chat message to a recipient (receiver)
 */
const sendMessage = (messageText: string, receiver: string = 'all'): MessageChatAction => {
    return send({type: 'message', receiver, payload: {text: messageText}});
};

/**
* Dettached a previously registered listener
* @param {string} event the event type
* @param {Function} listenerToRemove
*/
const off = (event: EventType, listenerToRemove: Listener<ChatAction>) => {
    if (event in listeners) {
        listeners[event] = listeners[event].filter(l => l !== listenerToRemove);
    }
};

/**
 * Registers a listener for a given event type
 * @return {Function} dettach function to remove the event listener.
 */
const on = (event: EventType, listener: Listener<ChatAction>) => {
    if (event in listeners) {
        listeners[event].push(listener);
    } else {
        listeners[event] = [listener];
    }
    return () => off(event, listener);
};

const chatClient = {init, send, sendMessage, getUsers, on, off};

window.chatClient = chatClient;

export default chatClient;
