import {
	Editor,
	MarkdownView,
	MarkdownFileInfo,
	Modal,
	Notice,
	Plugin,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	MyPluginSettings,
	SampleSettingTab,
} from './settings';
import { deleteCurrentSection, openSectionPicker } from './heading';

// Remember to rename these classes and interfaces!

export default class HeadingDeletePlugin extends Plugin {
	settings!: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// this.addRibbonIcon('trash', 'Delete Heading', (_evt: MouseEvent) => {
		// 	const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 	if (view) {
		// 		deleteCurrentSection(view.editor);
		// 	}
		// });

		this.addCommand({
			id: 'delete-current-heading',
			name: 'Delete current heading',
			editorCallback: (
				editor: Editor,
				_ctx: MarkdownView | MarkdownFileInfo,
			) => {
				const currentFile = this.app.workspace.getActiveFile();
				if (currentFile == null) {
					new Notice('Error: no active file found.');
					return;
				}

				const context = this.app.metadataCache.getFileCache(currentFile);
				deleteCurrentSection(editor, context?.headings);
			},
		});
		// this.addCommand({
		// 	id: 'delete-a-heading',
		// 	name: 'Delete a heading (list)',
		// 	editorCallback: (
		// 		editor: Editor,
		// 		_ctx: MarkdownView | MarkdownFileInfo,
		// 	) => {
		// 		if (this.app.workspace.getActiveViewOfType(MarkdownView)) {
		// 			openSectionPicker(this.app, editor)
		// 		}
		// 	},
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000),
		);
	}

	onunload() { }

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<MyPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
