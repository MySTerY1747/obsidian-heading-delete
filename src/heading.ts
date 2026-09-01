import { App, Editor, EditorPosition, HeadingCache, Loc, Notice } from "obsidian";

export function locToEditorPosition(loc: Loc): EditorPosition {
	return {
		ch: loc.col,
		line: loc.line,
	}
}

export function getCurrentHeading(headings: HeadingCache[] | undefined, currentLine: number): HeadingCache | null {
	if (headings === undefined) {
		return null;
	}

	let currentClosestHeading: HeadingCache | null = null;
	for (const heading of headings) {
		if (heading.position.start.line > currentLine) break;
		currentClosestHeading = heading;
	}
	return currentClosestHeading
}

export function getNextHeading(currentHeading: HeadingCache, headings: HeadingCache[]): HeadingCache | null {
	for (const heading of headings) {
		if (heading.position.start.line > currentHeading.position.start.line && heading.level <= currentHeading.level) {
			return heading;
		}
	}
	return null;
}

export function deleteCurrentHeading(editor: Editor, headings: HeadingCache[] | undefined) {

	if (headings === undefined) {
		new Notice('No headings found in current file');
		return;
	}

	let currentHeading = getCurrentHeading(headings, editor.getCursor().line);
	if (!currentHeading) {
		new Notice('No heading found in before cursor');
		return;
	}

	const nextHeading = getNextHeading(currentHeading, headings);

	const deleteFrom = locToEditorPosition(currentHeading.position.start);
	const deleteTo = nextHeading
		? locToEditorPosition(nextHeading.position.start)
		: {
			ch: 0,
			line: editor.lastLine() + 1
		};

	editor.replaceRange("", deleteFrom, deleteTo);
}

export function openHeadingPicker(app: App, editor: Editor, headings: HeadingCache[] | undefined) {
	// pass
}
