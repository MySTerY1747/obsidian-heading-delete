# Heading Delete

Delete a heading and all of its content in one action.

## Features

* Delete the heading your cursor is currently on or inside.
* Choose a heading to delete from a searchable list.
* Available through commands, and a ribbon icon for quickly deleting the current heading.

## How to use

### Delete the current heading

Place your cursor on or inside the heading you want to delete, then:

* Use the **Delete current heading** command.
* Or click the **Delete Heading** ribbon icon.

The heading and everything belonging to it will be deleted, up to the next heading of the same or higher level.

For example:

```markdown
# Introduction

Some text.

## Background

More text.

## Goals

Even more text.

# Conclusion
```

Deleting `## Background` removes both the heading and `More text`, while leaving `## Goals` and everything after it intact.

### Choose a heading to delete

Use the **Delete a heading** command to open a searchable list of all headings in the current note.

The heading level is shown in the search results to make it easy to distinguish between headings with the same name.

Select a heading to delete it and all of its content.

## Commands

| Command                    | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| **Delete current heading** | Delete the heading the cursor is currently on or inside. |
| **Delete a heading**       | Open a searchable list and choose a heading to delete.   |

You can assign your own hotkeys to either command through **Settings →  Hotkeys**.

## Installation

### Community Plugins

1. Open **Settings →  Community plugins**.
2. Make sure Community plugins are enabled.
3. Search for **Heading Delete**.
4. Click **Install**.
5. Enable the plugin.

### Manual installation

Download the latest release and place `main.js`, `manifest.json`, and any other required release files into:

```text
YourVault/.obsidian/plugins/heading-delete/
```

Then enable **Heading Delete** under **Settings →  Community plugins**.

## License

Heading Delete is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contributing

Bug reports, suggestions, and contributions are welcome.

Please open an issue or pull request on the GitHub repository.

## Credit

Credit to [u/Adnan_Targaryen](https://www.reddit.com/user/Adnan_Targaryen/) for the plugin idea.
