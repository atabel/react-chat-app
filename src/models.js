//@flow
export type Conversation = {
    id: string,
    fullName: string,
    avatar: string,
    name: string,
    familyName: string,
    email: string,
};

export type User = Conversation;

export type Message = {
    sender: string,
    receiver: string,
    text: string,
    time: number,
    media?: Object,
};
