/**
 * The _templates.ts file gives a template for creating a new *Templates.ts file.
 * This is used to add new Languages to the view creation.
 * 
 * Prefilled sections can and should be copy pasted.
 * 
 * Every subreddit, article and user field should be
 * a reference to the object. This is done with the handleMessageSending function.
 * 
 * I know that using a file for every language is not the prettiest,
 * best maintainable or even a good solution for the feature.
 */

/**
 * Import the used interfaces.
 */
import { ITemplateData, IConfigData } from "../interfaces";

/**
 * The `head` function returns the head of the HTML string.
 * It contains the link to the stylesheet to load the colors
 * of element types. The stylesheet path needs to be formatted as
 * vscode webview uri and can be found in the config param.
 * 
 * To pass the editor font configuration to the template the parameter
 * `fontFamily`, `fontSize`, `fontWeight` and `fontHeight` are used.
 * 
 * The `onload="scrollTop()"` in the body is used to reset the scroll-level
 * back to the top when changing a view. The `scrollTop` function can be found in
 * `script()`.
 * 
 * ```html
 *  <!DOCTYPE html>
 *  <html lang="en">
 *  <head>
 *    <meta charset="UTF-8">
 *    <meta name="viewport" content="width=device-width, initial-scale=1.0">
 *    <link rel="stylesheet" href="${data.stylesheet}">
 *  </head>
 *    <body onload="scrollTop()" style="
 *     font-family: ${data.fontFamily};
 *     font-size: ${data.fontSize}px;
 *     font-weight: ${data.fontWeight};
 *     line-height: ${data.lineHeight}px;
 *   ">
 * ```
 * 
 * @param config 
 * @category View - Template
 */
export function head(data: any): string {
  let HTML: string = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="${data.stylesheet}">
  </head>
    <body onload="scrollTop()" style="
      font-family: ${data.fontFamily};
      font-size: ${data.fontSize}px;
      font-weight: ${data.fontWeight};
      line-height: ${data.lineHeight}px;
    ">
  `;
  return HTML;
}

/**
 * The `tail` function returns the tail of the HTML string.
 * It closes the body and html tag.
 * 
 * ```html
 *  </body>
 *  </html>
 * ```
 * 
 * @category View - Template
 */
export function tail(): string {
  let HTML: string = `</body></html>`;
  return HTML;
}

/**
 * The `script` function returns the script section of the HTML string.
 * It's functions are absolutely necessary for Reddit-Viewer to work.
 * 
 * 
 * 
 * The function `handleMessageSending` is used to send messages to the vscode webview.
 * It contains the params `command`, `view` and `args`.
 * - command: The action to be executed. E.g. when opening a subreddit the command is `subreddit`.
 * - view: The view from which the command is fired. E.g. when opening a subreddit from the home
 * view the view is `home`.
 * - args: Array of optional arguments for the command. E.g. when opening a subreddit the name of
 * subreddit is needed and is provided as `arg[0]`.
 * 
 * Code:
 * ```javascript
 * \// get an instance of the vscode api
 * const vscode = acquireVsCodeApi();
 * 
 * \// handle vscode extension message passing (from webview to extension)
 * function handleMessageSending(command, view, args) {
 *   vscode.postMessage({
 *     command: command,
 *     view: view,
 *     args: args,
 *   });
 * }
 * ```
 * 
 * Usage:
 * ```html
 * <a href="" onclick="handleMessageSending('foo', 'bar', 'pub')">
 * ```
 * 
 * The function `executeSearch` is used to retrieve the value of the
 * search input field, validate it and then parse it to be send to
 * the vscode webview.
 * - view: The view from which the command is fired. E.g. when opening a subreddit from the home
 * view the view is `home`.
 * 
 * Code:
 * ```javascript
 * \// execute the search
 * function executeSearch(view) {
 *   let val = document.getElementById('searchQuery').value;
 *   if(val.trim().length != 0){
 *     let args = [];
 *     args.push(val);
 *     handleMessageSending('search', view, args);
 *   } else {
 *     val = "";
 *     \// error
 *   }
 * }
 * ```
 * 
 * Usage:
 * ```html
 *  <a href="" onclick="executeSearch('foo')">
 * ```
 * 
 * The function `openSubreddit` is used to retrieve the value of the
 * open input field, validate it and then parse it to be send to the 
 * vscode webview.
 * - view: The view from which the command is fired. E.g. when opening a subreddit from the home
 * view the view is `home`.
 * 
 * Code:
 * ```javascript
 * \// open a subreddit
 * function openSubreddit(view) {
 *   let val = document.getElementById('openQuery').value;
 *   if(val.trim().length != 0){
 *     let args = [];
 *     args.push(val);
 *     handleMessageSending('subreddit', view, args);
 *   } else {
 *     val = "";
 *     \// error
 *   }
 * }
 * ```
 * 
 * Usage:
 * ```html
 *  <a href="" onclick="openSubreddit('foo')">
 * ```
 * 
 * The `login` function is used to send the login information to the 
 * extension script. It will color the inputs red if there is missing 
 * information.
 * 
 * Code:
 * ```javascript
 * \// log the user into reddit
 *   function login() {
 *     let username = document.getElementById('username').value;
 *     let password = document.getElementById('password').value;
 *     if(username.trim().length != 0 && password.trim().length != 0) {
 *       let args = [];
 *       args.push(username);
 *       args.push(password);
 *       handleMessageSending('login', 'home', args);
 *     } else {
 *       document.getElementById('username').style.color = "red";
 *       document.getElementById('password').style.color = "red";
 *     }
 *   }
 * ```
 * 
 * Usage:
 * ```html
 *  <a onclick="login()"></a>
 * ```
 * 
 * The function `resetError` is used to reset the styling for
 * incorrect login input.
 * 
 * Code:
 * ```javascript
 * \// reset the error colors of the login
 *   function resetError() {
 *     document.getElementById('username').style.color = "inherit";
 *     document.getElementById('password').style.color = "inherit";
 *   }
 * ```
 * 
 * Usage:
 * ```html
 *  <input onfocus="resetError()">
 * ```
 * 
 * The function `expandElement` is used to change the display style
 * of a given element to make it appear or disappear.
 * It is used used to unhide/hide media and comments.
 * - id: The id of the element to be expanded. E.g. if the element with the id `foo` should
 * be hidden/unhidden the id is `foo`.
 * 
 * Code:
 * ```javascript
 * \// switches between display:none and display:initial
 * function expandElement(id) {
 *   element = document.getElementById(id);
 *   if(element.style.display === "none") {
 *     element.style.display = "initial";
 *   } else {
 *     element.style.display = "none";
 *   }
 * }
 * ```
 * 
 * Usage:
 * ```html
 *  <a href="" onclick="expandElement('foo')">
 * ```
 * 
 * The function `scrollTop` is used to set the scroll-level of
 * the webview to zero. If this isn't done the webview would stay 
 * on the same level after changing views.
 * 
 * Code:
 * ```javascript
 * \// called on body load
 * \// scrolls to top
 * function scrollTop() {
 *   document.body.scrollTop = document.documentElement.scrollTop = 0;
 * }
 * ```
 * 
 * Usage:
 * ```html
 *  <body onload="scrollTop()">
 * ```
 * 
 * The function `checkKey` checks a keyup event for
 * the keycode and fires the action of the element
 * if the pressed key is enter.
 * 
 * Code:
 * ```javascript
 * \// checks if enter is pressed
 *  function checkKey(element) {
 *    if(event.keyCode === 13) {
 *      switch(element){
 *        case "search":
 *            executeSearch('home');
 *            break;
 *        case "open":
 *            openSubreddit('home');
 *            break;
 *        case "login":
 *            login();
 *            break;
 *        default:
 *            break;
 *      }
 *    }
 *  }
 * ```
 * 
 * Usage:
 * ```html
 *  <input onkeyup="checkKey('foo')">
 * ```
 * 
 * @category View - Template
 */
export function script(): string {
  let HTML: string = `
  <script>
		const vscode = acquireVsCodeApi();

		// handle vscode extension message passing (from webview to extension)
		function handleMessageSending(command, view, args) {
			vscode.postMessage({
				command: command,
        view: view,
        args: args,
			});
    }

    // execute the search
    function executeSearch(view) {
      let val = document.getElementById('searchQuery').value;
      if(val.trim().length != 0){
        let args = [];
        args.push(val);
        handleMessageSending('search', view, args);
      } else {
        val = "";
        // error
      }
    }

    // open a subreddit
    function openSubreddit(view) {
      let val = document.getElementById('openQuery').value;
      if(val.trim().length != 0){
        let args = [];
        args.push(val);
        handleMessageSending('subreddit', view, args);
      } else {
        val = "";
        // error
      }
    }

    // log the user into reddit
    function login() {
      let username = document.getElementById('username').value;
      let password = document.getElementById('password').value;
      if(username.trim().length != 0 && password.trim().length != 0) {
        let args = [];
        args.push(username);
        args.push(password);
        handleMessageSending('login', 'home', args);
      } else {
        document.getElementById('username').style.color = "red";
        document.getElementById('password').style.color = "red";
      }
    }

    // reset the error colors of the login
    function resetError() {
      document.getElementById('username').style.color = "inherit";
      document.getElementById('password').style.color = "inherit";
    }

    // switches between display:none and display:inherit
    function expandElement(id) {
      element = document.getElementById(id);
      if(element.style.display === "none") {
        element.style.display = "initial";
      } else {
        element.style.display = "none";
      }
    }

    // called on body load
    // scrolls to top
    function scrollTop() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    // checks if enter is pressed
    function checkKey(element) {
      if(event.keyCode === 13) {
        switch(element){
          case "search":
              executeSearch('home');
              break;
          case "open":
              openSubreddit('home');
              break;
          case "login":
              login();
              break;
          default:
              break;
        }
      }
    }

	</script>
  `;
  return HTML;
}

/**
 * The `functionHead` function returns the head of a function section.
 * A function section encloses other templates and should always close with 
 * the `functionTail` function.
 * 
 * There are no functional parts in this template section.
 * 
 * Javascript example:
 * ```javascript
 *  function name(param) {
 * ```
 * 
 * @param data 
 * @category View - Template
 */
export function functionHead(data: ITemplateData): string {
  return "template";
}

/**
 * The `functionTail` function returns the tail of a function section.
 * This is needed to close the div of the section and should contain a
 * suitable closing to the head.
 * 
 * Javascript example:
 * ```javascript
 *  }
 * ```
 * 
 * @category View - Template
 */
export function functionTail(): string {
  return "template";
}

/**
 * The `lineComment` function returns the HTML string of a line comment.
 * It is used to display the view name and additional info like the 
 * description of a subreddit.
 * 
 * Javascript example:
 * ```javascript
 * \// COMMENT
 * ```
 * 
 * @param comment 
 * @category View - Template
 */
export function lineComment(comment: string): string {
  return "template";
}

/**
 * The `open` function returns the HTML string of the section to open
 * a subreddit. It needs to contain an element to fire the `openSubreddit`
 * function and an input element with the id `openQuery`.
 * 
 * - `openSubreddit` element example:
 * ```html
 *  <a href="" onlcick="openSubreddit('foo')">
 * ```
 * 
 * - `openQuery` input example:
 * ```html
 *  <input id="openQuery">
 * ```
 * 
 * Javascript example:
 * ```javascript
 * open("____________");
 * ```
 * 
 * @category View - Template
 */
export function open(): string {
  return "template";
}

/**
 * The `search` function returns the HTML string of the section to search
 * for subreddits and articles. It needs to contain an element to fire the 
 * `executeSearch` function and an input element with the id `searchQuery`.
 * 
 * - `executeSearch` element example:
 * ```html
 *  <a onclick="executeSearch('foo')">
 * ```
 * 
 * - `searchQuery` input example:
 * ```html
 *  <input id="searchQuery">
 * ```
 * 
 * Javascript example:
 * ```javascript
 * search("____________");
 * ```
 * 
 * @category View - Template
 */
export function search(): string {
  return "template";
}

/**
 * The `login` function returns the HTML string of the section to log an account
 * into reddit. It needs to contain two input fields for the username and password.
 * It needs a field to fire the `login` function.
 * 
 * - `login` element example:
 * ```
 *  <a onclick="login()">
 * ```
 * 
 * - Input example:
 * ```
 *  <input id="username"> <input id="password">
 * ```
 * 
 * Javascript example:
 * ```javascript
 *  login(____________, ____________);
 * ```
 * 
 * @category View - Template
 */
export function login(): string {
  return "template";
}

/**
 * The `logout` function returns the HTML string of the section to log an account
 * out of reddit. It needs to contain an element that fires the `handleMessageSending`
 * to send the `logout` command to the extension.
 * 
 * - Logout command example:
 * ```html
 *  <a onclick="handleMessageSending('logout', view, args)">
 * ```
 * 
 * Javascript example:
 * ```javascript
 *  logout(username);
 * ```
 * 
 * @param data 
 * @category View - Template
 */
export function logout(data: ITemplateData): string {
  return "template";
}

/**
 * The `trend` function returns the HTML string of the section to browse the
 * currently trending subreddits. The names need to fire the `subreddit` command
 * to the extension and contain its name in the args param.
 * 
 * - Subreddit command example:
 * ```html
 *  <a onclick="handleMessageSending('subreddit', view, ['subreddit'])">
 * ```
 * 
 * Javascript example:
 * ```javascript
 * let trends = [ "trend1", "trend2", "trend3" ];
 * ```
 * 
 * @param data 
 * @category View - Template
 */
export function trend(data: ITemplateData): string {
  return "template";
}

/**
 * The `sort` function returns the HTML string of the section to sort
 * the current view by its sort types. The sort names need to fire the
 * corresponding sort command. E.g. sort1 fires the command sort1.
 * 
 * - Sort command example:
 * ```html
 *  <a onclick="handleMessageSending('sort1', view, args)">
 * ```
 * 
 * Javascript example:
 * ```javascript
 *  const sort = require( "sort1", "sort2", "sort3" );
 * ```
 * 
 * @param data 
 * @category View - Template
 */
export function sort(data: ITemplateData): string {
  return "template";
}

/**
 * The `time` function returns the HTML string of the section to set the interval
 * of the current view. The time names need to fire the corresponding time command.
 * E.g. time1 fires the command time1.
 * 
 * - Time command example:
 * ```html
 *  <a onclick="handleMessageSending('time1', view, args)">
 * ```
 * 
 * Javascript example:
 * ```javascript
 *  const time = require( "time1", "time2", "time3" );
 * ```
 * 
 * @param data 
 * @category View - Template
 */
export function time(data: ITemplateData): string {
  return "template";
}

/**
 * The `article` function returns the HTML string of the section to
 * represent an article entry. It should display the score, subreddit, author, title and preview.
 * It needs at least the title which sends the `article` command with the subreddit and 
 * article_id to the extension.
 * 
 * - Article command example:
 * ```html
 *  <a onclick="handleMessageSending('article', view, ['subreddit', 'article_id'])">
 * 
 * Javascript example:
 * ```javascript
 *  if (123 in ('r/reddit.com', ekarbe )) {
 *      return { title: "article title", pre: show() };
 *  }
 * ```
 * 
 * @param data 
 * @category View - Template
 */
export function article(data: ITemplateData): string {
  return "template";
}

/**
 * The `pagination` function returns the HTML string of the section to browse
 * multiple pages of the current view. It needs an element to send the 
 * `prev` command and the before param and an element to send the `next` command and the after param.
 * 
 * - Prev command example:
 * ```html
 *  <a onclick="handleMessageSending('prev', view, [count, undefined, 'before'])">
 * ```
 * 
 * - Next command example:
 * ```html
 *  <a onclick="handleMessageSending('next', view, [count, 'after', undefined])">
 * ```
 * 
 * Javascript example:
 * ```javascript
 *  export default { prev(this) { return this-1 }, next(this) { return this+1 } };
 * ```
 * 
 * @param data 
 * @category View - Template
 */
export function pagination(data: ITemplateData): string {
  return "template";
}

/**
 * The `breadcrumb` function returns the HTML string of the section to navigate
 * through multiple views. The breadcrumb names need to send their corresponding
 * commands to the extensiom. E.g. breadcrumb1 send the command breadcrumb1.
 * 
 * - Breadcrumb command example:
 * ```html
 *  <a onclick="handleMessageSending('breadcrumb1', view, args)">
 * ```
 * 
 * Javascript example:
 * ```javascript
 *  \// import the environment constants
 *  import { breadcrumb1, breadcrumb2, breadcrumb3 } from "extension/environment";
 * ```
 * 
 * @param data 
 * @category View - Template
 */
export function breadcrumb(data: ITemplateData): string {
  return "template";
}

/**
 * The `articleDetail` function returns the HTML string of the article view section.
 * It should display the score, upvote_ratio, subreddit, author, date, media_url and
 * a view of the media or selftext.
 * 
 * Javascript example:
 * ```javascript
 *  data.parse(123, 90%, 'r/reddit.com', ekarbe, '01/01/2001T14:42');
 *  let comments = 30;
 *  let media = parseMedia(data.path);
 *  showMedia(media);
 * ```
 * 
 * @param data 
 * @category View - Template
 */
export function articleDetail(data: ITemplateData): string {
  return "template";
}

/**
 * The `comment` function returns the HTML string of a comment chain section.
 * It should display the score, author, time and selftext. It needs to recursively
 * call itself to show the child comment/replies.
 * 
 * Javascript example:
 * ```javascript
 *  if (123 in (ekarbe, '01/01/2001T14:42')) {
 *      let body = { };
 *  }
 * ```
 * 
 * @param data 
 * @category View - Template
 */
export function comment(data: ITemplateData): string {
  return "template";
}

/**
 * The `userAbout` function returns the HTML string of the users information section.
 * It should display the karma, submitted_karma and comment_karma.
 * 
 * Javascript example:
 * ```javascript
 * let splittedData = data.split(",");
 * let karma = splittedData[3242];
 * let posts = splittedData[213];
 * let comments = splittedData[2900];
 * ```
 * 
 * @param data 
 * @category View - Template
 */
export function userAbout(data: ITemplateData): string {
  return "template";
}

/**
 * The `subredditSearch` function returns the HTML string of the subreddit search section.
 * The subreddit names need to send the `subreddit` command to the extension.
 * 
 * - Subreddit command example:
 * ```html
 *  <a onclick="handleMessageSending('subreddit', view, ['subreddit1'])">
 * ```
 * 
 * Javascript example:
 * ```javascript
 * const subs = {
 *  "GetMotivated": params,
 *  "blaReddit": params,
 * }
 * ```
 * 
 * @param data 
 * @category View - Template
 */
export function subredditSearch(data: ITemplateData): string {
  return "template";
}