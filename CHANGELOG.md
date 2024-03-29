# Change Log

All notable changes to the "reddit-viewer" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.0]

- Initial release

## [1.0.1]

- Removed unreleased features from help
- Added url to articles

## [1.1.0]

- Changed defaultSort and defaultInterval setting type to string
- Added sorting
- Added image preview

## [1.1.1]

- Changed settings type to string

## [1.1.2]

- Fixed disabled landingPage not opening anything

## [1.2.0]

- Better promise and error handling
- Added preview when clicking on let of an article
- Added support for more media
- Better media handling
- Added un/hideable root comments
- Added full comment chain support

## [1.2.1]

- Removed empty panel as it is never used
- Search triggered when enter is pressed

## [1.3.0]

- Added pagination
- Added highlighting of current sortation

## [1.3.1]

- Fixed wrong default value for default interval

## [1.3.2]

- Reset all temporary variables if window is closed
- Update configuration without reload

## [1.3.3]

- Removed undefined comments
- Added configuration validation

## [1.3.4]

- Migrated to new vscode package structure
- Removed unused tests

## [1.4.0]

- Added login panel
- Session cookie saves to globalState
- Added session checking
- Added logout
- Added request timeout setting
- Added user page
- Added option to disable user management
- Added basic collections
- Added media warning
- Changed background color

## [1.4.1]

- Added timestamp to articles
- Shrink package (removed images)

## [2.0.0]

- Migration of Version 1.4.1 from JavaScript to TypeScript
- Added webpack to bundle the extension
- Using the selftext_html attribute and raw_json option to show selftext as markdown
- Dynamic color styling (dark, light, high contrast)
- Using the editor settings for indentation and font styling
- Added the possibility to define new templates to add other code styles
- Added templates for TypeScript and PHP
- Added widget
- Added documentation

## [2.0.1]

- Fixed comment indentation
- Fixed cache error
- Decluttered
- Added install prompt

## [2.0.2]
- Removed commands from palette
- Removed context entries from other extensions

## [Unreleased]