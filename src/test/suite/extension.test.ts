import * as assert from 'assert';

import * as vscode from 'vscode';
import * as extension from '../../extension';

suite('Extension Test Suite', () => {

	test('activate extension test', () => {
		vscode.commands.executeCommand('extension.reddit');
	});

});
