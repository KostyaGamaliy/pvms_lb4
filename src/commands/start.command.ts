import {Command} from "./command.class";
import {Markup, Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {DateTime} from "luxon"

const scheduleData: SheduleInterface[] = [
	{
		date: new Date(),
		data: {
			subject: "Математика",
			educator: "Иванова",
			time: "9:00 - 10:30"
		}
	},
	{
		date: new Date(),
		data: {
			subject: "Физика",
			educator: "Петров",
			time: "11:00 - 12:30"
		}
	},
	{
		date: new Date(new Date().setDate(new Date().getDate() - 1)),
		data: {
			subject: "История",
			educator: "Сидоров",
			time: "10:00 - 11:30"
		}
	},
	{
		date: new Date(new Date().setDate(new Date().getDate() + 1)),
		data: {
			subject: "Химия",
			educator: "Кузнецова",
			time: "9:30 - 11:00"
		}
	}
];

function getScheduleForToday(): SheduleInterface[] {
	const today = new Date();
	const scheduleForToday: SheduleInterface[] = scheduleData.filter(item => {
		const itemDate = new Date(item.date);
		return itemDate.getFullYear() === today.getFullYear() &&
			itemDate.getMonth() === today.getMonth() &&
			itemDate.getDate() === today.getDate();
	});
	return scheduleForToday;
}

function getScheduleForYesterday(): SheduleInterface[] {
	const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
	const scheduleForYesterday: SheduleInterface[] = scheduleData.filter(item => {
		const itemDate = new Date(item.date);
		return itemDate.getFullYear() === yesterday.getFullYear() &&
			itemDate.getMonth() === yesterday.getMonth() &&
			itemDate.getDate() === yesterday.getDate();
	});
	return scheduleForYesterday;
}

function getScheduleForTomorrow(): SheduleInterface[] {
	const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
	const scheduleForTomorrow: SheduleInterface[] = scheduleData.filter(item => {
		const itemDate = new Date(item.date);
		return itemDate.getFullYear() === tomorrow.getFullYear() &&
			itemDate.getMonth() === tomorrow.getMonth() &&
			itemDate.getDate() === tomorrow.getDate();
	});
	return scheduleForTomorrow;
}


function getScheduleForWeek(): SheduleInterface[] {
	const today = DateTime.local();
	const weekStart = today.startOf('week');
	const weekEnd = today.endOf('week');
	
	const scheduleForWeek: SheduleInterface[] = scheduleData.filter(item => {
		const itemDate = DateTime.fromJSDate(item.date);
		return itemDate >= weekStart && itemDate <= weekEnd;
	});
	
	scheduleForWeek.sort((a, b) => {
		return DateTime.fromJSDate(a.date).diff(DateTime.fromJSDate(b.date)).milliseconds;
	});
	
	return scheduleForWeek;
}

export interface SheduleInterface {
	date: Date;
	data: SheduleData;
}

export interface SheduleData {
	subject: string;
	educator: string;
	time: string;
}

export class StartCommand extends Command {
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	
	handle(): void {
		this.bot.start((ctx) => {
			console.log(ctx.session)
			let buttons ;
			if (ctx.session.isSubscribe) {
				buttons = [
					Markup.button.callback("Розклад", "show_schedule_today"),
					Markup.button.callback("👎 Відписатись", "unsubscribe"),
				]
			} else {
				buttons = [
					Markup.button.callback("Розклад", "show_schedule_today"),
					Markup.button.callback("👍 Підписатись", "subscribe"),
				]
			}
			
			ctx.reply("Hello, I'm a bot!", Markup.inlineKeyboard(buttons));
		})
		
		this.bot.action("show_schedule_today", async (ctx) => {
			const schedule = getScheduleForToday();
			let message = "Розклад на сьогодні:\n";
			schedule.forEach(item => {
				message += `${item.data.time}: ${item.data.subject} (${item.data.educator})\n`;
			});
			await ctx.reply(message, Markup.inlineKeyboard([
				Markup.button.callback("Розклад на неділю", "show_schedule_week"),
				Markup.button.callback("Розклад на завтра", "show_schedule_tomorrow"),
				Markup.button.callback("На головну", "back_to_main"),
			]));
		});
		
		this.bot.action("show_schedule_tomorrow", async (ctx) => {
			const schedule = getScheduleForTomorrow();
			let message = "Розклад на завтра:\n";
			schedule.forEach(item => {
				message += `${item.data.time}: ${item.data.subject} (${item.data.educator})\n`;
			});
			await ctx.reply(message, Markup.inlineKeyboard([
				Markup.button.callback("Розклад на неділю", "show_schedule_week"),
				Markup.button.callback("Розклад на сьогодні", "show_schedule_today"),
				Markup.button.callback("На головну", "back_to_main"),
			]));
		});
		
		this.bot.action("show_schedule_week", async (ctx) => {
			const schedule = getScheduleForWeek();
			let message = "Розклад на всю неділю:\n";
			schedule.forEach(item => {
				message += `${DateTime.fromJSDate(item.date).toFormat('yyyy.MM.dd')} ${item.data.time}: ${item.data.subject} (${item.data.educator})\n`;
			});
			await ctx.reply(message, Markup.inlineKeyboard([
				Markup.button.callback("Розклад на сьогодні", "show_schedule_today"),
				Markup.button.callback("Розклад на завтра", "show_schedule_tomorrow"),
				Markup.button.callback("На головну", "back_to_main"),
			]));
		});
		
		this.bot.action("back_to_main", async (ctx) => {
			await this.deleteMessage(ctx);
			
			let buttons ;
			if (ctx.session.isSubscribe) {
				buttons = [
					Markup.button.callback("Розклад", "show_schedule_today"),
					Markup.button.callback("👎 Відписатись", "unsubscribe"),
				]
			} else {
				buttons = [
					Markup.button.callback("Розклад", "show_schedule_today"),
					Markup.button.callback("👍 Підписатись", "subscribe"),
				]
			}
			
			const replyMessage = await ctx.reply("Hello, I'm a bot!", Markup.inlineKeyboard(buttons));
			
			ctx.session.messageId = replyMessage.message_id;
		});
		
		this.bot.action("subscribe", async (ctx) => {
			ctx.session.isSubscribe = true;
			const replyMessage = await ctx.reply("🤝 Дякуємо за підписку!", Markup.inlineKeyboard([
				Markup.button.callback("На головну", "back_to_main"),
			]));
			
			ctx.session.messageId = replyMessage.message_id;
		});
		
		this.bot.action("unsubscribe", async (ctx) => {
			ctx.session.isSubscribe = false;
			const replyMessage = await ctx.reply("Сподіваємося що ви оформите підписку на нас в майбутньому 😉", Markup.inlineKeyboard([
				Markup.button.callback("На головну", "back_to_main"),
			]));
			
			ctx.session.messageId = replyMessage.message_id;
		});
	}
	
	async deleteMessage(ctx: any) {
		const replyMessage = await ctx.reply("Зачекайте...");
		const messageId = replyMessage.message_id;
		if (messageId) {
			await ctx.deleteMessage(messageId);
			await ctx.deleteMessage(ctx.session.messageId);
			ctx.session.messageId = null;
		}
	}
}
