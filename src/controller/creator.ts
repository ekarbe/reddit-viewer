/**
 * creator.ts
 * The creator assembles the views. It uses the function from the templates to add the elements
 * to the HTML string.
 */

import * as vscode from 'vscode';
import * as api from '../model/reddit';
import { IConfigData, IAPIData, IGenericResult, IListing, IArticle, IComment } from '../interfaces';

/**
 * createHomeHTML creates the HTML string of the home view.
 * 
 * @param config 
 * @category Controller - Creator
 */
export async function createHomeHTML(config: IConfigData): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    if (!config.session && config.context && config.context.globalState.get('cookie') &&
      vscode.workspace.getConfiguration('RedditViewer').get('UserManagement')) {
      await api.checkSession({ cookie: config.context.globalState.get('cookie') })
        .then(_ => {
          config.session = true;
          if (config.context && config.context.globalState.get('activeUser')) {
            config.active_user = config.context.globalState.get('activeUser');
          }
        })
        .catch(error => {
          config.session = false;
          config.active_user = undefined;
        });
    }
    // dynamically import the configured template file
    let template: any;
    try {
      template = await import(`../view/${vscode.workspace.getConfiguration('RedditViewer').get('Style')}Templates`);
    } catch (e) {
      reject(e);
    }

    let promises: Array<Promise<any>> = [];

    // show trending subreddits
    if (vscode.workspace.getConfiguration('RedditViewer').get('HomeTrending')) {
      let apiData: IAPIData = {};
      promises.push(api.getSubredditTrend(apiData));
    }

    // show frontpage article list
    if (vscode.workspace.getConfiguration('RedditViewer').get('HomeFrontpage')) {
      let apiData: IAPIData = {
        limit: config.limit ? config.limit : vscode.workspace.getConfiguration('RedditViewer').get('HomeFrontpageLimit'),
        time: config.time ? config.time : vscode.workspace.getConfiguration('RedditViewer').get('HomeFrontpageTime'),
        sort: config.sort ? config.sort : vscode.workspace.getConfiguration('RedditViewer').get('HomeFrontpageSort'),
        count: config.count ? config.count : undefined,
        after: config.after ? config.after : undefined,
        before: config.before ? config.before : undefined,
        timeout: vscode.workspace.getConfiguration('RedditViewer').get('Timeout'),
      };
      // add user cookie
      if (config.context) {
        apiData.cookie = config.context.globalState.get('cookie') ? config.context.globalState.get('cookie') : undefined;
      }
      // decide which page to get
      if (vscode.workspace.getConfiguration('RedditViewer').get('HomeFrontpageMine')) {
        // getMine
        promises.push(api.getMine(apiData));
      } else {
        // get Subreddit
        apiData.subreddit = vscode.workspace.getConfiguration('RedditViewer').get('HomeFrontpageSubreddit');
        promises.push(api.getSubredditArticle(apiData));
      }
    }

    Promise.all(promises)
      .then(response => {
        let HTML: string =
          template.head({
            stylesheet: config.stylesheet,
            fontFamily: vscode.workspace.getConfiguration('editor', null).get('fontFamily'),
            fontSize: vscode.workspace.getConfiguration('editor', null).get('fontSize'),
            fontWeight: vscode.workspace.getConfiguration('editor', null).get('fontWeight')
          }) +
          template.lineComment("// HOME") +
          `<br />` +
          template.functionHead({
            name: "home",
            tabsize: vscode.workspace.getConfiguration('editor', null).get('tabSize'),
          }) +
          template.open() +
          template.search();
        if (config.session && vscode.workspace.getConfiguration('RedditViewer').get('UserManagement')) {
          HTML += template.logout({
            active_user: config.active_user
          });
        } else if (vscode.workspace.getConfiguration('RedditViewer').get('UserManagement')) {
          HTML += template.login();
        }
        HTML += `<br />`;
        if (vscode.workspace.getConfiguration('RedditViewer').get('HomeTrending')) {
          HTML += template.trend({
            trend: response[0],
            view: "home"
          }) +
            `<br />`;
        }
        if (vscode.workspace.getConfiguration('RedditViewer').get('HomeFrontpage')) {
          HTML += template.sort({
            active_sort: config.sort ? config.sort : vscode.workspace.getConfiguration('RedditViewer').get('HomeFrontpageSort'),
            sort: vscode.workspace.getConfiguration('RedditViewer').get('HomeFrontpageMine') ?
              ["best", "hot", "new", "controversial", "top", "rising"] :
              ["hot", "new", "controversial", "top", "rising"],
            view: "home"
          }) +
            template.time({
              active_time: config.time ? config.time : vscode.workspace.getConfiguration('RedditViewer').get('HomeFrontpageTime'),
              time: ["hour", "day", "week", "month", "year", "all"],
              view: "home"
            }) +
            `<br />`;
          let subreddit: IGenericResult<IListing<IArticle>>;
          if (response[1]) {
            subreddit = response[1];
          } else {
            subreddit = response[0];
          }
          for (let i = 0; i < subreddit.data.children.length; i++) {
            HTML += template.article({
              article: subreddit.data.children[i],
              view: "home",
              tabsize: vscode.workspace.getConfiguration('editor', null).get('tabSize'),
            });
          }
          HTML += `<br />` +
            template.pagination({
              view: "home",
              count: config.count,
              after: subreddit.data.after,
              before: subreddit.data.before
            });
        }
        HTML += template.functionTail() +
          template.tail() +
          template.script({
            view: "home"
          });
        resolve(HTML);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * createSearchHTML creates the HTML string of the search view.
 * 
 * @param config 
 * @category Controller - Creator
 */
export async function createSearchHTML(config: IConfigData): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    // dynamically import the configured template file
    let template: any;
    try {
      template = await import(`../view/${vscode.workspace.getConfiguration('RedditViewer').get('Style')}Templates`);
    } catch (e) {
      reject(e);
    }

    let promises: Array<Promise<any>> = [];

    let apiData: IAPIData = {
      search: config.search,
      limit: config.limit ? config.limit : vscode.workspace.getConfiguration('RedditViewer').get('SearchLimit'),
      time: config.time ? config.time : vscode.workspace.getConfiguration('RedditViewer').get('SearchTime'),
      sort: config.sort ? config.sort : vscode.workspace.getConfiguration('RedditViewer').get('SearchSort'),
      count: config.count ? config.count : undefined,
      after: config.after ? config.after : undefined,
      before: config.before ? config.before : undefined,
      timeout: vscode.workspace.getConfiguration('RedditViewer').get('Timeout'),
    };

    promises.push(api.getSearchSubreddit(apiData));
    promises.push(api.getSearchArticle(apiData));

    Promise.all(promises)
      .then(response => {
        let HTML: string = template.head({
          stylesheet: config.stylesheet,
          fontFamily: vscode.workspace.getConfiguration('editor', null).get('fontFamily'),
          fontSize: vscode.workspace.getConfiguration('editor', null).get('fontSize'),
          fontWeight: vscode.workspace.getConfiguration('editor', null).get('fontWeight'),
          lineHeight: vscode.workspace.getConfiguration('editor', null).get('lineHeight') === 0
            ? 'initial'
            : vscode.workspace.getConfiguration('editor', null).get('lineHeight'),
        }) +
          template.lineComment(`// SEARCH FOR "${config.search}"`) +
          `<br />` +
          template.breadcrumb({
            breadcrumb: ["home"],
            view: "search"
          }) +
          `<br />` +
          template.subredditSearch({
            subreddits: response[0],
            view: "search",
            tabsize: vscode.workspace.getConfiguration('editor', null).get('tabSize'),
          }) +
          `<br /><br />` +
          template.functionHead({
            name: "result",
            param: "search",
            tabsize: vscode.workspace.getConfiguration('editor', null).get('tabSize'),
          }) +
          template.sort({
            active_sort: config.sort ? config.sort : vscode.workspace.getConfiguration('RedditViewer').get('SearchSort'),
            sort: ["new", "relevance", "top", "comments"],
            view: "search"
          }) +
          template.time({
            active_time: config.time ? config.time : vscode.workspace.getConfiguration('RedditViewer').get('SearchTime'),
            time: ["hour", "day", "week", "month", "year", "all"],
            view: "search"
          }) +
          `<br />`;
        let subreddit: IGenericResult<IListing<IArticle>> = response[1];
        for (let i = 0; i < subreddit.data.children.length; i++) {
          HTML += template.article({
            article: subreddit.data.children[i],
            view: "search",
            tabsize: vscode.workspace.getConfiguration('editor', null).get('tabSize'),
          });
        }
        HTML += `<br />` +
          template.pagination({
            view: "search",
            count: config.count,
            after: subreddit.data.after,
            before: subreddit.data.before
          }) +
          template.functionTail() +
          template.tail() +
          template.script({
            view: "search"
          });
        resolve(HTML);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * createSubredditHTML creates the HTML string for the subreddit view.
 * 
 * @param config 
 * @category Controller - Creator
 */
export async function createSubredditHTML(config: IConfigData): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    // dynamically import the configured template file
    let template: any;
    try {
      template = await import(`../view/${vscode.workspace.getConfiguration('RedditViewer').get('Style')}Templates`);
    } catch (e) {
      reject(e);
    }

    let promises: Array<Promise<any>> = [];

    let apiData: IAPIData = {
      subreddit: config.subreddit,
      limit: config.limit ? config.limit : vscode.workspace.getConfiguration('RedditViewer').get('SubredditLimit'),
      time: config.time ? config.time : vscode.workspace.getConfiguration('RedditViewer').get('SubredditTime'),
      sort: config.sort ? config.sort : vscode.workspace.getConfiguration('RedditViewer').get('SubredditSort'),
      count: config.count ? config.count : undefined,
      after: config.after ? config.after : undefined,
      before: config.before ? config.before : undefined,
      timeout: vscode.workspace.getConfiguration('RedditViewer').get('Timeout'),
    };

    promises.push(api.getSubredditDetail(apiData));
    promises.push(api.getSubredditArticle(apiData));

    Promise.all(promises)
      .then(response => {
        let HTML: string = template.head({
          stylesheet: config.stylesheet,
          fontFamily: vscode.workspace.getConfiguration('editor', null).get('fontFamily'),
          fontSize: vscode.workspace.getConfiguration('editor', null).get('fontSize'),
          fontWeight: vscode.workspace.getConfiguration('editor', null).get('fontWeight')
        }) +
          template.lineComment(`// ${config.subreddit}`) +
          `<br />` +
          template.breadcrumb({
            breadcrumb: config.breadcrumb,
            view: "subreddit"
          }) +
          `<br />` +
          template.lineComment(`// ${response[0].data.public_description}`) +
          template.functionHead({
            name: "subreddit",
            tabsize: vscode.workspace.getConfiguration('editor', null).get('tabSize'),
          }) +
          template.sort({
            active_sort: config.sort ? config.sort : vscode.workspace.getConfiguration('RedditViewer').get('SubredditSort'),
            sort: ["hot", "new", "controversial", "top", "rising"],
            view: "subreddit"
          }) +
          template.time({
            active_time: config.time ? config.time : vscode.workspace.getConfiguration('RedditViewer').get('SubredditTime'),
            time: ["hour", "day", "week", "month", "year", "all"],
            view: "subreddit"
          }) +
          `<br />`;
        let subreddit: IGenericResult<IListing<IArticle>> = response[1];
        for (let i = 0; i < subreddit.data.children.length; i++) {
          HTML += template.article({
            article: subreddit.data.children[i],
            view: "subreddit",
            tabsize: vscode.workspace.getConfiguration('editor', null).get('tabSize'),
          });
        }
        HTML += `<br />` +
          template.pagination({
            view: "subreddit",
            count: config.count,
            after: subreddit.data.after,
            before: subreddit.data.before
          }) +
          template.functionTail() +
          template.tail() +
          template.script({
            view: "subreddit"
          });
        resolve(HTML);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * createArticleHTML creates the HTML string for the article view.
 * 
 * @param config 
 * @category Controller - Creator
 */
export async function createArticleHTML(config: IConfigData): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    // dynamically import the configured template file
    let template: any;
    try {
      template = await import(`../view/${vscode.workspace.getConfiguration('RedditViewer').get('Style')}Templates`);
    } catch (e) {
      reject(e);
    }

    let apiData: IAPIData = {
      subreddit: config.subreddit,
      article_id: config.article_id,
      limit: config.limit ? config.limit : vscode.workspace.getConfiguration('RedditViewer').get('ArticleCommentLimit'),
      sort: config.sort ? config.sort : vscode.workspace.getConfiguration('RedditViewer').get('ArticleCommentSort'),
      depth: vscode.workspace.getConfiguration('RedditViewer').get('ArticleCommentDepth'),
      timeout: vscode.workspace.getConfiguration('RedditViewer').get('Timeout'),
    };

    api.getArticleDetail(apiData)
      .then(response => {
        let articleDetail: IGenericResult<IListing<IArticle>> = response[0];
        let HTML: string = template.head({
          stylesheet: config.stylesheet,
          fontFamily: vscode.workspace.getConfiguration('editor', null).get('fontFamily'),
          fontSize: vscode.workspace.getConfiguration('editor', null).get('fontSize'),
          fontWeight: vscode.workspace.getConfiguration('editor', null).get('fontWeight')
        }) +
          template.lineComment(`// ARTICLE`) +
          `<br />` +
          template.breadcrumb({
            breadcrumb: config.breadcrumb,
            view: "article"
          }) +
          `<br />` +
          template.lineComment(`// ${articleDetail.data.children[0].data.title}`) +
          template.functionHead({
            name: "article",
            param: "data",
            tabsize: vscode.workspace.getConfiguration('editor', null).get('tabSize'),
          }) +
          template.articleDetail({
            article: articleDetail.data.children[0]
          }) +
          template.functionTail();
        if (articleDetail.data.children[0].data.num_comments > 0) {
          HTML += `<br />` +
            template.lineComment(`// ${articleDetail.data.children[0].data.num_comments} comments`) +
            template.functionHead({
              name: "comment",
              tabsize: vscode.workspace.getConfiguration('editor', null).get('tabSize'),
            }) +
            template.sort({
              active_sort: config.sort ? config.sort : vscode.workspace.getConfiguration('RedditViewer').get('ArticleCommentSort'),
              sort: ["confidence", "new", "old", "controversial", "top", "qa"],
              view: "article"
            }) +
            `<br />`;
          let comments: IGenericResult<IListing<IComment>> = response[1];
          for (let i = 0; i < comments.data.children.length; i++) {
            if (comments.data.children[i].kind === "t1") {
              comments.data.children[i].data.original_poster = articleDetail.data.children[0].data.author;
              HTML += template.comment({
                comment: comments.data.children[i].data,
                view: "article",
                tabsize: vscode.workspace.getConfiguration('editor', null).get('tabSize'),
              });
            }
          }
          HTML += template.functionTail();
        } else {
          HTML += `<br />` +
            template.lineComment(`// no comments in this article`);
        }
        HTML += template.tail() +
          template.script({
            view: "article"
          });
        resolve(HTML);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * createUserHTML creates the HTML string for the user view.
 * 
 * @param config 
 * @category Controller - Creator
 */
export async function createUserHTML(config: IConfigData): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    // dynamically import the configured template file
    let template: any;
    try {
      template = await import(`../view/${vscode.workspace.getConfiguration('RedditViewer').get('Style')}Templates`);
    } catch (e) {
      reject(e);
    }

    let promises: Array<Promise<any>> = [];

    let apiData: IAPIData = {
      username: config.username,
      limit: config.limit ? config.limit : vscode.workspace.getConfiguration('RedditViewer').get('UserLimit'),
      time: config.time ? config.time : vscode.workspace.getConfiguration('RedditViewer').get('UserTime'),
      sort: config.sort ? config.sort : vscode.workspace.getConfiguration('RedditViewer').get('UserSort'),
      count: config.count ? config.count : undefined,
      after: config.after ? config.after : undefined,
      before: config.before ? config.before : undefined,
      timeout: vscode.workspace.getConfiguration('RedditViewer').get('Timeout'),
    };

    // get the user about data
    promises.push(api.getUserAbout(apiData));
    // get the users article and comments
    promises.push(api.getUserPage(apiData));

    Promise.all(promises)
      .then(response => {
        let user: IGenericResult<IListing<IArticle | IComment>> = response[0];
        let HTML: string = template.head({
          stylesheet: config.stylesheet,
          fontFamily: vscode.workspace.getConfiguration('editor', null).get('fontFamily'),
          fontSize: vscode.workspace.getConfiguration('editor', null).get('fontSize'),
          fontWeight: vscode.workspace.getConfiguration('editor', null).get('fontWeight'),
        }) +
          template.lineComment(`// USER ${config.username}`) +
          `<br />` +
          template.breadcrumb({
            breadcrumb: config.breadcrumb,
            view: "user"
          }) +
          `<br />` +
          template.functionHead({
            name: "user",
            tabsize: vscode.workspace.getConfiguration('editor', null).get('tabSize'),
          }) +
          template.userAbout({
            user: user.data
          });
        let userPage: IGenericResult<IListing<IArticle | IComment>> = response[1];
        if (userPage.data.children.length > 0) {
          HTML += `<br />` +
            template.sort({
              active_sort: config.sort ? config.sort : vscode.workspace.getConfiguration('RedditViewer').get('UserSort'),
              sort: ["new", "hot", "top", "controversial"],
              view: "user"
            }) +
            template.time({
              active_time: config.time ? config.time : vscode.workspace.getConfiguration('RedditViewer').get('UserTime'),
              time: ["hour", "day", "week", "month", "year", "all"],
              view: "user"
            }) +
            `<br />`;
          for (let i = 0; i < userPage.data.children.length; i++) {
            if (userPage.data.children[i].kind === "t1") {
              HTML += template.comment({
                comment: userPage.data.children[i].data,
                view: "user",
                tabsize: vscode.workspace.getConfiguration('editor', null).get('tabSize'),
              });
            } else if (userPage.data.children[i].kind === "t3") {
              HTML += template.article({
                article: userPage.data.children[i],
                view: "user",
                tabsize: vscode.workspace.getConfiguration('editor', null).get('tabSize'),
              });
            }
          }
        } else {
          HTML += template.lineComment(`// user has no posts or comments`);
        }
        HTML += `<br />` +
          template.pagination({
            view: "user",
            count: config.count,
            after: userPage.data.after,
            before: userPage.data.before
          }) +
          template.functionTail() +
          template.tail() +
          template.script({
            view: "user"
          });
        resolve(HTML);
      })
      .catch(error => {
        reject(error);
      });
  });
}