const vscode = require('vscode');
const path = require( 'path' );
const creator = require('./src/creator');
const logger = require('./src/logger');

let config = vscode.workspace.getConfiguration('redditviewer');
let currentSubreddit;
let currentSort = config.defaultSort;
let currentInterval = config.defaultInterval;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let disposable = vscode.commands.registerCommand('extension.reddit', function () {
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
			creator.createLandingpageView(config)
				   .then(response => {
					   panel.webview.html = response;
				   })
				   .catch(error => {
					   logger.error(error);
				   })
		} else {
			creator.createSubredditView(config.defaultSubreddit, config.defaultSort, config.defaultInterval)
				   .then(response => {
					   panel.webview.html = response;
				   })
				   .catch(error => {
					   logger.error = error;
				   })
		}

		panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'homeView':
						creator.createLandingpageView(config)
							   .then(response => {
								   panel.webview.html = response;
							   })
							   .catch(error => {
								   logger.error(error);
							   })
						break;
					case 'subredditView':
						creator.createSubredditView(currentSubreddit, currentSort, currentInterval)
						       .then(response => {
								   panel.webview.html = response;
							   })
							   .catch(error => {
								   logger.error(error);
							   })
						break;
					case 'search':
						if (message.text !== '') {
							currentSubreddit = message.text;
						} else {
							currentSubreddit = config.defaultSubreddit;
						}
						currentSort = config.defaultSort;
						currentInterval = config.defaultInterval;
						creator.createSubredditView(currentSubreddit, currentSort, currentInterval)
						       	.then(response => {
						        	panel.webview.html = response;
								})
								.catch(error => {
									logger.error(error);
								})
						break;
					case 'sort':
						currentSort = message.text;
						creator.createSubredditView(currentSubreddit, currentSort, currentInterval)
						       .then(response => {
								   panel.webview.html = response;
							   })
							   .catch(error => {
								   logger.error(error);
							   })
						break;
					case 'time':
						currentInterval = message.text;
						creator.createSubredditView(currentSubreddit, currentSort, currentInterval)
							   .then(response => {
									panel.webview.html = response;
							   })
							   .catch(error => {
								   logger.error(error);
							   })
						break;
					case 'article':
						let data = message.text.split(',');
						creator.createArticleView(data[0], data[1])
							   .then(response => {
								   panel.webview.html = response;
							   })
							   .catch(error => {
								   logger.error(error);
							   })
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
