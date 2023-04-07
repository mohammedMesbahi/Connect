export interface Post {
  _id: string
  owner: Owner,
  caption: string
  media?: string
  reactions: Reaction[],
  comments: Comment[],
  date: string,
}
export interface Owner {
  _id: string,
  name: string,
  avatar: string
}
export interface User {
  _id: string,
  name: string,
  email: string,
  avatar: string,
  password?: string,
  posts?: Post[],
  conversations: Conversation[],
  following?:string[],
  followers?:string[]

}
export interface Conversation {
  _id: string,
  participents: Owner[]
  messages: Message[],
  date: string
}
export interface Message {
  _id: string,
  sender: string,
  receivers: string[],
  content: string,
  seenBy: string[],
  date?: string,
}
export interface Reaction {
  _id: string
  owner: Owner,
  date: string,
}
export interface Comment {
  _id: string
  owner: Owner,
  commentText: string
  date: string,
  replays: Replay[]
}
export interface Replay {
  _id: string,
  owner: Owner,
  replayText: string
  date: string
}
export class Alert {
  id!: string;
  type!: AlertType;
  message!: string;
  autoClose!: boolean;
  keepAfterRouteChange!: boolean;
  fade!: boolean;

  constructor(init?: Partial<Alert>) {
    Object.assign(this, init);
  }
}
export interface Notification {
  _id: string,
  notifier: Owner,
  receivers: Owner[],
  type: string,
  notificationContent: string,
  url: string,
  date:string
}
export interface NotificationToSend {
  postId: string
  notifier: string,
  recipients: string[],
  type: string,
  notificationContent: string,
  body:Reaction|Comment
}
export enum AlertType {
  Success,
  Error,
  Info,
  Warning
}
export interface Data{
  conversationId:string,
  messages:string[]
}
export * from "./alert"
