import { App, Editor, EditorPosition, HeadingCache, Loc, Notice } from "obsidian";

function locToEditorPosition(loc: Loc): EditorPosition {
	return {
		ch: loc.col,
		line: loc.line,
	}
}

function getCurrentHeading(headings: HeadingCache[], currentLine: number): HeadingCache {
	return headings.reduce((currentBest, next) => {
		if (next.position.start.line > currentLine) return currentBest;
		if (currentBest === undefined || next.position.start.line > currentBest.position.start.line) return next;
		return currentBest;
	})
}

function getNextHeading(currentHeading: HeadingCache, headings: HeadingCache[]): HeadingCache | null {
	let passedCurrent = false;
	let nextHeading: HeadingCache | null = null;

	for (const heading of headings) {
		if (!passedCurrent) {
			if (heading != currentHeading) continue
			else {
				passedCurrent = true;
				continue;
			}
		}

		if (heading.level <= currentHeading.level) {
			nextHeading = heading;
			break;
		}
	}

	return nextHeading;
}

export function deleteCurrentSection(editor: Editor, headings: HeadingCache[] | undefined) {
	if (!headings) {
		new Notice('No headings found in current file');
		return;
	}

	const currentHeading = getCurrentHeading(headings, editor.getCursor().line);
	const nextHeading = getNextHeading(currentHeading, headings);

	const deleteFrom = locToEditorPosition(currentHeading.position.start);
	const deleteTo = nextHeading
		? locToEditorPosition(nextHeading.position.start)
		: {
			ch: 0,
			line: editor.lastLine()
		};

	editor.replaceRange("", deleteFrom, deleteTo);
}

export function openSectionPicker(app: App, editor: Editor, headings: HeadingCache[] | undefined) {
	// pass
}
