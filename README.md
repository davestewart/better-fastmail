# Better FastMail

<p style="text-align: center; overflow: hidden;">
<img src="https://repository-images.githubusercontent.com/480079782/f0e3767c-7b90-4ce1-9bd9-a897a0731577" style="margin: -10% 0">
</p>

## Overview

The FastMail web client is fantastic, but has a few usability issues that could be improved:

- Common [keyboard shortcuts](https://www.fastmail.help/hc/en-us/articles/360058753534-Keyboard-shortcuts) are not exactly intuitive
- The editor component does not [properly support indented text](https://twitter.com/dave_stewart/status/1512472229220700171)
- The main menu takes too many clicks to switch accounts


## Improvements

### Better UI

Folders

- Nesting indentation is more obvious

Editor

- Blockquote styling has been reset so indents look like indents (and not quoted replies)

Main Menu

- Switch users directly from the main menu dropdown

### Better shortcuts

> Note that `Mod` (short for "modifier") is `Cmd` on Mac and `Ctrl` on PC

List navigation

- `Up`                          - Previous item
- `Down`                        - Next item
- `Backspace`                   - Delete item

List selection

- `Shift`+`Up/Down`             - Expand/contract selection
- `Space`                       - Toggle item selection
- `Escape`                      - Cancel selection

Archiving

- `Mod`+`Up`                    - Archive mail item and read previous
- `Mod`+`Down`                  - Archive mail item and read next
                          
Folders

- `Alt`+`Up`                    - Previous folder
- `Alt`+`Down`                  - Next folder
- `Alt`+`Left`                  - Close folder
- `Alt`+`Right`                 - Open folder

Editor

- `Tab`                        - Indent blockquote / list item
- `Shift`+`Tab`                - Outdent blockquote / list item

Main menu

- `Mod`+`Click` "Switch Users" - add new user
- `Click` new user             - switch to user
- `Mod`+`Click` new user       - delete user

## Installation

You will need to reload any loaded FastMail webmail client pages after installation.

### From the web store

Visit the [Chrome Web Store](https://chrome.google.com/webstore/category/extensions) and search for [Better FastMail](https://chrome.google.com/webstore/search/better%20fastmail), then click the "Add to Chrome" button.

### From a local folder

Download and unzip, or clone the repository to a folder you won't move, then:

1. in Chrome, go Window > Extensions
2. Toggle the "Developer mode" switch on
3. Click the "Load unpacked" button
4. Navigate to the folder you just unzipped (which contains the `manifest.json` file)
5. Click the "Select" button in the dialog
