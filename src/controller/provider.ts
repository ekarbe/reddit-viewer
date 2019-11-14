import * as vscode from 'vscode';
import { getMine, getSubredditArticle } from '../model/reddit';
import { IAPIData, IGenericResult, IArticle } from '../interfaces';

/**
 * Provides a custom `TreeDataProvider`to fill a View with a list of `Article` objects.
 */
export class ArticleProvider implements vscode.TreeDataProvider<any> {
  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  public frontpage_limit: number | undefined;
  public frontpage_sort: string | undefined;
  public frontpage_time: string | undefined;
  public subreddit_limit: number | undefined;
  public subreddit_sort: string | undefined;
  public subreddit_time: string | undefined;

  constructor(public view: string, public context: vscode.ExtensionContext) {
    // load the initial default values
    this.frontpage_limit = vscode.workspace.getConfiguration('RedditViewerWidget').get('FrontpageLimit');
    this.frontpage_sort = vscode.workspace.getConfiguration('RedditViewerWidget').get('FrontpageSort');
    // set the initial context to disable chosen sort setting
    vscode.commands.executeCommand('setContext', `frontpage-${this.frontpage_sort}-enabled`, true);
    this.frontpage_time = vscode.workspace.getConfiguration('RedditViewerWidget').get('FrontpageTime');
    this.subreddit_limit = vscode.workspace.getConfiguration('RedditViewerWidget').get('SubredditLimit');
    this.subreddit_sort = vscode.workspace.getConfiguration('RedditViewerWidget').get('SubredditSort');
    // set the initial context to disable chosen sort setting
    vscode.commands.executeCommand('setContext', `subreddit-${this.subreddit_sort}-enabled`, true);
    this.subreddit_time = vscode.workspace.getConfiguration('RedditViewerWidget').get('SubredditTime');
  }

  /**
   * Reloads the children of the provided tree
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  /**
   * Sets the sort of a view.
   * 
   * @param view 
   * @param sort 
   * @category Controller - Provider
   */
  public setSort(view: string, sort: string) {
    if (view === "Frontpage") {
      vscode.commands.executeCommand('setContext', `frontpage-${this.frontpage_sort}-enabled`, false);
      this.frontpage_sort = sort;
      vscode.commands.executeCommand('setContext', `frontpage-${this.frontpage_sort}-enabled`, true);
    } else if (view === "Subreddit") {
      vscode.commands.executeCommand('setContext', `subreddit-${this.frontpage_sort}-enabled`, false);
      this.subreddit_sort = sort;
      vscode.commands.executeCommand('setContext', `subreddit-${this.frontpage_sort}-enabled`, true);
    } else {
      vscode.window.showErrorMessage("Error: Unknown view '" + view + "'");
    }
    this.refresh();
  }

  /**
   * Gets TreeItem
   * 
   * @param element 
   * @category Controller - Provider
   */
  getTreeItem(element: IGenericResult<IArticle>): vscode.TreeItem {
    let openOption = vscode.workspace.getConfiguration('RedditViewerWidget').get('OpenType');
    let command = undefined;
    if (openOption === "redditviewer") {
      command = {
        command: 'RedditViewer.OpenArticle',
        title: '',
        arguments: [element.data.subreddit, element.data.id]
      };
    } else if (openOption === "browser") {
      command = {
        command: 'RedditViewer.OpenBrowser',
        title: '',
        arguments: [element.data.permalink]
      };
    } else {
      vscode.window.showErrorMessage("Error: Unknown open option '" + openOption + "'");
    }
    return {
      label: element.data.title,
      tooltip: element.data.title,
      collapsibleState: vscode.TreeItemCollapsibleState.None,
      command: command
    };
  }

  /**
   * Gets Children
   * 
   * @param element 
   * @category Controller - Provider
   */
  getChildren(element?: any): Thenable<IGenericResult<IArticle>[]> {
    return new Promise<any>((resolve, reject) => {
      let data: IAPIData = {
        subreddit: vscode.workspace.getConfiguration('RedditViewerWidget').get('SubredditDefault')
      };
      if (this.view === "Frontpage") {
        data.limit = this.frontpage_limit;
        data.sort = this.frontpage_sort;
        data.time = this.frontpage_time;
        data.cookie = this.context.globalState.get('cookie');
        data.timeout = vscode.workspace.getConfiguration('RedditViewer').get('Timeout');
        getMine(data).then(response => {
          resolve(response.data.children);
        })
          .catch(error => {
            if (error === "getaddrinfo ENOTFOUND reddit.com") {
              vscode.window.showErrorMessage("Error: no active connection to the internet.");
            } else {
              vscode.window.showErrorMessage(error);
            }
            reject();
          });
      } else if (this.view === "Subreddit") {
        data.limit = this.subreddit_limit;
        data.sort = this.subreddit_sort;
        data.time = this.subreddit_time;
        data.timeout = vscode.workspace.getConfiguration('RedditViewer').get('Timeout');
        getSubredditArticle(data).then(response => {
          resolve(response.data.children);
        })
          .catch(error => {
            if (error === "getaddrinfo ENOTFOUND reddit.com") {
              vscode.window.showErrorMessage("Error: no active connection to the internet.");
            } else {
              vscode.window.showErrorMessage(error);
            }
            reject();
          });
      } else {
        reject("Error: View '" + this.view + "' not defined");
      }
    });
  }
}

/**
 * Creates a custom `TreeItem` object.
 * 
 * @category Controller - Provider
 */
export class Article extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsableState: vscode.TreeItemCollapsibleState,
    public readonly command: vscode.Command
  ) {
    super(label, collapsableState);
  }
}