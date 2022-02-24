</br>
<div align="center">
  <img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/reddit-viewer.png" alt="Logo" width="250px"></img>
</div>
</br>
<div align="center">
  <h1>Not maintained anymore!</h1>
</div>
</br>
<div align="center">
  <h1>Reddit-Viewer</h1>
  <h2>A Visual Studio Code extension to browse Reddit. Provides a code-styled webview and a tree-view widget.</h2>
</div>
</br>

<img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/gifs/open.gif" alt="">

1. [Features](#features)
   1. [Widget](#widget)
      1. [Sort The Articles](#sort-the-articles)
      2. [Open An Article](#open-an-article)
   2. [Code Viewer](#code-viewer)
      1. [Open A Subreddit](#open-a-subreddit)
      2. [Global Search](#global-search)
      3. [Login](#login)
      4. [Frontpage](#frontpage)
      5. [Browse Articles](#browse-articles)
      6. [Browse Userpages](#browse-userpages)
      7. [Sort Articles And Comments](#sort-articles-and-comments)
      8. [Pagination](#pagination)
      9. [Change The Code Style](#change-the-code-style)
2. [Requirements](#requirements)
3. [Documentation](#documentation)
4. [Extension Settings](#extension-settings)
5. [Known Issues](#known-issues)
6. [Planned Features](#planned-features)
7. [Release Notes](#release-notes)

## Features

### Widget

The Reddit-Viewer widget enables an optional view to access the frontpage and your favorite subreddit fast and resource-friendly.

<img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/gifs/widget.gif" alt="">

#### Sort The Articles

Sort the articles in the widget by the default sort-types. You can define the default sort in the configuration.

<img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/gifs/widget-sort.gif" alt="">

### Open An Article

You can open the articles displayed in the widget in the code viewer or your default browser. The primary action can be defined in the configuration. The secondary action can be triggered in the context menu.

<img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/gifs/widget-open.gif" alt="">

### Code Viewer

The Reddit-Viewer code viewer is a webview which allows you to browse Reddit in code style. Even though it is a webview, it is pretty lightweight and simple.

<img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/gifs/code-viewer.gif" alt="">

#### Open A Subreddit

Open a subreddit and browse its articles. You can see a preview if the post contains a thumbnail.

<img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/gifs/code-viewer-subreddit.gif" alt="">

#### Global Search

Search through subreddits and articles.

<img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/gifs/code-viewer-search.gif" alt="">

#### Login

Login with your account to show the frontpage with your subscribed subreddits.

<img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/gifs/code-viewer-login.gif" alt="">

#### Frontpage

Browse your own frontpage or a subreddit of your choice.

<img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/gifs/code-viewer-frontpage.gif" alt="">

#### Browse Articles

Browse articles and show the selftexts or images.

<img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/gifs/code-viewer-article.gif" alt="">

#### Browse Userpages

Browse userpages and show the articles and comments of that user.

<img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/gifs/code-viewer-user.gif" alt="">

#### Sort Articles And Comments

You can sort articles and comments in every view with the default sort- and time-types.

<img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/gifs/code-viewer-sort.gif" alt="">

#### Pagination

Browse through multiple pages.

<img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/gifs/code-viewer-pagination.gif" alt="">

#### Change The Code Style

Change between the available code styles.

<img src="https://raw.githubusercontent.com/ekarbe/reddit-viewer/master/assets/gifs/code-viewer-style.gif" alt="">

## Requirements

This extension requires Visual Studio Code 1.40.x or later and an active connection to the internet to work properly.

## Documentation

The documentaion for this extension is available at [Reddit-Viewer Doc](https://ekarbe.github.io/reddit-viewer/).

## Extension Settings

This extension contributes the following settings:

- `RedditViewer.Title`: Controls the name of the webview panel.
- `RedditViewer.Style`: Controls the style to be used for the code viewer.
- `RedditViewer.UserManagement`: Enable/disable user management elements and requests.

</br>

- `RedditViewer.HomeTrending`: Enable/disable the trending subreddits in the home view.
- `RedditViewer.HomeFrontpage`: Enable/disable the article section in the home view.
- `RedditViewer.HomeFrontpageMine`: Enable/disable the own frontpage in the article section of the home view.
- `RedditViewer.HomeFrontpageSubreddit`: Controls the subreddit to be shown in the article section of the home view.
- `RedditViewer.HomeFrontpageLimit`: Controls the number of articles to be loaded in the article section of the home view.
- `RedditViewer.HomeFrontpageTime`: Controls the default time interval for the article section of the home view.
- `RedditViewer.HomeFrontpageSort`: Controls the default sort type for the article section of the home view.

</br>

- `RedditViewer.SearchLimit`: Controls the number of articles to be loaded in the search view.
- `RedditViewer.SearchTime`: Controls the default time interval in the search view.
- `RedditViewer.SearchSort`: Controls the default sort type in the search view.

</br>

- `RedditViewer.SubredditLimit`: Controls the number of articles to be loaded in the subreddit view.
- `RedditViewer.SubredditTime`: Controls the default time interval in the subreddit view.
- `RedditViewer.SubredditSort`: Controls the default sort type in the subreddit view.

</br>

- `RedditViewer.ArticleCommentLimit`: Controls the number of comments to be loaded in the article view.
- `RedditViewer.ArticleCommentDepth`: Controls the depth of the comments to be loaded in the article view.
- `RedditViewer.ArticleCommentSort`: Controls the default sort type in the subreddit view.

</br>

- `RedditViewer.UserLimit`: Controls the number of articles and comments to be loaded in the user view.
- `RedditViewer.UserTime`: Controls the default time interval in the user view.
- `RedditViewer.UserSort`: Controls the default sort type in the subreddit view.

</br>

- `RedditViewerWidget.Frontpage`: Enable/disable the frontpage provider in the widget.
- `RedditViewerWidget.FrontpageLimit`: Controls the number of articles to be loaded in the frontpage provider of the widget.
- `RedditViewerWidget.FrontpageTime`: Controls the default time interval in the frontpage provider of the widget.
- `RedditViewerWidget.FrontpageSort`: Controls the default sort type in the fronpage provider of the widget.

</br>

- `RedditViewerWidget.Subreddit`: Enable/disable the subreddit provider in the widget.
- `RedditViewerWidget.SubredditDefault`: Controls the subreddit to be shown in the subreddit provider of the widget.
- `RedditViewerWidget.SubredditLimit`: Controls the number of articles to be loaded in the subreddit provider of the widget.
- `RedditViewerWidget.SubredditTime`: Controls the default time interval in the subreddit provider of the widget.
- `RedditViewerWidget.SubredditSort`: Controls the default sort type in the subreddit provider of the widget.

</br>

- `RedditViewerWidget.OpenType`: Controls the type to be used when opening an article in the widget.

## Known Issues

- [Bug issue board](https://github.com/ekarbe/reddit-viewer/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

## Planned features

- [Enhancement issue board](https://github.com/ekarbe/reddit-viewer/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement)

## Contributing

- Please refer to the [CONTRIBUTING](CONTRIBUTING.md) file.

## Release Notes

For all releases take a look at the [Changelog](CHANGELOG.md).

### 2.0.0

- Migrated to TypeScript
- Added text markdown (selftext, comments)
- Better styling
- Added different code styles (TypeScript, PHP)
- Added widget
