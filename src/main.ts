import {
	Editor,
	App,
	Notice,
	Plugin,
	MarkdownView,
	FuzzySuggestModal,
	HeadingCache
} from 'obsidian';
import { deleteAHeading, deleteCurrentHeading } from './heading';

export default class HeadingDeletePlugin extends Plugin {

	async onload() {

		this.addRibbonIcon('trash', 'Delete heading', (_evt: MouseEvent) => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (view == null) {
				new Notice('Error: no active view found.');
				return;
			}
			const currentFile = this.app.workspace.getActiveFile();
			if (currentFile == null) {
				new Notice('Error: no active file found.');
				return;
			}

			const context = this.app.metadataCache.getFileCache(currentFile);
			deleteCurrentHeading(view.editor, context?.headings);
		});

		this.addCommand({
			id: 'delete-current-heading',
			name: 'Delete current heading',
			editorCallback: (
				editor: Editor,
			) => {
				const currentFile = this.app.workspace.getActiveFile();
				if (currentFile == null) {
					new Notice('Error: no active file found.');
					return;
				}

				const context = this.app.metadataCache.getFileCache(currentFile);
				deleteCurrentHeading(editor, context?.headings);
			},
		});
		this.addCommand({
			id: 'delete-a-heading',
			name: 'Delete a heading',
			editorCallback: (
				editor: Editor,
			) => {
				const currentFile = this.app.workspace.getActiveFile();
				if (currentFile == null) {
					new Notice('Error: no active file found.');
					return;
				}


				const context = this.app.metadataCache.getFileCache(currentFile);
				if (context?.headings == undefined) {
					return;
				}
				new HeadingPicker(this.app, editor, context.headings).open();
			},
		});
	}
}

export class HeadingPicker extends FuzzySuggestModal<HeadingCache> {
	private editor: Editor;
	private headings: HeadingCache[];

	constructor(app: App, editor: Editor, headings: HeadingCache[]) {
		super(app);
		this.setTitle('Headings');
		this.editor = editor;
		this.headings = headings;
	}

	getItems(): HeadingCache[] {
		return this.headings;
	}

	getItemText(heading: HeadingCache): string {
		return "#".repeat(heading.level) + " " + heading.heading;
	}

	onChooseItem(heading: HeadingCache) {
		deleteAHeading(this.editor, heading, this.headings)
	}
}
