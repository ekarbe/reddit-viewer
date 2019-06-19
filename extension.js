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
	// register the Reddit command to start the extension
	let disposable = vscode.commands.registerCommand('extension.reddit', function () {
		// create the window with title from config
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
		
		// create the landing page if it's enabled in config
		if(config.landingPage){
			creator.createLandingpageView(config)
				   .then(response => {
					   panel.webview.html = response;
				   })
				   .catch(error => {
					   logger.error(error);
					 })
		// create the subreddit view with default settings if landing page is disabled
		} else {
			creator.createSubredditView(config.defaultSubreddit, config.defaultSort, config.defaultInterval)
				   .then(response => {
					   panel.webview.html = response;
				   })
				   .catch(error => {
					   logger.error = error;
				   })
		}

		// handle messages from extension frontend
		panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					// go back to landing page by creating it new
					case 'homeView':
						creator.createLandingpageView(config)
							   .then(response => {
								   panel.webview.html = response;
							   })
							   .catch(error => {
								   logger.error(error);
							   })
						break;
					// go back to subreddit view by creating it new with current settings
					case 'subredditView':
						creator.createSubredditView(currentSubreddit, currentSort, currentInterval)
						       .then(response => {
								   panel.webview.html = response;
							   })
							   .catch(error => {
								   logger.error(error);
							   })
						break;
					// create the subreddit view with given subreddit name
					case 'search':
						if (message.text !== '') {
							currentSubreddit = message.text;
						} else {
							currentSubreddit = config.defaultSubreddit;
						}
						// reset the sorting
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
					// set the sort and create the subreddit view with the new sort
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
					// set the interval and create the subreddit view with the new interval
					case 'interval':
						currentInterval = message.text;
						creator.createSubredditView(currentSubreddit, currentSort, currentInterval)
							   .then(response => {
									panel.webview.html = response;
							   })
							   .catch(error => {
								   logger.error(error);
							   })
						break;
					// open an article by creating the article view
					case 'article':
						// message is subreddit,articleID
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
