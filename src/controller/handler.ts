/**
 *  handler.ts
 *  The handler is used to route and parse the config.
 *  Right now it's very complex and should be refactored.
 *  TODO: Refactoring
 */

import * as vscode from 'vscode';
import { ViewCache, IConfigData } from '../interfaces';
import * as creator from './creator';
import { loginUser } from '../model/reddit';

/**
 * homeViewCache saves temporary data of the home view
 */
let homeViewCache: ViewCache = new ViewCache();
/**
 * searchViewCache saves temporary data of the search view
 */
let searchViewCache: ViewCache = new ViewCache();
/**
 * subredditViewCache saves temporary data of the subreddit view
 */
let subredditViewCache: ViewCache = new ViewCache();
/**
 * articleViewCache saves temporary data of the article view
 */
let articleViewCache: ViewCache = new ViewCache();
/**
 * userViewCache saves temporary data of the user view
 */
let userViewCache: ViewCache = new ViewCache();

/**
 * getView routes the given command to its function.
 * 
 * @param config 
 * @category Controller - Handler
 */
export function getView(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.command) {
            case "home":
                handleHome(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "search":
                handleSearch(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "login":
                handleLogin(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "logout":
                handleLogout(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "subreddit":
                handleSubreddit(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "article":
                handleArticle(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "user":
                handleUser(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "next":
                nextPage(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "prev":
                prevPage(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "hot":
                sortHot(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "new":
                sortNew(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "old":
                sortOld(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "controversial":
                sortControversial(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "top":
                sortTop(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "rising":
                sortRising(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "confidence":
                sortConfidence(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "qa":
                sortQA(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "relevance":
                sortRelevance(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "best":
                sortBest(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "comments":
                sortComments(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "hour":
                timeHour(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "day":
                timeDay(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "week":
                timeWeek(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "month":
                timeMonth(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "year":
                timeYear(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            case "all":
                timeAll(config)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
                break;
            default:
                // the given command is not specified
                reject("Error: unknown command " + config.command);
                break;
        }
    });
}

/**
 * handleHome parses the config for the home view 
 * and calls the creator function.
 * Navigating to the home view usually resets everything so this is pretty simple.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function handleHome(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        // home -> home
        // pagination and sorting
        if (config.view === "home") {
            resetConfig(config);
            searchViewCache.reset();
            subredditViewCache.reset();
            articleViewCache.reset();
            userViewCache.reset();
            config.time = homeViewCache.time;
            config.sort = homeViewCache.sort;
            config.count = homeViewCache.count;
            config.after = homeViewCache.after;
            config.before = homeViewCache.before;
        }
        // cache is set
        else if (Object.entries(homeViewCache).length > 0) {
            resetConfig(config);
            searchViewCache.reset();
            subredditViewCache.reset();
            articleViewCache.reset();
            userViewCache.reset();
            config.time = homeViewCache.time;
            config.sort = homeViewCache.sort;
            config.count = homeViewCache.count;
            config.after = homeViewCache.after;
            config.before = homeViewCache.before;
        }
        // default
        else {
            resetConfig(config);
            searchViewCache.reset();
            subredditViewCache.reset();
            articleViewCache.reset();
            userViewCache.reset();
        }
        creator.createHomeHTML(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * handleSearch parses the config for the search view 
 * and calls the creator function.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function handleSearch(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        // search -> search
        // pagination and sorting
        if (config.view === "search") {
            resetConfig(config);
            config.search = searchViewCache.search;
            config.time = searchViewCache.time;
            config.sort = searchViewCache.sort;
            config.count = searchViewCache.count;
            config.after = searchViewCache.after;
            config.before = searchViewCache.before;
            config.breadcrumb = ["home"];
        }
        // subreddit -> search
        // article -> search
        // user -> serarch
        // reset the child views
        else if (config.view === "subreddit" || config.view === "article" || config.view === "user") {
            resetConfig(config);
            subredditViewCache.reset();
            articleViewCache.reset();
            userViewCache.reset();
            config.search = searchViewCache.search;
            config.time = searchViewCache.time;
            config.sort = searchViewCache.sort;
            config.count = searchViewCache.count;
            config.after = searchViewCache.after;
            config.before = searchViewCache.before;
            config.breadcrumb = ["home"];
        }
        // default
        else {
            if (config.args) {
                resetConfig(config);
                config.search = searchViewCache.search = config.args[0];
            } else {
                let error: string = `Error: search is missing!`;
                reject(error);
            }
            config.breadcrumb = ["home"];
        }
        creator.createSearchHTML(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * handleLogin parses the config for the login
 * and then opens the home view.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function handleLogin(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        // try to login
        if (config.args) {
            loginUser({
                username: config.args[0],
                password: config.args[1]
            })
                .then(response => {
                    if (config.context && config.args) {
                        // set the cookie in the globalstate to access it later on
                        config.context.globalState.update("cookie", response.cookie);
                        // the username is saved because you can't get it from the cookie
                        config.context.globalState.update("activeUser", config.args[0]);
                    }
                    // reset the view
                    delete config.username;
                    config.command = "home";
                    getView(config)
                        .then(response => {
                            resolve(response);
                        })
                        .catch(error => {
                            reject(error);
                        });
                })
                .catch(error => {
                    reject(error);
                });
        }
    });
}

/**
 * handleLogout parses the config for the logout
 * and then open the home view.
 * 
 * @param config
 * @category Controller - Handler 
 */
async function handleLogout(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        // reset all user relevant variables
        delete config.active_user;
        config.session = false;
        if (config.context) {
            config.context.globalState.update('cookie', null);
            config.context.globalState.update('activeUser', null);
        }
        // reset view
        config.command = "home";
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * handleSubreddit parses the config for the subreddit view 
 * and calls the creator function.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function handleSubreddit(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        // subreddit -> subreddit
        if (config.view === "subreddit") {
            resetConfig(config);
            config.subreddit = subredditViewCache.subreddit;
            config.time = subredditViewCache.time;
            config.sort = subredditViewCache.sort;
            config.count = subredditViewCache.count;
            config.after = subredditViewCache.after;
            config.before = subredditViewCache.before;
            config.breadcrumb = ["home"];
            if (Object.entries(searchViewCache).length > 0) {
                config.breadcrumb.push("search");
            }
            if (Object.entries(articleViewCache).length > 0) {
                config.breadcrumb.push("article");
            }
            if (Object.entries(userViewCache).length > 0) {
                config.breadcrumb.push("user");
            }
        }
        // search -> subreddit
        else if (config.view === "search") {
            if (config.args) {
                resetConfig(config);
                config.subreddit = subredditViewCache.subreddit = config.args[0];
            } else {
                let error: string = `Error: subreddit is missing!`;
                reject(error);
            }
            config.breadcrumb = ["home", "search"];
            if (Object.entries(articleViewCache).length > 0) {
                config.breadcrumb.push("article");
            }
            if (Object.entries(userViewCache).length > 0) {
                config.breadcrumb.push("user");
            }
        }
        // user -> subreddit
        else if (config.view === "user" && config.args) {
            resetConfig(config);
            homeViewCache.reset();
            searchViewCache.reset();
            subredditViewCache.reset();
            articleViewCache.reset();
            config.subreddit = subredditViewCache.subreddit = config.args[0];
            config.breadcrumb = ["home", "user"];
        }
        // user -> subreddit back
        else if (config.view === "user" && Object.entries(subredditViewCache).length > 0) {
            resetConfig(config);
            userViewCache.reset();
            config.subreddit = subredditViewCache.subreddit;
            config.time = subredditViewCache.time;
            config.sort = subredditViewCache.sort;
            config.count = subredditViewCache.count;
            config.after = subredditViewCache.after;
            config.before = subredditViewCache.before;
            config.breadcrumb = ["home"];
            if (Object.entries(searchViewCache).length > 0) {
                config.breadcrumb.push("search");
            }
            if (Object.entries(articleViewCache).length > 0) {
                config.breadcrumb.push("article");
            }
        }
        // cache is set
        else if (Object.entries(subredditViewCache).length > 0) {
            articleViewCache.reset();
            userViewCache.reset();
            config.subreddit = subredditViewCache.subreddit;
            config.time = subredditViewCache.time;
            config.sort = subredditViewCache.sort;
            config.count = subredditViewCache.count;
            config.after = subredditViewCache.after;
            config.before = subredditViewCache.before;
            config.breadcrumb = ["home"];
            if (Object.entries(searchViewCache).length > 0) {
                config.breadcrumb.push("search");
            }
            if (Object.entries(articleViewCache).length > 0) {
                config.breadcrumb.push("article");
            }
            if (Object.entries(userViewCache).length > 0) {
                config.breadcrumb.push("user");
            }
        }
        // default
        else {
            resetConfig(config);
            subredditViewCache.reset();
            if (config.args) {
                config.subreddit = subredditViewCache.subreddit = config.args[0];
            } else {
                let error: string = `Error: subreddit is missing!`;
                reject(error);
            }
            config.breadcrumb = ["home"];
        }
        creator.createSubredditHTML(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * handleArticle parses the config for the article view 
 * and calls the creator function.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function handleArticle(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        // article -> article
        if (config.view === "article") {
            resetConfig(config);
            config.subreddit = articleViewCache.subreddit;
            config.article_id = articleViewCache.article_id;
            config.sort = articleViewCache.sort;
            config.breadcrumb = ["home"];
            if (Object.entries(searchViewCache).length > 0) {
                config.breadcrumb.push("search");
            }
            if (Object.entries(subredditViewCache).length > 0) {
                config.breadcrumb.push("subreddit");
            }
            if (Object.entries(userViewCache).length > 0) {
                config.breadcrumb.push("user");
            }
        }
        // article -> article
        else if (config.view === "user" && config.args) {
            resetConfig(config);
            subredditViewCache.reset();
            articleViewCache.reset();
            config.subreddit = articleViewCache.subreddit = config.args[0];
            config.article_id = articleViewCache.article_id = config.args[1];
            config.breadcrumb = ["home", "user"];
        }
        // article -> article back
        else if (config.view === "user" && Object.entries(articleViewCache).length > 0) {
            resetConfig(config);
            userViewCache.reset();
            config.subreddit = articleViewCache.subreddit;
            config.article_id = articleViewCache.article_id;
            config.sort = articleViewCache.sort;
            config.breadcrumb = ["home"];
            if (Object.entries(searchViewCache).length > 0) {
                config.breadcrumb.push("search");
            }
            if (Object.entries(subredditViewCache).length > 0) {
                config.breadcrumb.push("subreddit");
            }
            if (Object.entries(userViewCache).length > 0) {
                config.breadcrumb.push("user");
            }
        }
        // home -> article
        // only possible through the frontpage
        // back link: only to home possible
        // cache: nothing can be fetched from cache
        else if (config.view === "home") {
            if (config.args) {
                resetConfig(config);
                config.subreddit = articleViewCache.subreddit = config.args[0];
                config.article_id = articleViewCache.article_id = config.args[1];
            } else {
                let error: string = `Error: Subreddit and/or article_id is missing!`;
                reject(error);
            }
            config.breadcrumb = ["home"];
        }
        // search -> article
        else if (config.view === "search") {
            resetConfig(config);
            homeViewCache.reset();
            subredditViewCache.reset();
            articleViewCache.reset();
            userViewCache.reset();
            if (config.args) {
                config.subreddit = articleViewCache.subreddit = config.args[0];
                config.article_id = articleViewCache.article_id = config.args[1];
            } else {
                let error: string = `Error: Subreddit and/or article_id is missing!`;
                reject(error);
            }
            config.breadcrumb = ["home", "search"];
            if (Object.entries(subredditViewCache).length > 0) {
                config.breadcrumb.push("subreddit");
            }
            if (Object.entries(userViewCache).length > 0) {
                config.breadcrumb.push("user");
            }
        }
        // widget -> article
        else if (config.view === "widget") {
            delete config.username;
            delete config.search;
            delete config.after;
            delete config.before;
            delete config.count;
            delete config.sort;
            delete config.time;
            delete config.breadcrumb;
            homeViewCache.reset();
            searchViewCache.reset();
            subredditViewCache.reset();
            articleViewCache.reset();
            userViewCache.reset();
            if (config.subreddit && config.article_id) {
                articleViewCache.subreddit = config.subreddit;
                articleViewCache.article_id = config.article_id;
            } else {
                let error: string = `Error: Subreddit and/or article_id is missing!`;
                reject(error);
            }
            config.breadcrumb = ["home"];
        }
        // subreddit -> article
        else if (config.view === "subreddit") {
            resetConfig(config);
            articleViewCache.reset();
            userViewCache.reset();
            if (config.args) {
                config.subreddit = articleViewCache.subreddit = config.args[0];
                config.article_id = articleViewCache.article_id = config.args[1];
            } else {
                let error: string = `Error: Subreddit and/or article_id is missing!`;
                reject(error);
            }
            config.breadcrumb = ["home"];
            if (Object.entries(searchViewCache).length > 0) {
                config.breadcrumb.push("search");
            }
            if (Object.entries(subredditViewCache).length > 0) {
                config.breadcrumb.push("subreddit");
            }
            if (Object.entries(userViewCache).length > 0) {
                config.breadcrumb.push("user");
            }
        }
        creator.createArticleHTML(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * handleUser parses the config for the user view
 * and calls the creator function.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function handleUser(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        // article -> user back
        if (config.view === "article" && Object.entries(userViewCache).length > 0) {
            resetConfig(config);
            articleViewCache.reset();
            config.username = userViewCache.username;
            config.sort = userViewCache.sort;
            config.time = userViewCache.time;
            config.count = userViewCache.count;
            config.after = userViewCache.after;
            config.before = userViewCache.before;
            config.breadcrumb = ["home"];
            if (Object.entries(searchViewCache).length > 0) {
                config.breadcrumb.push("search");
            }
            if (Object.entries(subredditViewCache).length > 0) {
                config.breadcrumb.push("subreddit");
            }
            if (Object.entries(articleViewCache).length > 0) {
                config.breadcrumb.push("article");
            }
        }
        // user -> user
        else if (config.view === "user" || Object.entries(userViewCache).length > 0) {
            resetConfig(config);
            config.username = userViewCache.username;
            config.sort = userViewCache.sort;
            config.time = userViewCache.time;
            config.count = userViewCache.count;
            config.after = userViewCache.after;
            config.before = userViewCache.before;
            config.breadcrumb = ["home"];
            if (Object.entries(searchViewCache).length > 0) {
                config.breadcrumb.push("search");
            }
            if (Object.entries(subredditViewCache).length > 0) {
                config.breadcrumb.push("subreddit");
            }
            if (Object.entries(articleViewCache).length > 0) {
                config.breadcrumb.push("article");
            }
        }
        // default
        else {
            if (config.args) {
                resetConfig(config);
                config.username = userViewCache.username = config.args[0];
                config.breadcrumb = ["home"];
                if (Object.entries(searchViewCache).length > 0) {
                    config.breadcrumb.push("search");
                }
                if (Object.entries(subredditViewCache).length > 0) {
                    config.breadcrumb.push("subreddit");
                }
                if (Object.entries(articleViewCache).length > 0) {
                    config.breadcrumb.push("article");
                }
            } else {
                let error: string = `Error: username is missing!`;
                reject(error);
            }
        }
        creator.createUserHTML(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * nextPage recalculates the count parameter to move to the next page.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function nextPage(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        if (config.args) {
            if (config.args[0] !== "undefined") {
                config.count = <number><unknown>config.args[0];
            } else {
                config.count = undefined;
            }
            config.after = config.args[1];
            config.before = config.args[2];
            let limit: number;
            switch (config.view) {
                case "home":
                    limit = <number>vscode.workspace.getConfiguration('RedditViewer').get('HomeFrontpageLimit');
                    if (config.count) {
                        config.count += limit;
                    } else {
                        config.count = limit;
                    }
                    homeViewCache.count = config.count;
                    homeViewCache.after = config.after;
                    homeViewCache.before = config.before;
                    break;
                case "search":
                    limit = <number>vscode.workspace.getConfiguration('RedditViewer').get('SearchLimit');
                    if (config.count) {
                        config.count += limit;
                    } else {
                        config.count = limit;
                    }
                    searchViewCache.count = config.count;
                    searchViewCache.after = config.after;
                    searchViewCache.before = config.before;
                    break;
                case "subreddit":
                    limit = <number>vscode.workspace.getConfiguration('RedditViewer').get('SubredditLimit');
                    if (config.count) {
                        config.count += limit;
                    } else {
                        config.count = limit;
                    }
                    subredditViewCache.count = config.count;
                    subredditViewCache.after = config.after;
                    subredditViewCache.before = config.before;
                    break;
                case "user":
                    limit = <number>vscode.workspace.getConfiguration('RedditViewer').get('UserLimit');
                    if (config.count) {
                        config.count += limit;
                    } else {
                        config.count = limit;
                    }
                    userViewCache.count = config.count;
                    userViewCache.after = config.after;
                    userViewCache.before = config.before;
                    break;
                default:
                    let error: string = `Error: pagination not possible in view '${config.view}'!`;
                    reject(error);
            }
        } else {
            let error: string = `Error: arguments (count, after, before) missing for pagination!`;
            reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.count;
        delete config.after;
        delete config.before;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * prevPage recalculates the count parameter to move the previos page.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function prevPage(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        if (config.args) {
            if (config.args[0] !== "undefined") {
                config.count = <number><unknown>config.args[0];
            } else {
                config.count = undefined;
            }
            config.after = config.args[1];
            config.before = config.args[2];
            let limit: number;
            switch (config.view) {
                case "home":
                    limit = <number>vscode.workspace.getConfiguration('RedditViewer').get('HomeFrontpageLimit');
                    if (config.count) {
                        if (config.count % limit === 0) {
                            config.count += 1;
                        } else {
                            config.count -= limit;
                        }
                    }
                    homeViewCache.count = config.count;
                    homeViewCache.after = config.after;
                    homeViewCache.before = config.before;
                    break;
                case "search":
                    limit = <number>vscode.workspace.getConfiguration('RedditViewer').get('SearchLimit');
                    if (config.count) {
                        if (config.count % limit === 0) {
                            config.count += 1;
                        } else {
                            config.count -= limit;
                        }
                    }
                    searchViewCache.count = config.count;
                    searchViewCache.after = config.after;
                    searchViewCache.before = config.before;
                    break;
                case "subreddit":
                    limit = <number>vscode.workspace.getConfiguration('RedditViewer').get('SubredditLimit');
                    if (config.count) {
                        if (config.count % limit === 0) {
                            config.count += 1;
                        } else {
                            config.count -= limit;
                        }
                    }
                    subredditViewCache.count = config.count;
                    subredditViewCache.after = config.after;
                    subredditViewCache.before = config.before;
                    break;
                case "user":
                    limit = <number>vscode.workspace.getConfiguration('RedditViewer').get('UserLimit');
                    if (config.count) {
                        if (config.count % limit === 0) {
                            config.count += 1;
                        } else {
                            config.count -= limit;
                        }
                    }
                    userViewCache.count = config.count;
                    userViewCache.after = config.after;
                    userViewCache.before = config.before;
                    break;
                default:
                    let error: string = `Error: pagination not possible in view '${config.view}'!`;
                    reject(error);
            }
        } else {
            let error: string = `Error: arguments (count, after, before) missing for pagination!`;
            reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.count;
        delete config.after;
        delete config.before;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * sortHot sets the hot sortation.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function sortHot(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "home":
                homeViewCache.resetPagination();
                homeViewCache.sort = "hot";
                break;
            case "search":
                searchViewCache.resetPagination();
                searchViewCache.sort = "hot";
                break;
            case "subreddit":
                subredditViewCache.resetPagination();
                subredditViewCache.sort = "hot";
                break;
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.sort = "hot";
                break;
            case "user":
                userViewCache.resetPagination();
                userViewCache.sort = "hot";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by hot!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.sort;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * sortNew sets the new sortation.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function sortNew(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "home":
                homeViewCache.resetPagination();
                homeViewCache.sort = "new";
                break;
            case "search":
                searchViewCache.resetPagination();
                searchViewCache.sort = "new";
                break;
            case "subreddit":
                subredditViewCache.resetPagination();
                subredditViewCache.sort = "new";
                break;
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.sort = "new";
                break;
            case "user":
                userViewCache.resetPagination();
                userViewCache.sort = "new";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by new!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.sort;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * sortOld sets the old sortation.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function sortOld(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.sort = "old";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by new!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.sort;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * sortControversial sets the controversial sortation.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function sortControversial(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "home":
                homeViewCache.resetPagination();
                homeViewCache.sort = "controversial";
                break;
            case "search":
                searchViewCache.resetPagination();
                searchViewCache.sort = "controversial";
                break;
            case "subreddit":
                subredditViewCache.resetPagination();
                subredditViewCache.sort = "controversial";
                break;
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.sort = "controversial";
                break;
            case "user":
                userViewCache.resetPagination();
                userViewCache.sort = "controversial";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by controversial!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.sort;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * sortTop sets the top sortation.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function sortTop(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "home":
                homeViewCache.resetPagination();
                homeViewCache.sort = "top";
                break;
            case "search":
                searchViewCache.resetPagination();
                searchViewCache.sort = "top";
                break;
            case "subreddit":
                subredditViewCache.resetPagination();
                subredditViewCache.sort = "top";
                break;
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.sort = "top";
                break;
            case "user":
                userViewCache.resetPagination();
                userViewCache.sort = "top";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by top!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.sort;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * sortRising sets the rising sortation.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function sortRising(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "home":
                homeViewCache.resetPagination();
                homeViewCache.sort = "rising";
                break;
            case "search":
                searchViewCache.resetPagination();
                searchViewCache.sort = "rising";
                break;
            case "subreddit":
                subredditViewCache.resetPagination();
                subredditViewCache.sort = "rising";
                break;
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.sort = "rising";
                break;
            case "user":
                userViewCache.resetPagination();
                userViewCache.sort = "rising";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by rising!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.sort;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * sortConfidence sets the confidence sortation.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function sortConfidence(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.sort = "confidence";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by confidence!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.sort;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * sortQA sets the qa sortation.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function sortQA(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.sort = "qa";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by qa!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.sort;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * sortRelevance sets the relevance sortation.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function sortRelevance(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "home":
                homeViewCache.resetPagination();
                homeViewCache.sort = "relevance";
                break;
            case "search":
                searchViewCache.resetPagination();
                searchViewCache.sort = "relevance";
                break;
            case "subreddit":
                subredditViewCache.resetPagination();
                subredditViewCache.sort = "relevance";
                break;
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.sort = "relevance";
                break;
            case "user":
                userViewCache.resetPagination();
                userViewCache.sort = "relevance";
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by relevance!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.sort;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * sortBest sets the best sortation.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function sortBest(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "home":
                homeViewCache.resetPagination();
                homeViewCache.sort = "best";
                break;
            case "search":
                searchViewCache.resetPagination();
                searchViewCache.sort = "best";
                break;
            case "subreddit":
                subredditViewCache.resetPagination();
                subredditViewCache.sort = "best";
                break;
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.sort = "best";
                break;
            case "user":
                userViewCache.resetPagination();
                userViewCache.sort = "best";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by best!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.sort;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * sortComments sets the comments sortation.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function sortComments(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "home":
                homeViewCache.resetPagination();
                homeViewCache.sort = "comments";
                break;
            case "search":
                searchViewCache.resetPagination();
                searchViewCache.sort = "comments";
                break;
            case "subreddit":
                subredditViewCache.resetPagination();
                subredditViewCache.sort = "comments";
                break;
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.sort = "comments";
                break;
            case "user":
                userViewCache.resetPagination();
                userViewCache.sort = "comments";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by comments!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.sort;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * timeHour sets the hour interval.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function timeHour(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "home":
                homeViewCache.resetPagination();
                homeViewCache.time = "hour";
                break;
            case "search":
                searchViewCache.resetPagination();
                searchViewCache.time = "hour";
                break;
            case "subreddit":
                subredditViewCache.resetPagination();
                subredditViewCache.time = "hour";
                break;
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.time = "hour";
                break;
            case "user":
                userViewCache.resetPagination();
                userViewCache.time = "hour";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by hour!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.time;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * timeDay sets the day interval.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function timeDay(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "home":
                homeViewCache.resetPagination();
                homeViewCache.time = "day";
                break;
            case "search":
                searchViewCache.resetPagination();
                searchViewCache.time = "day";
                break;
            case "subreddit":
                subredditViewCache.resetPagination();
                subredditViewCache.time = "day";
                break;
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.time = "day";
                break;
            case "user":
                userViewCache.resetPagination();
                userViewCache.time = "day";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by day!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.time;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * timeWeek sets the week interval.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function timeWeek(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "home":
                homeViewCache.resetPagination();
                homeViewCache.time = "week";
                break;
            case "search":
                searchViewCache.resetPagination();
                searchViewCache.time = "week";
                break;
            case "subreddit":
                subredditViewCache.resetPagination();
                subredditViewCache.time = "week";
                break;
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.time = "week";
                break;
            case "user":
                userViewCache.resetPagination();
                userViewCache.time = "week";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by week!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.time;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * timeMonth sets the month interval.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function timeMonth(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "home":
                homeViewCache.resetPagination();
                homeViewCache.time = "month";
                break;
            case "search":
                searchViewCache.resetPagination();
                searchViewCache.time = "month";
                break;
            case "subreddit":
                subredditViewCache.resetPagination();
                subredditViewCache.time = "month";
                break;
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.time = "month";
                break;
            case "user":
                userViewCache.resetPagination();
                userViewCache.time = "month";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by month!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.time;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * timeYear sets the year interval.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function timeYear(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "home":
                homeViewCache.resetPagination();
                homeViewCache.time = "year";
                break;
            case "search":
                searchViewCache.resetPagination();
                searchViewCache.time = "year";
                break;
            case "subreddit":
                subredditViewCache.resetPagination();
                subredditViewCache.time = "year";
                break;
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.time = "year";
                break;
            case "user":
                userViewCache.resetPagination();
                userViewCache.time = "year";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by year!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.time;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * timeAll sets the all interval.
 * 
 * @param config 
 * @category Controller - Handler
 */
async function timeAll(config: IConfigData): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
        switch (config.view) {
            case "home":
                homeViewCache.resetPagination();
                homeViewCache.time = "all";
                break;
            case "search":
                searchViewCache.resetPagination();
                searchViewCache.time = "all";
                break;
            case "subreddit":
                subredditViewCache.resetPagination();
                subredditViewCache.time = "all";
                break;
            case "article":
                articleViewCache.resetPagination();
                articleViewCache.time = "all";
                break;
            case "user":
                userViewCache.resetPagination();
                userViewCache.time = "all";
                break;
            default:
                let error = `Error: ${config.view} view is not configured to be sorted by all!`;
                reject(error);
        }
        // after parsing the config accordingly to the command set the current 
        // view as command to create it with reusing the getView function
        config.command = config.view;
        delete config.time;
        getView(config)
            .then(response => {
                resolve(response);
            })
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * resetConfig resets the navigation relevant parts of the given config object.
 * 
 * @param config 
 * @category Controller - Handler
 */
function resetConfig(config: IConfigData): void {
    delete config.article_id;
    delete config.subreddit;
    delete config.username;
    delete config.search;
    delete config.after;
    delete config.before;
    delete config.count;
    delete config.sort;
    delete config.time;
    delete config.breadcrumb;
}