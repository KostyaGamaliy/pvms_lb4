import { IConfigService } from "./config.interface";
import { config, DotenvParseOutput } from "dotenv"

export class ConfigService implements IConfigService {
	private config: DotenvParseOutput;
	constructor() {
		const { error, parsed } = config();
		if (error) throw new Error("File .env does not exist");
		if (!parsed) throw new Error("File .env is empty");
		this.config = parsed;
	}
	get(key: string): string {
		const res = this.config[key]
		if (!res) throw new Error("There is no such key");
		
		return res;
	}
}