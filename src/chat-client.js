import WebSocket from 'reconnecting-websocket';

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

const chatClient = {

    /**
     * Inits the chat connection with the server
     * @param {string} token the google auth session token
     */
    init(token) {
        ws = new WebSocket(`${chatServerUrl}/${token}`);
        ws.addEventListener('message', handleMessage);
    },

    /**
     * Fetch the users list from server.
     * @return {Promise} resolves to an array of users:
     * {
     *     fullName: string,
     *     avatar: string,
     *     name: string,
     *     familyName: string,
     *     email: string,
     *     id: string
     * }
     */
    getUsers() {
        return this.send({type: 'getUsers', receiver: 'server'});
    },

    /**
     * Sends a chat message to a recipient
     * @param {string} messageText
     * @param {string} receiver userId of the receiver. When not provided,
     * the message is sent to all the users
     */
    sendMessage(messageText, receiver = 'all') {
        return this.send({type: 'message', receiver, payload: {text: messageText}});
    },

    /**
     * Sends an action to the chat server
     * @param {object} action an action has the following form:
     * {
     *     type: string, // for example 'message'
     *     receiver: string, // the userId of the recipient or 'all'
     *     [sender]: string, // not needed, the server knows you
     *     [time]: number, // automatically set to current timestamp.
     *     payload: object, // any data associated with the event
     * }
     * @return {[type]} [description]
     */
    send(action) {
        action.time = action.time || Date.now();
        if (ws.readyState === CONNECTING) {
            setTimeout(() => this.send(action), 100);
        } else if (ws.readyState === OPEN) {
            ws.send(JSON.stringify(action));
        }
        return action;
    },

    /**
     * Registers a listener for a given event type
     * @param {string} event
     * @param {Function} listener will be called with every
     * chat event of the specified type received from the sever
     * @return {Function} dettach function to remove the event
     * listener.
     */
    on(event, listener) {
        if (event in listeners) {
            listeners[event].push(listener);
        } else {
            listeners[event] = [listener];
        }
        return () => this.off(event, listener);
    },

    /**
     * Dettached a previously registered listener
     * @param {string} event the event type
     * @param {Function} listenerToRemove
     */
    off(event, listenerToRemove) {
        if (event in listeners) {
            listeners[event] = listeners[event].filter(l => l !== listenerToRemove);
        }
    },
};

window.chatClient = chatClient;

export default chatClient;