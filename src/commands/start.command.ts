import { Command } from "./command.class";
import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { DateTime } from "luxon"; // Импорт Luxon
import groupScheduleData from "../datas/groupSheduleData";

// Определение интерфейса ScheduleItem
interface ScheduleItem {
	date: Date;
	data: {
		subject: string;
		educator: string;
		time: string;
	}[];
}

export class StartCommand extends Command {
	private scheduleData: ScheduleItem[] = [];
	constructor(bot: Telegraf<IBotContext>) {
		super(bot);
	}
	
	handle(): void {
		this.bot.start(async (ctx) => {
			await ctx.reply('Введіть вашу групу:');
			ctx.session.state = 'waiting_group';
		});
		
		this.bot.on('text', async (ctx) => {
			if (ctx.session.state === 'waiting_group') {
				const userGroup = ctx.message.text.trim();
				const groupData = groupScheduleData.find(group => group.group === userGroup);
				if (groupData) {
					this.scheduleData = groupData.sheduleData;
					let buttons = []
					
					if (ctx.session.isSubscribe) {
						buttons = [
							Markup.button.callback('На сьогодні', 'show_schedule_today'),
							Markup.button.callback('На завтра', 'show_schedule_tomorrow'),
							Markup.button.callback('На тиждень', 'show_schedule_week'),
							Markup.button.callback('Ввести іншу групу', 'back_to_main'),
							Markup.button.callback('👎', 'unsubscribe'),
						]
					} else {
						buttons = [
							Markup.button.callback('На сьогодні', 'show_schedule_today'),
							Markup.button.callback('На завтра', 'show_schedule_tomorrow'),
							Markup.button.callback('На тиждень', 'show_schedule_week'),
							Markup.button.callback('Ввести іншу групу', 'back_to_main'),
							Markup.button.callback('👍', 'subscribe'),
						]
					}
					ctx.reply('Оберіть формат показу розкладу або поверніться назад до вибору групи:', Markup.inlineKeyboard(buttons));
					ctx.session.state = 'idle';
				} else {
					ctx.reply('Група не знайдена. Спробуйте ще раз:', Markup.inlineKeyboard([
						Markup.button.callback('Ввести групу повторно', 'back_to_main'),
					]));
				}
			}
		});
		
		this.bot.action("show_schedule_today", async (ctx) => {
			const today = DateTime.local().toFormat('yyyy-MM-dd');
			const todaySchedule = this.scheduleData.find(item => DateTime.fromJSDate(item.date).toFormat('yyyy-MM-dd') === today);
			if (todaySchedule) {
				const scheduleText = todaySchedule.data.map(item => `${item.subject} (${item.time}) - ${item.educator}`).join('\n');
				await ctx.reply(`Розклад на сьогодні:\n${scheduleText}`, Markup.inlineKeyboard([
					Markup.button.callback('На завтра', 'show_schedule_tomorrow'),
					Markup.button.callback('На тиждень', 'show_schedule_week'),
					Markup.button.callback('Ввести іншу групу', 'back_to_main'),
					ctx.session.isSubscribe ? Markup.button.callback('👎', 'unsubscribe') : Markup.button.callback('👍', 'subscribe'),
				]));
			} else {
				await ctx.reply('Розклад на сьогодні відсутній.');
			}
		});
		
		this.bot.action("show_schedule_tomorrow", async (ctx) => {
			const tomorrow = DateTime.local().plus({ days: 1 }).toFormat('yyyy-MM-dd');
			const tomorrowSchedule = this.scheduleData.find(item => DateTime.fromJSDate(item.date).toFormat('yyyy-MM-dd') === tomorrow);
			if (tomorrowSchedule) {
				const scheduleText = tomorrowSchedule.data.map(item => `${item.subject} (${item.time}) - ${item.educator}`).join('\n');
				await ctx.reply(`Розклад на завтра:\n${scheduleText}`, Markup.inlineKeyboard([
					Markup.button.callback('На сьогодні', 'show_schedule_today'),
					Markup.button.callback('На тиждень', 'show_schedule_week'),
					Markup.button.callback('Ввести іншу групу', 'back_to_main'),
					ctx.session.isSubscribe ? Markup.button.callback('👎', 'unsubscribe') : Markup.button.callback('👍', 'subscribe'),
				]));
			} else {
				await ctx.reply('Розклад на завтра відсутній.');
			}
		});
		
		this.bot.action("show_schedule_week", async (ctx) => {
			const today = DateTime.local().startOf('week');
			const endOfWeek = DateTime.local().endOf('week');
			const weekSchedule = this.scheduleData.filter(item => {
				const itemDate = DateTime.fromJSDate(item.date);
				return itemDate >= today && itemDate <= endOfWeek;
			});
			if (weekSchedule.length > 0) {
				const scheduleText = weekSchedule.map(day => {
					const formattedDate = DateTime.fromJSDate(day.date).toFormat('yyyy-MM-dd');
					const subjects = day.data.map(item => `${item.subject} (${item.time}) - ${item.educator}`).join('\n');
					return `\n${formattedDate}:\n${subjects}`;
				}).join('\n');
				await ctx.reply(`Розклад на тиждень:\n${scheduleText}`, Markup.inlineKeyboard([
					Markup.button.callback('На сьогодні', 'show_schedule_today'),
					Markup.button.callback('На завтра', 'show_schedule_tomorrow'),
					Markup.button.callback('Ввести іншу групу', 'back_to_main'),
					ctx.session.isSubscribe ? Markup.button.callback('👎', 'unsubscribe') : Markup.button.callback('👍', 'subscribe'),
				]));
			} else {
				await ctx.reply('Розклад на тиждень відсутній.');
			}
		});
		
		this.bot.action("back_to_main", async (ctx) => {
			await ctx.reply("Введите вашу группу");
			ctx.session.state = 'waiting_group';
		});
		
		this.bot.action("subscribe", async (ctx) => {
			ctx.session.isSubscribe = true;
			const replyMessage = await ctx.reply("Дякуємо за підписку! Уведіть ще раз вашу групу та оберіть щось інше 😉", Markup.inlineKeyboard([
				Markup.button.callback("Ввести групу", "back_to_main"),
			]));
			ctx.session.messageId = replyMessage.message_id;
		});
		
		this.bot.action("unsubscribe", async (ctx) => {
			ctx.session.isSubscribe = false;
			const replyMessage = await ctx.reply("Сподіваємося, що ви підпишитесь на нас в майбутньому 😊", Markup.inlineKeyboard([
				Markup.button.callback("Ввести групу", "back_to_main"),
			]));
			ctx.session.messageId = replyMessage.message_id;
		});
	}
}
