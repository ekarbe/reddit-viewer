const vscode = require("vscode");
const path = require("path");
const creator = require("./src/creator");
const api = require("./src/api");
const logger = require("./src/logger");

let config = vscode.workspace.getConfiguration("redditviewer");
let currentSubreddit = config.defaultSubreddit;
let currentSort = config.defaultSort;
let currentInterval = config.defaultInterval;
let currentAfter = null;
let currentBefore = null;
let currentCount = 0;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // register the Reddit command to start the extension
  let disposable = vscode.commands.registerCommand(
    "extension.reddit",
    function() {
      let session = {
        active: false,
        username: context.globalState.get("activeUser"),
        cookie: context.globalState.get("cookie")
      };
      if (config.userManagement) {
        api
          .checkSession(session.cookie)
          .then(() => {
            session.active = true;
          })
          .catch(() => {
            session.active = false;
          });
      } else {
        session.username = undefined;
        session.cookie = undefined;
      }

      // create the window with title from config
      let panel = vscode.window.createWebviewPanel(
        "redditviewer",
        config.title,
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.file(path.join(context.extensionPath, "public"))
          ]
        }
      );

      creator.setStylesheetPath(
        vscode.Uri.file(
          path.join(context.extensionPath, "public", "reddit-viewer.css")
        ).with({ scheme: "vscode-resource" })
      );

      // create the landing page if it's enabled in config
      if (config.landingPage) {
        creator
          .createLandingpageView(config, session)
          .then(response => {
            panel.webview.html = response;
          })
          .catch(error => {
            logger.error(error);
          });
        // create the subreddit view with default settings if landing page is disabled
      } else {
        creator
          .createSubredditView({
            subreddit: config.defaultSubreddit,
            sort: config.defaultSort,
            interval: config.defaultInterval,
            limit: config.limitation,
            count: currentCount,
            after: null,
            before: null,
            session: session
          })
          .then(response => {
            panel.webview.html = response;
          })
          .catch(error => {
            logger.error = error;
          });
      }

      // handle messages from extension frontend
      panel.webview.onDidReceiveMessage(
        message => {
          let explodedString;
          let username;
          switch (message.command) {
            // go back to landing page by creating it new
            case "homeView":
              // reset  pagination
              currentAfter = null;
              currentBefore = null;
              currentCount = 0;

              creator
                .createLandingpageView(config, session)
                .then(response => {
                  panel.webview.html = response;
                })
                .catch(error => {
                  logger.error(error);
                });
              break;
            // go back to subreddit view by creating it new with current settings
            case "subredditView":
              creator
                .createSubredditView({
                  subreddit: currentSubreddit,
                  sort: currentSort,
                  interval: currentInterval,
                  limit: config.limitation,
                  count: currentCount,
                  after: currentAfter,
                  before: currentBefore,
                  session: session
                })
                .then(response => {
                  panel.webview.html = response;
                })
                .catch(error => {
                  logger.error(error);
                });
              break;
            case "collectionView":
              creator
                .createCollectionView({
                  collection: message.text,
                  cookie: session.cookie
                })
                .then(response => {
                  panel.webview.html = response;
                })
                .catch(error => {
                  logger.error(error);
                });
              break;
            // create the subreddit view with given subreddit name
            case "search":
              if (message.text !== "") {
                currentSubreddit = message.text;
              } else {
                currentSubreddit = config.defaultSubreddit;
              }
              // reset the sorting
              currentSort = config.defaultSort;
              currentInterval = config.defaultInterval;

              creator
                .createSubredditView({
                  subreddit: currentSubreddit,
                  sort: currentSort,
                  interval: currentInterval,
                  limit: config.limitation,
                  count: currentCount,
                  after: currentAfter,
                  before: currentBefore,
                  session: session
                })
                .then(response => {
                  panel.webview.html = response;
                })
                .catch(error => {
                  logger.error(error);
                });
              break;
            // set the sort and create the subreddit view with the new sort
            case "sort":
              // reset pagination
              currentAfter = null;
              currentBefore = null;
              currentCount = 0;

              currentSort = message.text;

              creator
                .createSubredditView({
                  subreddit: currentSubreddit,
                  sort: currentSort,
                  interval: currentInterval,
                  limit: config.limitation,
                  count: currentCount,
                  after: currentAfter,
                  before: currentBefore,
                  session: session
                })
                .then(response => {
                  panel.webview.html = response;
                })
                .catch(error => {
                  logger.error(error);
                });
              break;
            // set the interval and create the subreddit view with the new interval
            case "interval":
              // reset pagination
              currentAfter = null;
              currentBefore = null;
              currentCount = 0;

              currentInterval = message.text;

              creator
                .createSubredditView({
                  subreddit: currentSubreddit,
                  sort: currentSort,
                  interval: currentInterval,
                  limit: config.limitation,
                  count: currentCount,
                  after: currentAfter,
                  before: currentBefore,
                  session: session
                })
                .then(response => {
                  panel.webview.html = response;
                })
                .catch(error => {
                  logger.error(error);
                });
              break;
            // open an article by creating the article view
            case "article":
              // message is subreddit,articleID
              let data = message.text.split(",");
              if (data[0] === "") {
                data[0] = currentSubreddit;
              }
              creator
                .createArticleView(data[0], data[1])
                .then(response => {
                  panel.webview.html = response;
                })
                .catch(error => {
                  logger.error(error);
                });
              break;
            case "prev":
              currentBefore = message.text;
              currentAfter = null;
              // counter for before
              if (currentCount % config.limitation === 0) {
                currentCount += 1;
              } else {
                currentCount -= config.limitation;
              }

              creator
                .createSubredditView({
                  subreddit: currentSubreddit,
                  sort: currentSort,
                  interval: currentInterval,
                  limit: config.limitation,
                  count: currentCount,
                  after: currentAfter,
                  before: currentBefore,
                  session: session
                })
                .then(response => {
                  panel.webview.html = response;
                })
                .catch(error => {
                  logger.error(error);
                });
              break;
            case "next":
              currentAfter = message.text;
              currentBefore = null;
              // count seen articles
              currentCount += config.limitation;

              creator
                .createSubredditView({
                  subreddit: currentSubreddit,
                  sort: currentSort,
                  interval: currentInterval,
                  limit: config.limitation,
                  count: currentCount,
                  after: currentAfter,
                  before: currentBefore,
                  session: session
                })
                .then(response => {
                  panel.webview.html = response;
                })
                .catch(error => {
                  logger.error(error);
                });
              break;
            case "user":
              // parse ref data
              explodedString = message.text.split(",");
              username = explodedString[0];
              let view = explodedString[1];
              let refLocation = explodedString[2];
              let refID = explodedString[3];
              creator
                .createUserView({
                  username: username,
                  view: view,
                  refLocation: refLocation,
                  refID: refID
                })
                .then(response => {
                  panel.webview.html = response;
                })
                .catch(error => {
                  logger.error(error);
                });
              break;
            case "login":
              // parse login data
              explodedString = message.text.split(",");
              username = explodedString[0];
              let password = explodedString[1];
              api
                .userLogin(username, password)
                .then(response => {
                  // write cookie to globalState
                  session.active = true;
                  context.globalState.update("cookie", response);
                  session.cookie = response;
                  context.globalState.update("activeUser", username);
                  session.username = username;
                  creator
                    .createLandingpageView(config, session)
                    .then(response => {
                      panel.webview.html = response;
                      logger.info("Login successful");
                    })
                    .catch(error => {
                      logger.error(error);
                    });
                })
                .catch(() => {
                  logger.error("Login failed!");
                });
              break;
            case "logout":
              // remove cookie from globalState
              session.active = false;
              context.globalState.update("cookie", "");
              session.cookie = undefined;
              context.globalState.update("activeUser", undefined);
              session.username = undefined;
              // create Landingpage again
              creator
                .createLandingpageView(config, session)
                .then(response => {
                  panel.webview.html = response;
                  logger.info("Logout successful");
                })
                .catch(error => {
                  logger.error(error);
                });
              break;
            default:
              logger.error(
                "Received invalid message command: " + message.command
              );
              break;
          }
        },
        undefined,
        context.subscriptions
      );
      // reset currents if window is closed
      panel.onDidDispose(() => {
        currentSubreddit = config.defaultSubreddit;
        currentSort = config.defaultSort;
        currentInterval = config.defaultInterval;
        currentAfter = null;
        currentBefore = null;
        currentCount = 0;
        session.active = false;
      });
      // update configuration on change
      vscode.workspace.onDidChangeConfiguration(change => {
        if (change.affectsConfiguration("redditviewer")) {
          // reopen only needed for title change
          if (
            config.title !==
              vscode.workspace.getConfiguration("redditviewer").title &&
            !panel._isDisposed
          ) {
            const action = `Reopen`;
            vscode.window
              .showInformationMessage(
                `Reopen Reddit-Viewer for configuration to take effect.`,
                action
              )
              .then(selectedAction => {
                if (selectedAction === action) {
                  panel.dispose();
                  vscode.commands.executeCommand("extension.reddit");
                }
              });
          }
          config = vscode.workspace.getConfiguration("redditviewer");
        }
      });
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
