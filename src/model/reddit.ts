// reddit.ts
// exports the api functions to access reddits data
// every function should return the unaltered response of the call
// the resulting data should be processed in a controller

import * as rm from 'typed-rest-client/RestClient';

import { IAPIData, IListing, ITrendsResult, ISubredditAbout, IGenericResult, IArticle, IComment, IUserAbout, IMulti, ISubredditSearchResult } from '../interfaces';

/**
 * Defines the base host.
 */
const baseHost: string = "https://reddit.com/";
/**
 * Defines the old version of base host because some functions need it.
 */
const oldBaseHost: string = "https://old.reddit.com/";
/**
 * Defines the ssl version of base host because login needs it.
 */
const secureBaseHost: string = "https://ssl.reddit.com/";

/**
 * The allowed sorting types for articles.
 */
const articleSortTypes: ReadonlyArray<string> = ["hot", "new", "controversial", "top", "rising"];
/**
 * The allowed sorting types for comments.
 */
const commentSortTypes: ReadonlyArray<string> = ["confidence", "new", "old", "controversial", "top", "qa"];
/**
 * The allowed sorting types for user pages.
 */
const userSortTypes: ReadonlyArray<string> = ["new", "hot", "top", "controversial"];
/**
 * The allowed sorting types for search results.
 */
const searchSortTypes: ReadonlyArray<string> = ["new", "relevance", "top", "comments"];
/**
 * The allowed sorting types for self pages.
 */
const mineSortTypes: ReadonlyArray<string> = ["best", "hot", "new", "controversial", "top", "rising"];

/**
 * The allowed time types for articles.
 */
const articleTimeTypes: ReadonlyArray<string> = ["hour", "day", "week", "month", "year", "all"];
/**
 * The allowed time types for user pages.
 */
const userTimeTypes: ReadonlyArray<string> = articleTimeTypes;
/**
 * The allowed time types for self pages.
 */
const mineTimeTypes: ReadonlyArray<string> = articleTimeTypes;
/**
 * The allowed time types for search results.
 */
const searchTimeTypes: ReadonlyArray<string> = articleTimeTypes;

/**
 * Requests the current trending subreddits.
 * 
 * @param data `IAPIData` object
 * @returns `ITrendsResult` object
 * @category API - Subreddit
 */
export async function getSubredditTrend(data: IAPIData): Promise<ITrendsResult> {
    return new Promise<ITrendsResult>(async (resolve, reject) => {
        if (baseHost) {
            const rest: rm.RestClient = new rm.RestClient('subreddit.trend', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "api/trending_subreddits/.json?";
            url += "raw_json=1";
            rest.get<ITrendsResult>(url)
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getSubredditTrend got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            reject(error);
        }
    });
}

/**
 * Requests the detailed information of a subreddit.
 * 
 * @param data `IAPIData` object
 * @required data.subreddit
 * @returns `IGenericResult` object
 * @category API - Subreddit
 */
export async function getSubredditDetail(data: IAPIData): Promise<IGenericResult<ISubredditAbout>> {
    return new Promise<IGenericResult<ISubredditAbout>>(async (resolve, reject) => {
        if (baseHost && data.subreddit) {
            const rest: rm.RestClient = new rm.RestClient('subreddit.detail', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "r/" + encodeURIComponent(data.subreddit) + "/about/.json?";
            url += "raw_json=1";
            rest.get<IGenericResult<ISubredditAbout>>(url)
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getSubredditDetail got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            error += data.subreddit ? "" : "subreddit\n";
            reject(error);
        }
    });
}

/**
 * Requests a list of articles of a subreddit
 * 
 * @param data `IAPIData` object
 * @required data.subreddit
 * @optional data.sort
 * @optional data.time
 * @optional data.count
 * @optional data.after
 * @optional data.before
 * @optional data.limit
 * @optional data.depth
 * @returns `IGenericResult` object
 * @category API - Subreddit
 */
export async function getSubredditArticle(data: IAPIData): Promise<IGenericResult<IListing<IArticle>>> {
    return new Promise<IGenericResult<IListing<IArticle>>>(async (resolve, reject) => {
        if (baseHost && data.subreddit) {
            const rest: rm.RestClient = new rm.RestClient('subreddit.article', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "r/" + encodeURIComponent(data.subreddit) + "/";
            // check for sortation
            if (data.sort && articleSortTypes.indexOf(data.sort) >= 0) {
                url += data.sort + "/";
            }
            url += ".json?";
            // check for time option
            if (data.time && articleTimeTypes.indexOf(data.time) >= 0) {
                url += "t=" + data.time + "&";
            }
            // check for pagination options with XOR as only one of after/before should be set
            if (data.count && (data.after ? !data.before : data.before)) {
                url += "count=" + data.count + "&";
                if (data.after) {
                    url += "after=" + data.after + "&";
                } else if (data.before) {
                    url += "before=" + data.before + "&";
                }
            }
            // check for limit option
            if (data.limit && data.limit > 0) {
                url += "limit=" + data.limit + "&";
            }
            // check for depth option
            if (data.depth && data.depth > 0) {
                url += "depth=" + data.depth + "&";
            }
            url += "raw_json=1";
            rest.get<IGenericResult<IListing<IArticle>>>(url)
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getSubredditArticle got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            error += data.subreddit ? "" : "subreddit\n";
            reject(error);
        }
    });
}

/**
 * Requests the article details and its comments.
 * 
 * @param data `IAPIData` object
 * @required data.subreddit
 * @required data.article_id
 * @optional data.sort
 * @optional data.limit
 * @optional data.depth
 * @returns `IGenericResult` object
 * @category API - Article
 */
export async function getArticleDetail(data: IAPIData): Promise<[IGenericResult<IListing<IArticle>>, IGenericResult<IListing<IComment>>]> {
    return new Promise<[IGenericResult<IListing<IArticle>>, IGenericResult<IListing<IComment>>]>(async (resolve, reject) => {
        if (baseHost && data.subreddit && data.article_id) {
            const rest: rm.RestClient = new rm.RestClient('article.detail', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "r/" + encodeURIComponent(data.subreddit) + "/comments/" + data.article_id;
            url += "/.json?";
            // check for sortation option
            if (data.sort && commentSortTypes.indexOf(data.sort) >= 0) {
                url += "sort=" + data.sort + "&";
            }
            // check for limit option
            if (data.limit && data.limit > 0) {
                url += "limit=" + data.limit + "&";
            }
            // check for depth option
            if (data.depth && data.depth > 0) {
                url += "depth=" + data.depth + "&";
            }
            url += "raw_json=1";
            rest.get<[IGenericResult<IListing<IArticle>>, IGenericResult<IListing<IComment>>]>(url)
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getArticleDetail got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            error += data.subreddit ? "" : "subreddit\n";
            error += data.article_id ? "" : "article_id\n";
            reject(error);
        }
    });
}

/**
 * Requests a comment of an article.
 * 
 * @param data `IAPIData` object
 * @required data.subreddit
 * @required data.article_id
 * @required data.comment_id
 * @optional data.sort
 * @optional data.limit
 * @optional data.depth
 * @returns `IGenericResult` object
 * @category API - Article
 */
export async function getArticleComment(data: IAPIData): Promise<[IGenericResult<IListing<IArticle>>, IGenericResult<IListing<IComment>>]> {
    return new Promise<[IGenericResult<IListing<IArticle>>, IGenericResult<IListing<IComment>>]>(async (resolve, reject) => {
        if (baseHost && data.subreddit && data.article_id && data.comment_id) {
            const rest: rm.RestClient = new rm.RestClient('article.comment', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "r/" + encodeURIComponent(data.subreddit) + "/comments/" + data.article_id + "/comment/" + data.comment_id;
            url += "/.json?";
            // check for sortation option
            if (data.sort && commentSortTypes.indexOf(data.sort) >= 0) {
                url += "sort=" + data.sort + "&";
            }
            // check for limit option
            if (data.limit && data.limit > 0) {
                url += "limit=" + data.limit + "&";
            }
            // check for depth option
            if (data.depth && data.depth > 0) {
                url += "depth=" + data.depth + "&";
            }
            url += "raw_json=1";
            rest.get<[IGenericResult<IListing<IArticle>>, IGenericResult<IListing<IComment>>]>(url)
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getArticleComment got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            error += data.subreddit ? "" : "subreddit\n";
            error += data.article_id ? "" : "article_id\n";
            error += data.comment_id ? "" : "comment_id\n";
            reject(error);
        }
    });
}

/**
 * Requests the page of an user with articles and comments.
 * 
 * @param data `IAPIData` object
 * @required data.username
 * @optional data.sort
 * @optional data.time
 * @optional data.count
 * @optional data.after
 * @optional data.before
 * @optional data.limit
 * @returns `IGenericResult` object
 * @category API - User
 */
export async function getUserPage(data: IAPIData): Promise<IGenericResult<IListing<IArticle | IComment>>> {
    return new Promise<IGenericResult<IListing<IArticle | IComment>>>(async (resolve, reject) => {
        if (baseHost && data.username) {
            const rest: rm.RestClient = new rm.RestClient('user.page', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "user/" + encodeURIComponent(data.username) + "/.json?";
            // check sortation option
            if (data.sort && userSortTypes.indexOf(data.sort) >= 0) {
                url += "sort=" + data.sort + "&";
            }
            // check time option
            if (data.time && userTimeTypes.indexOf(data.time) >= 0) {
                url += "t=" + data.time + "&";
            }
            // check for pagination options with XOR as only one of after/before should be set
            if (data.count && (data.after ? !data.before : data.before)) {
                url += "count=" + data.count + "&";
                if (data.after) {
                    url += "after=" + data.after + "&";
                } else if (data.before) {
                    url += "before=" + data.before + "&";
                }
            }
            // check limit option
            if (data.limit && data.limit > 0) {
                url += "limit=" + data.limit + "&";
            }
            url += "raw_json=1";
            rest.get<IGenericResult<IListing<IArticle | IComment>>>(url)
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getUserPage got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            error += data.username ? "" : "username\n";
            reject(error);
        }
    });
}

/**
 * Requests the about data of an user.
 * 
 * @param data `IAPIData` object
 * @required data.username
 * @returns `IGenericResult` object
 * @category API - User
 */
export async function getUserAbout(data: IAPIData): Promise<IGenericResult<IUserAbout>> {
    return new Promise<IGenericResult<IUserAbout>>(async (resolve, reject) => {
        if (baseHost && data.username) {
            const rest: rm.RestClient = new rm.RestClient('user.about', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "user/" + encodeURIComponent(data.username) + "/about/.json?";
            url += "raw_json=1";
            rest.get<IGenericResult<IUserAbout>>(url)
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getUserAbout got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            error += data.username ? "" : "username\n";
            reject(error);
        }
    });
}

/**
 * Requests the articles submitted by an user.
 * 
 * @param data `IAPIData` object
 * @required data.username
 * @optional data.sort
 * @optional data.time
 * @optional data.count
 * @optional data.after
 * @optional data.before
 * @optional data.limit
 * @returns `IGenericResult` object
 * @category API - User
 */
export async function getUserSubmitted(data: IAPIData): Promise<IGenericResult<IListing<IArticle>>> {
    return new Promise<IGenericResult<IListing<IArticle>>>(async (resolve, reject) => {
        if (baseHost && data.username) {
            const rest: rm.RestClient = new rm.RestClient('user.submitted', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "user/" + encodeURIComponent(data.username) + "/submitted/.json?";
            // check sortation option
            if (data.sort && userSortTypes.indexOf(data.sort) >= 0) {
                url += "sort=" + data.sort + "&";
            }
            // check time option
            if (data.time && userTimeTypes.indexOf(data.time) >= 0) {
                url += "t=" + data.time + "&";
            }
            // check for pagination options with XOR as only one of after/before should be set
            if (data.count && (data.after ? !data.before : data.before)) {
                url += "count=" + data.count + "&";
                if (data.after) {
                    url += "after=" + data.after + "&";
                } else if (data.before) {
                    url += "before=" + data.before + "&";
                }
            }
            // check limit option
            if (data.limit && data.limit > 0) {
                url += "limit=" + data.limit + "&";
            }
            url += "raw_json=1";
            rest.get<IGenericResult<IListing<IArticle>>>(url)
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getUserSubmitted got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            error += data.username ? "" : "username\n";
            reject(error);
        }
    });
}

/**
 * Requests the comments submitted by an user.
 * 
 * @param data `IAPIData` object
 * @required data.username
 * @optional data.sort
 * @optional data.time
 * @optional data.count
 * @optional data.after
 * @optional data.before
 * @optional data.limit
 * @returns `IGenericResult` object
 * @category API - User
 */
export async function getUserComment(data: IAPIData): Promise<IGenericResult<IListing<IComment>>> {
    return new Promise<IGenericResult<IListing<IComment>>>(async (resolve, reject) => {
        if (baseHost && data.username) {
            const rest: rm.RestClient = new rm.RestClient('user.comment', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "user/" + encodeURIComponent(data.username) + "/comments/.json?";
            // check sortation option
            if (data.sort && userSortTypes.indexOf(data.sort) >= 0) {
                url += "sort=" + data.sort + "&";
            }
            // check time option
            if (data.time && userTimeTypes.indexOf(data.time) >= 0) {
                url += "t=" + data.time + "&";
            }
            // check for pagination options with XOR as only one of after/before should be set
            if (data.count && (data.after ? !data.before : data.before)) {
                url += "count=" + data.count + "&";
                if (data.after) {
                    url += "after=" + data.after + "&";
                } else if (data.before) {
                    url += "before=" + data.before + "&";
                }
            }
            // check limit option
            if (data.limit && data.limit > 0) {
                url += "limit=" + data.limit + "&";
            }
            url += "raw_json=1";
            rest.get<IGenericResult<IListing<IComment>>>(url)
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getUserComment got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            error += data.username ? "" : "username\n";
            reject(error);
        }
    });
}

/**
 * Requests the multi subreddits of an user.
 * 
 * @param data `IAPIData` object
 * @required data.username
 * @returns `Array`
 * @category API - Multi
 */
export async function getUserMulti(data: IAPIData): Promise<Array<IGenericResult<IMulti>>> {
    return new Promise<Array<IGenericResult<IMulti>>>(async (resolve, reject) => {
        if (baseHost && data.username) {
            const rest: rm.RestClient = new rm.RestClient('user.multi', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "api/multi/user/" + encodeURIComponent(data.username) + "?raw_json=1";
            rest.get<Array<IGenericResult<IMulti>>>(url)
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getUserMulti got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            error += data.username ? "" : "username\n";
            reject(error);
        }
    });
}

/**
 * Requests the articles in a multi subreddit.
 * 
 * @param data `IAPIData` object
 * @required data.username
 * @required data.multi
 * @optional data.sort
 * @optional data.time
 * @optional data.count
 * @optional data.after
 * @optional data.before
 * @optional data.limit
 * @returns `IGenericResult` object
 * @category API - Multi
 */
export async function getMultiArticle(data: IAPIData): Promise<IGenericResult<IListing<IArticle>>> {
    return new Promise<IGenericResult<IListing<IArticle>>>(async (resolve, reject) => {
        if (baseHost && data.username && data.multi) {
            const rest: rm.RestClient = new rm.RestClient('multi.article', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "user/" + encodeURIComponent(data.username) + "/m/" + encodeURIComponent(data.multi);
            if (data.sort && articleSortTypes.indexOf(data.sort) >= 0) {
                url += "/" + data.sort;
            }
            url += "/.json?";
            // check for time option
            if (data.time && articleTimeTypes.indexOf(data.time) >= 0) {
                url += "t=" + data.time + "&";
            }
            // check for pagination options with XOR as only one of after/before should be set
            if (data.count && (data.after ? !data.before : data.before)) {
                url += "count=" + data.count + "&";
                if (data.after) {
                    url += "after=" + data.after + "&";
                } else if (data.before) {
                    url += "before=" + data.before + "&";
                }
            }
            // check for limit option
            if (data.limit && data.limit > 0) {
                url += "limit=" + data.limit + "&";
            }
            url += "raw_json=1";
            rest.get<IGenericResult<IListing<IArticle>>>(url)
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getMultiArticle got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            error += data.username ? "" : "username\n";
            error += data.multi ? "" : "multi\n";
            reject(error);
        }
    });
}

/**
 * Requests the frontpage of the logged in user.
 * 
 * @param data `IAPIData` object
 * @optional data.sort
 * @optional data.time
 * @optional data.count
 * @optional data.after
 * @optional data.before
 * @optional data.limit
 * @returns `IGenericResult` object
 * @category API - Mine
 */
export async function getMine(data: IAPIData): Promise<IGenericResult<IListing<IArticle>>> {
    return new Promise<IGenericResult<IListing<IArticle>>>(async (resolve, reject) => {
        if (baseHost) {
            const rest: rm.RestClient = new rm.RestClient('mine', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "";
            // check for sortation
            if (data.sort && mineSortTypes.indexOf(data.sort) >= 0) {
                url += "/" + data.sort + "/";
            }
            url += ".json?";
            // check for time option
            if (data.time && mineTimeTypes.indexOf(data.time) >= 0) {
                url += "t=" + data.time + "&";
            }
            // check for pagination options with XOR as only one of after/before should be set
            if (data.count && (data.after ? !data.before : data.before)) {
                url += "count=" + data.count + "&";
                if (data.after) {
                    url += "after=" + data.after + "&";
                } else if (data.before) {
                    url += "before=" + data.before + "&";
                }
            }
            // check for limit option
            if (data.limit && data.limit > 0) {
                url += "limit=" + data.limit + "&";
            }
            url += "raw_json=1";
            if(!data.cookie){ data.cookie = ""; }
            rest.get<IGenericResult<IListing<IArticle>>>(url, {
                additionalHeaders: {
                    "Cookie": "reddit_session=" + data.cookie
                }
            })
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getMine got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            reject(error);
        }
    });
}

/**
 * Requests the multi subreddits of the logged in user.
 * 
 * @param data `IAPIData` object
 * @returns `IGenericResult` array
 * @category API - Multi
 */
export async function getMineMulti(data: IAPIData): Promise<Array<IGenericResult<IMulti>>> {
    return new Promise<Array<IGenericResult<IMulti>>>(async (resolve, reject) => {
        if (baseHost) {
            const rest: rm.RestClient = new rm.RestClient('mine.multi', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "api/multi/mine?raw_json=1";
            if(!data.cookie){ data.cookie = ""; }
            await rest.get<Array<IGenericResult<IMulti>>>(url, {
                additionalHeaders: {
                    "Cookie": "reddit_session=" + encodeURIComponent(data.cookie)
                }
            })
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getMineMulti got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            reject(error);
        }
    });
}

/**
 * Requests the subreddit result of a query.
 * 
 * @param data `IAPIData` object
 * @required data.search
 * @returns `ISubredditSearchResult` object
 * @category API - Search
 */
export async function getSearchSubreddit(data: IAPIData): Promise<ISubredditSearchResult> {
    return new Promise<ISubredditSearchResult>(async (resolve, reject) => {
        if (baseHost && data.search) {
            const rest: rm.RestClient = new rm.RestClient('search.subreddit', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "api/search_reddit_names/.json?query=" + encodeURIComponent(data.search) + "&";
            url += "raw_json=1";
            rest.get<ISubredditSearchResult>(url)
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getSearchSubreddit got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            error += data.search ? "" : "search\n";
            reject(error);
        }
    });
}

/**
 * Requests the article result for a query.
 * 
 * @param data `IAPIData` object
 * @required data.search
 * @optional data.sort
 * @optional data.time
 * @optional data.count
 * @optional data.after
 * @optional data.before
 * @optional data.limit
 * @returns `IGenericResult` object
 * @category API - Search
 */
export async function getSearchArticle(data: IAPIData): Promise<IGenericResult<IListing<IArticle>>> {
    return new Promise<IGenericResult<IListing<IArticle>>>(async (resolve, reject) => {
        if (baseHost && data.search) {
            const rest: rm.RestClient = new rm.RestClient('search.article', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "search/.json?q=" + encodeURIComponent(data.search) + "&";
            // check for sortation
            if (data.sort && searchSortTypes.indexOf(data.sort) >= 0) {
                url += "sort=" + data.sort + "&";
            }
            // check for time option
            if (data.time && searchTimeTypes.indexOf(data.time) >= 0) {
                url += "t=" + data.time + "&";
            }
            // check for pagination options with XOR as only one of after/before should be set
            if (data.count && (data.after ? !data.before : data.before)) {
                url += "count=" + data.count + "&";
                if (data.after) {
                    url += "after=" + data.after + "&";
                } else if (data.before) {
                    url += "before=" + data.before + "&";
                }
            }
            // check for limit option
            if (data.limit && data.limit > 0) {
                url += "limit=" + data.limit + "&";
            }
            url += "raw_json=1";
            rest.get<IGenericResult<IListing<IArticle>>>(url)
                .then(response => {
                    if (response.result) {
                        resolve(response.result);
                    } else {
                        reject("Error: func getSearchArticle got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += baseHost ? "" : "baseHost\n";
            error += data.search ? "" : "search\n";
            reject(error);
        }
    });
}

/**
 * loginUser tries to log a user in and returns session cookies
 * URL: https://ssl.reddit.com/api/login/$USERNAME$?api_type=json&username=$USERNAME$&password=$PASSWORD$
 * 
 * @param data IAPIData interface with all data
 * @required data.username
 * @required data.password
 * @returns success data
 * @category API - Authentication
 */
export async function loginUser(data: IAPIData): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        if (secureBaseHost && data.username && data.password) {
            const rest: rm.RestClient = new rm.RestClient('login.user', secureBaseHost, undefined, { socketTimeout: data.timeout });
            let url: string = "api/login/" + encodeURIComponent(data.username) + "?api_type=json&user=" + encodeURIComponent(data.username) + "&passwd=" + encodeURIComponent(data.password);
            rest.create<any>(url, {
                additionalHeaders: {
                    "user-agent": "Reddit-Viewer / 2.0.0"
                }
            })
                .then(response => {
                    console.log(response);
                    if (response.statusCode === 200 && response.result && response.result.json) {
                        resolve(response.result.json.data);
                    } else {
                        reject("Error: func loginUser got empty result\n Responsecode: " + response.statusCode);
                    }
                })
                .catch(error => {
                    reject(error.message);
                });
        } else {
            let error: string = "Error: required params are missing!\n";
            error += secureBaseHost ? "" : "secureBaseHost\n";
            error += data.username ? "" : "username\n";
            error += data.password ? "" : "password\n";
            reject(error);
        }
    });
}

/**
 * checkSession gets the base page of reddit to check if a modhash is returned.
 * If the modhash is returned the cookie is valid and the user is logged in.
 * Limited to 1 object, to speed up the request.
 * URL: https://reddit.com/.json?limit=1
 * 
 * @param data IAPIData interface with all data
 * @required data.cookie
 * @returns success
 * @category API - Authentication
 */
export async function checkSession(data: IAPIData): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
        if (baseHost && data.cookie) {
            const rest: rm.RestClient = new rm.RestClient('check.session', baseHost, undefined, { socketTimeout: data.timeout });
            let url: string = ".json?limit=1";
            rest.get<IGenericResult<IListing<IArticle>>>(url, {
                additionalHeaders: {
                    "Cookie": "reddit_session=" + encodeURIComponent(data.cookie)
                }
            })
                .then(response => {
                    if (response.result) {
                        if (response.result.data.modhash !== "") {
                            resolve();
                        } else {
                            let error = `Error: session not active`;
                            reject(error);
                        }
                    } else {
                        let error = `Error: response is empty`;
                        reject(error);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        }
    });
}