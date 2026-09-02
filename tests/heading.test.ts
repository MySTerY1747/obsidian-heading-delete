import type { App, Editor, HeadingCache, Loc } from 'obsidian';
import { Notice } from 'obsidian';
import { locToEditorPosition, getCurrentHeading, getNextHeading, deleteCurrentHeading, deleteAHeading } from '../src/heading'
import { HeadingPicker } from "../src/main.ts"

jest.mock('obsidian');


function makeHeading(line: number, level: number): HeadingCache {
	return {
		heading: `Heading ${line}`,
		level,
		position: {
			start: {
				line,
				col: 0,
				offset: 0,
			},
			end: {
				line,
				col: 10,
				offset: 10,
			},
		},
	};
}

const headings = [
	makeHeading(2, 1),
	makeHeading(5, 2),
	makeHeading(10, 3),
	makeHeading(15, 2),
	makeHeading(20, 1),
];

function makeEditor(cursorLine: number, lastLine: number) {
	return {
		getCursor: jest.fn().mockReturnValue({
			line: cursorLine,
			ch: 0,
		}),
		lastLine: jest.fn().mockReturnValue(lastLine),
		replaceRange: jest.fn(),
	};
}

describe('getCurrentHeading', () => {
	test('returns null when headings is undefined', () => {
		const undefined_headings = undefined;
		const result = getCurrentHeading(undefined_headings, 1);
		expect(result).toBe(null);
	});

	test('returns null when headings is empty', () => {
		const empty_headings = [];
		const result = getCurrentHeading(empty_headings, 1);
		expect(result).toBe(null);
	});

	test('returns null when cursor before first heading', () => {
		const result = getCurrentHeading(headings, 1);
		expect(result).toBe(null);
	});

	test('returns first heading when cursor is after it', () => {
		const result = getCurrentHeading(headings, 3);
		expect(result).toBe(headings[0]);
	});
	test('returns most recent heading before cursor', () => {
		const result = getCurrentHeading(headings, 14);
		expect(result).toBe(headings[2]);
	});
});

describe('getNextHeading', () => {
	test('returns next heading of same level', () => {
		const result = getNextHeading(headings[0], headings);
		expect(result).toBe(headings[4]);
	});
	test('skips deeper headings', () => {
		const result = getNextHeading(headings[1], headings);
		expect(result).toBe(headings[3]);
	});

	test('returns next heading of higher level', () => {
		const result = getNextHeading(headings[2], headings);
		expect(result).toBe(headings[3]);
	});

	test('returns null when there is no next relevant heading', () => {
		const result = getNextHeading(headings[4], headings);
		expect(result).toBe(null);
	});
});

describe('locToEditorPosition', () => {
	test('converts Loc to EditorPosition object', () => {
		const loc: Loc = {
			line: 42,
			col: 17,
			offset: 4,
		};

		const result = locToEditorPosition(loc);

		expect(result).toEqual({
			line: 42,
			ch: 17,
		});
	});
});

describe('deleteAHeading', () => {
	test('deletes correct heading', () => {
		const editor = makeEditor(6, 30);

		deleteAHeading(editor as unknown as Editor, headings[1], headings);

		expect(editor.replaceRange).toHaveBeenCalledWith(
			'',
			{ line: 5, ch: 0 },
			{ line: 15, ch: 0 },
		);
	});
});


beforeEach(() => {
	jest.clearAllMocks();
});
describe('deleteCurrentHeading', () => {
	test('deletes through next same/parent heading', () => {
		const editor = makeEditor(6, 30);

		deleteCurrentHeading(editor as unknown as Editor, headings);

		expect(editor.replaceRange).toHaveBeenCalledWith(
			'',
			{ line: 5, ch: 0 },
			{ line: 15, ch: 0 },
		);
	});
	test('deletes through EOF', () => {
		const editor = makeEditor(22, 30);

		deleteCurrentHeading(editor as unknown as Editor, headings);

		expect(editor.replaceRange).toHaveBeenCalledWith(
			'',
			{ line: 20, ch: 0 },
			{ line: 31, ch: 0 },
		);
	});

	test('does nothing when no headings', () => {
		const editor = makeEditor(22, 30);

		deleteCurrentHeading(editor as unknown as Editor, []);

		expect(editor.replaceRange).not.toHaveBeenCalled();
	});


	test('reports missing headings', () => {
		const editor = makeEditor(22, 30);

		deleteCurrentHeading(editor as unknown as Editor, []);

		expect(editor.replaceRange).not.toHaveBeenCalled();
		expect(Notice).toHaveBeenCalledWith('No heading found before cursor',);
	});
});

describe('HeadingPicker', () => {
	test('getItems returns headings', () => {
		const editor = makeEditor(6, 30);
		const headingPicker = new HeadingPicker({} as App, editor as unknown as Editor, headings);

		expect(headingPicker.getItems()).toBe(headings);
	});

	test('getItemText returns level + name', () => {
		const editor = makeEditor(6, 30);
		const headingPicker = new HeadingPicker({} as App, editor as unknown as Editor, headings);

		expect(headingPicker.getItemText(headings[0])).toBe("# Heading 2");
	});


	test('onChooseItem deletes heading', () => {
		const editor = makeEditor(6, 30);
		const headingPicker = new HeadingPicker({} as App, editor as unknown as Editor, headings);

		headingPicker.onChooseItem(headings[1]);
		expect(editor.replaceRange).toHaveBeenCalledWith(
			'',
			{ line: 5, ch: 0 },
			{ line: 15, ch: 0 },
		);
	});
});

