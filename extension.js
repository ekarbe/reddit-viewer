const vscode = require('vscode');
const path = require( 'path' );
const creator = require('./src/creator');

let config = vscode.workspace.getConfiguration('redditviewer');
let currentSubreddit = config.defaultSubreddit;
let currentSort = config.defaultSort;
let currentInterval = config.defaultInterval;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('extension.reddit', async function () {
		let panel = vscode.window.createWebviewPanel(
			'redditviewer',
			config.title,
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'public'))]
			}
		);

		creator.setStylesheetPath(vscode.Uri.file(path.join(context.extensionPath, 'public', 'reddit-viewer.css'))
		.with({ scheme: 'vscode-resource'}));
		
		if(config.landingPage){
		panel.webview.html = await creator.createLandingpageView(config);
		} else {
			panel.webview.html = await creator.createSubredditView(config.defaultSubreddit);
		}

		panel.webview.onDidReceiveMessage(
			async message => {
				switch (message.command) {
					case 'homeView':
						panel.webview.html = await creator.createLandingpageView(config);
						break;
					case 'subredditView':
						panel.webview.html = await creator.createSubredditView(currentSubreddit, currentSort, currentInterval);
						break;
					case 'search':
						if (message.text !== '') {
							currentSubreddit = message.text;
						}
						currentSort = config.defaultSort;
						currentInterval = config.defaultInterval;
						panel.webview.html = await creator.createSubredditView(currentSubreddit, currentSort, currentInterval);
						break;
					case 'sort':
						currentSort = message.text;
						panel.webview.html = await creator.createSubredditView(currentSubreddit, currentSort, currentInterval);
						break;
					case 'time':
						currentInterval = message.text;
						panel.webview.html = await creator.createSubredditView(currentSubreddit, currentSort, currentInterval);
						break;
					case 'article':
						let data = message.text.split(',');
						panel.webview.html = await creator.createArticleView(data[0], data[1]);
				}
			},
			undefined,
			context.subscriptions
		);
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
