import * as vscode from 'vscode';

export interface IConfigData {
  stylesheet?: vscode.Uri;
  context?: vscode.ExtensionContext;
  cookie?: string;
  active_user?: string;
  command?: string;
  args?: Array<string>;
  view?: string;
  subreddit?: string;
  article_id?: string;
  username?: string;
  search?: string;
  limit?: number;
  sort?: string;
  time?: string;
  count?: number;
  after?: string;
  before?: string;
  breadcrumb?: Array<string>;
  session?: boolean;
}

export class ViewCache {
  public after: string | undefined;
  public article_id: string | undefined;
  public before: string | undefined;
  public comment_id: string | undefined;
  public count: number | undefined;
  public depth: number | undefined;
  public limit: number | undefined;
  public multi: string | undefined;
  public search: string | undefined;
  public sort: string | undefined;
  public subreddit: string | undefined;
  public time: string | undefined;
  public username: string | undefined;

  constructor() { }

  // resets the whole cache
  reset(): void {
    delete this.after;
    delete this.article_id;
    delete this.before;
    delete this.comment_id;
    delete this.count;
    delete this.depth;
    delete this.limit;
    delete this.multi;
    delete this.search;
    delete this.sort;
    delete this.subreddit;
    delete this.time;
    delete this.username;
  }

  // resets the pagination
  resetPagination(): void {
    delete this.after;
    delete this.before;
    delete this.count;
  }
}

export interface IAPIData {
  after?: string;
  article_id?: string;
  before?: string;
  comment_id?: string;
  count?: number;
  depth?: number;
  limit?: number;
  multi?: string;
  password?: string;
  search?: string;
  sort?: string;
  subreddit?: string;
  time?: string;
  username?: string;
  cookie?: string;
  timeout?: number;
}

export interface ITemplateData {
  name?: string;
  username?: string;
  sort?: Array<string>;
  time?: Array<string>;
  article?: IGenericResult<IArticle>;
  trend?: ITrendsResult;
  breadcrumb?: Array<string>;
  param?: string;
  comment?: IComment;
  subreddits?: ISubredditSearchResult;
  tabSize?: number;
  user?: IUserAbout;
  view?: string;
  count?: number;
  after?: string;
  before?: string;
  tabsize?: number;
  active_user?: string;
  active_sort?: string;
  active_time?: string;
}

export interface IGenericResult<T> {
  kind: string;
  data: T;
}

export interface IListing<T> {
  modhash: string;
  children: Array<IGenericResult<T>>;
  after: string;
  before: string;
}

export interface IMulti {
  display_name: string;
  name: string;
  description_html: string;
  subreddits: Array<string>;
  created_utc: number;
  created: number;
  path: string;
  owner: string;
  description_md: string;
}

export interface IComment {
  edited: boolean;
  replies: IGenericResult<IListing<IComment>>;
  id: string;
  author: string;
  parent_id: string;
  score: number;
  body: string;
  body_html: string;
  permalink: string;
  created: number;
  subreddit: string;
  created_utc: number;
  subreddit_name_prefixed: string;
  original_poster: string;
}

export interface IArticle {
  subreddit: string;
  selftext: string;
  title: string;
  subreddit_name_prefixed: string;
  name: string;
  upvote_ratio: number;
  num_comments: number;
  thumbnail: string;
  edited: boolean;
  post_hint?: string;
  created: number;
  domain: string;
  selftext_html: string;
  score: number;
  subreddit_id: string;
  id: string;
  author: string;
  permalink: string;
  url: string;
  created_utc: string;
  is_self: boolean;
  media: any;
  is_video: boolean;
  is_reddit_media_domain: boolean;
}

export interface ISubredditAbout {
  display_name: string;
  title: string;
  active_user_count: number;
  subscribers: number;
  name: string;
  public_description: string;
  description_html: string;
  created: number;
  public_description_html: string;
  id: string;
  description: string;
  created_utc: number;
}

export interface IUserAbout {
  name: string;
  created: number;
  created_utc: number;
  link_karma: number;
  comment_karma: number;
  subreddit: ISubredditAbout;
  id: string;
}

export interface ITrendsResult {
  subreddit_names: Array<string>;
  comment_count: number;
  comment_url: string;
}

export interface ISubredditSearchResult {
  names: Array<string>;
}
