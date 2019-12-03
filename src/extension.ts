import * as vscode from 'vscode';
import * as path from 'path';
import { getView } from './controller/handler';
import { ArticleProvider } from './controller/provider';
import { IConfigData } from './interfaces';

/**
 * Activates the extension.
 * 
 * @param context 
 * @category Extension
 */
export function activate(context: vscode.ExtensionContext) {
	// check if this is the first activation and prompt for reload
	if (!context.globalState.get("rv_first_install_check")) {
		vscode.window.showInformationMessage(`This seems to be the first activation of Reddit-Viewer.
		There is a problem that colored syntax highlighting is not loaded after a fresh install.
		To guarantee highlighting please reload the window`, "Reload")
			.then(_ => {
				vscode.commands.executeCommand("workbench.action.reloadWindow");
			})
		context.globalState.update("rv_first_install_check", true);
	}

	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	// check for widget options
	if (vscode.workspace.getConfiguration('RedditViewerWidget').get('Frontpage') || vscode.workspace.getConfiguration('RedditViewerWidget').get('Subreddit')) {
		// add provider to frontpage view
		if (vscode.workspace.getConfiguration('RedditViewerWidget').get('Frontpage')) {
			const frontpageProvider = new ArticleProvider("Frontpage", context);
			vscode.window.registerTreeDataProvider('Frontpage', frontpageProvider);
			// add refresh icon with refresh function
			vscode.commands.registerCommand('RedditViewerWidget.FrontpageRefresh', () => frontpageProvider.refresh());
			// add sortation functions
			vscode.commands.registerCommand('RedditViewerWidget.FrontpageBest', () => frontpageProvider.setSort("Frontpage", "best"));
			vscode.commands.registerCommand('RedditViewerWidget.FrontpageHot', () => frontpageProvider.setSort("Frontpage", "hot"));
			vscode.commands.registerCommand('RedditViewerWidget.FrontpageNew', () => frontpageProvider.setSort("Frontpage", "new"));
			vscode.commands.registerCommand('RedditViewerWidget.FrontpageControversial', () => frontpageProvider.setSort("Frontpage", "controversial"));
			vscode.commands.registerCommand('RedditViewerWidget.FrontpageTop', () => frontpageProvider.setSort("Frontpage", "top"));
			vscode.commands.registerCommand('RedditViewerWidget.FrontpageRising', () => frontpageProvider.setSort("Frontpage", "rising"));
		}
		// add provider to subreddit view
		if (vscode.workspace.getConfiguration('RedditViewerWidget').get('Subreddit')) {
			const subredditProvider = new ArticleProvider("Subreddit", context);
			vscode.window.registerTreeDataProvider('Subreddit', subredditProvider);
			// add refresh icon with refresh function
			vscode.commands.registerCommand('RedditViewerWidget.SubredditRefresh', () => subredditProvider.refresh());
			// add sortation functions
			vscode.commands.registerCommand('RedditViewerWidget.SubredditHot', () => subredditProvider.setSort("Subreddit", "hot"));
			vscode.commands.registerCommand('RedditViewerWidget.SubredditNew', () => subredditProvider.setSort("Subreddit", "new"));
			vscode.commands.registerCommand('RedditViewerWidget.SubredditControversial', () => subredditProvider.setSort("Subreddit", "controversial"));
			vscode.commands.registerCommand('RedditViewerWidget.SubredditTop', () => subredditProvider.setSort("Subreddit", "top"));
			vscode.commands.registerCommand('RedditViewerWidget.SubredditRising', () => subredditProvider.setSort("Subreddit", "rising"));
		}
	}

	/**
	 * Command to open Reddit-Viewer instance
	 * 
	 * @category Extension - Command
	 */
	let openRedditViewer = vscode.commands.registerCommand('RedditViewer.Open', () => {
		let panel: vscode.WebviewPanel;
		if (currentPanel) {
			// reuse the open panel
			panel = currentPanel;
		} else {

			// create the webview panel
			panel = vscode.window.createWebviewPanel(
				"redditviewer",
				<string>vscode.workspace.getConfiguration('RedditViewer').get('Title'),
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true
				}
			);
		}
		currentPanel = panel;

		// get the CSS stylesheet and format it to vscode uri
		let stylesheet = vscode.Uri.file(path.join(context.extensionPath, "styles", "redditViewer.css"));
		// create config object with all view creation relevant data
		let config: IConfigData = {
			stylesheet: panel.webview.asWebviewUri(stylesheet),
			context: context,
			cookie: context.globalState.get('cookie'),
			active_user: context.globalState.get('active_user'),
			command: "home",
			view: "home",
			subreddit: vscode.workspace.getConfiguration('RedditViewer').get('HomeFrontpageSubredditDefault')
		};
		// initial view load
		getView(config)
			.then(response => {
				panel.webview.html = response;
			})
			.catch(error => {
				// catch common errors
				if (error === "getaddrinfo ENOTFOUND reddit.com") {
					vscode.window.showErrorMessage("Error: no active connection to the internet.");
				} else {
					vscode.window.showErrorMessage(error);
				}
			});
		// catch messages send from webview
		panel.webview.onDidReceiveMessage(
			message => {
				config.command = message.command;
				config.view = message.view;
				config.args = message.args;
				getView(config)
					.then(response => {
						panel.webview.html = response;
					})
					.catch(error => {
						// catch common errors
						if (error === "getaddrinfo ENOTFOUND reddit.com") {
							vscode.window.showErrorMessage("Error: no active connection to the internet.");
						} else {
							vscode.window.showErrorMessage(error);
						}
					});
			}
		);
		// remove panel from currentPanel var on close
		panel.onDidDispose(
			() => {
				currentPanel = undefined;
			},
			null,
			context.subscriptions
		);
	});

	/**
	 * Command to open an article
	 * 
	 * @param subreddit
	 * @param article_id
	 * @category Extension - Command
	 */
	let openArticle = vscode.commands.registerCommand('RedditViewer.OpenArticle', (subreddit, article_id) => {
		let panel: vscode.WebviewPanel;
		if (currentPanel) {
			// reuse the open panel
			panel = currentPanel;
		} else {
			// create the webview panel
			panel = vscode.window.createWebviewPanel(
				"redditviewer",
				<string>vscode.workspace.getConfiguration('RedditViewer').get('Title'),
				vscode.ViewColumn.One,
				{
					enableScripts: true,
					retainContextWhenHidden: true
				}
			);
		}
		currentPanel = panel;


		// get the CSS stylesheet and format it to vscode uri
		let stylesheet = vscode.Uri.file(path.join(context.extensionPath, "styles", "redditViewer.css"));
		// create config object with all view creation relevant data
		let config: IConfigData = {};
		if (article_id) {
			config = {
				stylesheet: panel.webview.asWebviewUri(stylesheet),
				context: context,
				command: "article",
				subreddit: subreddit,
				article_id: article_id,
				view: "widget"
			};
		} else {
			// fallback
			config = {
				stylesheet: panel.webview.asWebviewUri(stylesheet),
				context: context,
				command: "article",
				subreddit: subreddit.data.subreddit,
				article_id: subreddit.data.id,
				view: "widget"
			};
		}
		// initial view load
		getView(config)
			.then(response => {
				panel.webview.html = response;
			})
			.catch(error => {
				// catch common errors
				if (error === "getaddrinfo ENOTFOUND reddit.com") {
					vscode.window.showErrorMessage("Error: no active connection to the internet.");
				} else {
					vscode.window.showErrorMessage(error);
				}
			});
		// catch messages send from webview
		panel.webview.onDidReceiveMessage(
			message => {
				config.command = message.command;
				config.view = message.view;
				config.args = message.args;
				getView(config)
					.then(response => {
						panel.webview.html = response;
					})
					.catch(error => {
						// catch common errors
						if (error === "getaddrinfo ENOTFOUND reddit.com") {
							vscode.window.showErrorMessage("Error: no active connection to the internet.");
						} else {
							vscode.window.showErrorMessage(error);
						}
					});
			}
		);
		// remove panel from currentPanel var on close
		panel.onDidDispose(
			() => {
				currentPanel = undefined;
			},
			null,
			context.subscriptions
		);
	});

	/**
	 * Command to open link in browser
	 * 
	 * @param permalink
	 * @category Extension - Command
	 */
	let openBrowser = vscode.commands.registerCommand('RedditViewer.OpenBrowser', (permalink) => {
		let url = "";
		if (permalink.kind) {
			url = "https://reddit.com" + permalink.data.permalink;
		} else {
			url = "https://reddit.com" + permalink;
		}
		vscode.env.openExternal(vscode.Uri.parse(url));
	});

	// add command
	context.subscriptions.push(openRedditViewer);
	context.subscriptions.push(openArticle);
	context.subscriptions.push(openBrowser);
}

/**
 * Is called on deactivation of extenstion
 * 
 * @category Extension
 */
export function deactivate() { }