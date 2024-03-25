import {Context} from "telegraf";

export interface SessionData {
	getShedule: Array<any>;
	isSubscribe: boolean;
	messageId: number | null;
	state: string | null;
}

export interface IBotContext extends Context {
	session: SessionData;
}