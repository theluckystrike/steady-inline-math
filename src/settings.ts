import { PluginSettingTab, type SettingDefinitionItem } from 'obsidian';
import { sponsorsSettingItems } from './license/github-obsidian';
import { PRO_UI, isPro } from './pro';
import type SteadyInlineMathPlugin from './main';

export interface SteadyInlineMathSettings { enabled: boolean; folderRules: string }
export const DEFAULT_SETTINGS: SteadyInlineMathSettings = { enabled: true, folderRules: '' };
export function normalizeSettings(saved: Partial<SteadyInlineMathSettings> | null | undefined): SteadyInlineMathSettings {
	return { enabled: typeof saved?.enabled === 'boolean' ? saved.enabled : true, folderRules: typeof saved?.folderRules === 'string' ? saved.folderRules : '' };
}
export class SteadyInlineMathSettingTab extends PluginSettingTab {
	constructor(app: ConstructorParameters<typeof PluginSettingTab>[0], readonly owner: SteadyInlineMathPlugin) { super(app, owner); }
	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			...(this.owner.pro ? sponsorsSettingItems(this.owner.pro, PRO_UI) : []),
			{ name: 'Enable guard', desc: 'Add temporary braces while you edit an inline equation in Live Preview.', control: { type: 'toggle', key: 'enabled', defaultValue: true } },
			{ name: 'Folder rules (Pro)', desc: 'One rule per line. Use -Archive to skip a folder. Use +Archive/Study to enable a child folder. Outside the rules, the guard stays on.', control: { type: 'textarea', key: 'folderRules', defaultValue: '', disabled: () => !isPro() } },
		];
	}
	async setControlValue(key: string, value: unknown): Promise<void> {
		if (key === 'folderRules' && !isPro()) return;
		await super.setControlValue(key, value);
		this.owner.settings = normalizeSettings(this.owner.settings);
		this.owner.guard.refresh();
	}
}
