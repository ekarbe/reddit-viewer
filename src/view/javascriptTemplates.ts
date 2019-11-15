import { ITemplateData, IConfigData } from "../interfaces";
import { URL } from "url";

export function head(data: any): string {
  // TODO: Content Security Policy
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

export function tail(): string {
  let HTML: string = `</body></html>`;
  return HTML;
}

export function script(config: IConfigData): string {
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
        element.style.display = "inherit";
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

export function functionHead(data: ITemplateData): string {
  // function
  let HTML: string = `<div><span class="constant">function</span> `;
  // data.name or generic
  HTML += data.name ? `<span class="function">${data.name}</span>` : `<span class="function">generic</span>`;
  // (
  HTML += `(`;
  if (data.param) {
    // data.param
    HTML += `<span class="variable">${data.param}</span>`;
  }
  // ) {
  // padding-left is used as the indentation
  HTML += `) { <div style="padding-left: ${data.tabsize}em">`;
  // function data.name(data.param) {
  return HTML;
}

export function functionTail(): string {
  // }
  let HTML: string = `</div>}</div>`;
  // }
  return HTML;
}

export function lineComment(comment: string): string {
  // comment
  let HTML = `<div><span class="comment">${comment}</span></div>`;
  // comment
  return HTML;
}

export function open(): string {
  // open(___);
  let HTML: string = `<div><a title="open" onclick="openSubreddit('open')" class="function">open</a>(<span class="string">"<input 
  id="openQuery" onkeyup="checkKey('open')">"</span>);</div>`;
  // open(___);
  return HTML;
}

export function search(): string {
  // search(___);
  let HTML: string = `<div><a title="search" onclick="executeSearch('home')" class="function">search</a>(<span class="string">"<input 
  id="searchQuery" onkeyup="checkKey('search')">"</span>);</div>`;
  // search(___);
  return HTML;
}

export function login(): string {
  // login(user, password);
  let HTML: string = `<div><a title="login" onclick="login()" class="function">login</a>(<span class="string">"<input 
  id="username" placeholder="user" onkeyup="checkKey('login')" onfocus="resetError()">"</span>,<span class="string">"<input id="password" type="password" 
  placeholder="password" onkeyup="checkKey('login')" onfocus="resetError()">"</span>);</div>`;
  // login(user, password);
  return HTML;
}

export function logout(data: ITemplateData): string {
  // logout(data.username);
  let HTML: string = `<div><a title="logout" onclick="handleMessageSending('logout', 'home', undefined)" class="function">logout</a>(<span class="variable">${data.active_user}</span>);</div>`;
  // logout(data.username);
  return HTML;
}

export function trend(data: ITemplateData): string {
  // let trends = [
  let HTML: string = `<div><span class="constant">let</span> <span class="variable">trends</span> = [`;
  if (data.trend) {
    for (let i = 0; i < data.trend.subreddit_names.length; i++) {
      // "subreddit_name"
      HTML += `<a title="${data.trend.subreddit_names[i]}" onclick="handleMessageSending('subreddit', '${data.view}', ['${data.trend.subreddit_names[i]}'])" 
      class="string">"${data.trend.subreddit_names[i]}"</a>`;
      // add a comma if there are remainig elements
      if (i === data.trend.subreddit_names.length - 1) {
        //
        HTML += "";
      } else {
        // , 
        HTML += ", ";
      }
    }
  }
  // ];
  HTML += `];</div>`;
  // let trends = ["subreddit_name", "subreddit_name"];
  return HTML;
}

export function sort(data: ITemplateData): string {
  // const sort = require(
  let HTML: string = `<div><span class="constant">const</span> <span class="variable">sort</span> = <span class="function">require</span>(`;
  if (data.sort) {
    for (let i = 0; i < data.sort.length; i++) {
      if (data.sort[i] === data.active_sort) {
        // sort
        HTML += `<a title="${data.sort[i]}" onclick="handleMessageSending('${data.sort[i]}', '${data.view}', '')" class="string" style="filter: saturate(2)">"${data.sort[i]}"</a>`;
      } else {
        // "sort"
        HTML += `<a title="${data.sort[i]}" onclick="handleMessageSending('${data.sort[i]}', '${data.view}', '')" class="string">"${data.sort[i]}"</a>`;
      }
      // add a comma if there are remainig elements
      if (i === data.sort.length - 1) {
        //
        HTML += "";
      } else {
        // ,
        HTML += ", ";
      }
    }
  }
  // );
  HTML += `);</div>`;
  // const sort = require("sort", "sort");
  return HTML;
}

export function time(data: ITemplateData): string {
  // const time = require(
  let HTML: string = `<div><span class="constant">const</span> <span class="variable">time</span> = <span class="function">require</span>( `;
  if (data.time) {
    for (let i = 0; i < data.time.length; i++) {
      if (data.time[i] === data.active_time) {
        // "time"
        HTML += `<a title="${data.time[i]}" onclick="handleMessageSending('${data.time[i]}', '${data.view}', '')" class="string" style="filter: saturate(2)">"${data.time[i]}"</a>`;
      } else {
        // "time"
        HTML += `<a title="${data.time[i]}" onclick="handleMessageSending('${data.time[i]}', '${data.view}', '')" class="string">"${data.time[i]}"</a>`;
      }
      // add a comma if there are remainig elements
      if (i === data.time.length - 1) {
        //
        HTML += "";
      } else {
        // ,
        HTML += ", ";
      }
    }
  }
  // );
  HTML += `);</div>`;
  // const time = require("time", "time");
  return HTML;
}

export function article(data: ITemplateData): string {
  //
  let HTML: string = ``;
  if (data.article) {
    // if(data.score in (
    HTML += `<div><span class="keyword">if</span> (<span class="numeric">${data.article.data.score}</span> <span class="constant">in</span> (`;
    // 'subreddit_name', author
    HTML += `<a title="${data.article.data.subreddit_name_prefixed}" onclick="handleMessageSending('subreddit', '${data.view}', ['${data.article.data.subreddit}'])" 
    class="variable">'${data.article.data.subreddit_name_prefixed}'</a>, <a title="${data.article.data.author}" 
    onclick="handleMessageSending('user', '${data.view}', ['${data.article.data.author}'])" class="variable">${data.article.data.author}</a>`;
    // )) {
    //    return {title: "title"
    HTML += `)) {<div style="padding-left: ${data.tabsize}em;"><span class="keyword">return</span> { <span class="variable">title:</span> <a 
    title="${data.article.data.title}" onclick="handleMessageSending('article', '${data.view}', ['${data.article.data.subreddit}', '${data.article.data.id}'])" 
    class="string">"${data.article.data.title}"`;
    try {
      // check if thumbnail is url
      // this helps us determinate which articles should have a preview
      let url: URL = new URL(data.article.data.thumbnail);
      // , pre: show()};
      // when opened
      // , pre: hide(thumbnail)};
      HTML += `</a>, <span class="variable">pre:</span><span id="closedPreview${data.article.data.id}" style="display: initial;"><a class="function" 
      onclick="expandElement('preview${data.article.data.id}'); expandElement('closedPreview${data.article.data.id}');">show</a>()</span><span 
      id="preview${data.article.data.id}" style="display: none;"><a class="function" 
      onclick="expandElement('preview${data.article.data.id}'); expandElement('closedPreview${data.article.data.id}');">hide</a>(<div><img 
      src="${url}"></div>)</span>};</div>`;
    } catch (_) {
      // };
      HTML += `</a>};</div>`;
    }
    // }
    HTML += `}</div>`;
  }
  // if(data.score in ('subreddit_name', author)){
  //      return {title: "title", pre: show()}; 
  // }
  return HTML;
}

export function pagination(data: ITemplateData): string {
  // export default {
  let HTML: string = `<div><span class="keyword">export</span> <span class="keyword">default</span> {`;
  // only show the prev field if the before parameter is set
  if (data.before) {
    // prev(this) { return -1 },
    HTML += `<a title="prev" onclick="handleMessageSending('prev', '${data.view}', [${data.count}, undefined, '${data.before}'])"><span 
    class="function">prev</span>(<span class="constant">this</span>) { <span class="keyword">return</span> <span class="constant">this</span>-<span 
    class="numeric">1</span> }</a>,`;
  }
  // only show the next field if the after parameter is set
  if (data.after) {
    // next(this) { return +1 }
    HTML += `<a title="next" onclick="handleMessageSending('next', '${data.view}', [${data.count}, '${data.after}', undefined])"><span 
    class="function">next</span>(<span class="constant">this</span>) { <span class="keyword">return</span> <span class="constant">this</span>+<span 
    class="numeric">1</span> }</a>`;
  }
  // };
  HTML += `};</div>`;
  // export default { prev(this) { return this-1 }, next(this) { return this+1 }}
  return HTML;
}

export function breadcrumb(data: ITemplateData): string {
  let HTML: string = ``;
  if (data.breadcrumb) {
    // \// import the environment constants
    //  import {
    HTML += `<div><span class="comment">// import the environment constants</span></div><div><span class="keyword">import</span> { `;
    for (let i = 0; i < data.breadcrumb.length; i++) {
      // breadcrumb
      HTML += `<a title="${data.breadcrumb[i]}" onclick="handleMessageSending('${data.breadcrumb[i]}', '${data.view}', '')" class="variable">${data.breadcrumb[i]}</a>`;
      // add a comma if there are remainig elements
      if (i === data.breadcrumb.length - 1) {
        //
        HTML += ``;
      } else {
        // ,
        HTML += `, `;
      }
    }
    // } from "extension/environment";
    HTML += ` } <span class="keyword">from</span> <span class="string">"extension/environment"</span>;</div>`;
  }
  // \// import the environment constants
  //  import {breadcrumb, breadcrumb} from "extension/environment";
  return HTML;
}

export function articleDetail(data: ITemplateData): string {
  let HTML: string = ``;
  if (data.article) {
    // parse unix timestamp to a "MM/DD/YYYY" formatted string
    let fmtCreated = new Date(data.article.data.created * 1e3).toLocaleDateString("en-US");
    // data.parseData(score, upvote_ratio%, subreddit_name, author, date);
    // let comments = num_comments;
    // let media = parseMedia(data.path);
    // showMedia(media);
    HTML += `<div><span class="variable">data</span>.<span class="function">parseData</span>(<span class="numeric">${data.article.data.score}</span>, <span 
    class="numeric">${data.article.data.upvote_ratio * 100}</span>%, <a title="${data.article.data.subreddit_name_prefixed}" 
    onclick="handleMessageSending('subreddit', '${data.view}', ['${data.article.data.subreddit}'])" class="string">'${data.article.data.subreddit_name_prefixed}'</a>, <a 
    title="${data.article.data.author}" onclick="handleMessageSending('user', '${data.view}', ['${data.article.data.author}'])" 
    class="variable">${data.article.data.author}</a>, <span class="string">'${fmtCreated}'</span>);</div><div><span class="constant">let</span> <span 
    class="variable">comments</span> = <span class="numeric">${data.article.data.num_comments}</span>;</div><div><span class="constant">let</span> <span 
    class="variable">media</span> = <span class="function">parseMedia</span>(<a href="${data.article.data.url}"><span class="variable">data</span>.<span 
    class="variable">path</span></a>);</div><div><a title="showMedia" onclick="expandElement('bodyDiv')"><span class="function">showMedia</span>(<span 
      class="variable">media</span></a>);</div><div id="bodyDiv" style="display:none;">`;
    if (data.article.data.is_self) {
      // show the title of the selftext if the selftext is not set
      if (data.article.data.selftext_html === null) {
        HTML += data.article.data.title;
      } else {
        HTML += data.article.data.selftext_html;
      }
    }
    // regex filter to look for supported image types
    // if the image is not supported instead of an image element an error message will be displayed
    else if (!RegExp("\.(jpg|jpeg|gif|png|apng|svg|bmp|png|ico)$", "gi").test(data.article.data.url)) {
      HTML += `<span class="keyword">throw</span>(<span class="constant">new</span> <span class="type">MediaException</span>); <span class="comment">// media can't be displayed</span>`;
    } else {
      HTML += `<image src="${data.article.data.url}">`;
    }
    HTML += `</div>`;
  }
  // data.parseData(score, upvote_ratio%, subreddit_name, author, date);
  // let comments = num_comments;
  // let media = parseMedia(data.path);
  // showMedia(media);
  return HTML;
}

export function comment(data: ITemplateData): string {
  let HTML: string = ``;
  if (data.comment) {
    // parse unix timestamp to a "HH:mm:SS TT" formatted string
    let fmtCreated = new Date(data.comment.created * 1e3).toLocaleTimeString("en-US");
    // if(score in (author
    HTML += `<div><div><span class="keyword">if</span> (<span class="numeric">${data.comment.score}</span> <span class="constant">in</span> (<a 
    title="${data.comment.author}" onclick="handleMessageSending('user', '${data.view}', ['${data.comment.author}'])" class="variable">${data.comment.author}`;
    // add (OP) tag to author if is article author
    if (data.comment.author === data.comment.original_poster) {
      // (OP)
      HTML += ` (OP)`;
    }
    // , 'date')) {
    //    let body = {
    HTML += `</a>, <span class="string">'${fmtCreated}'</span>)) {</div><div style="padding-left: ${data.tabsize}em;"><a title="expand" 
    onclick="expandElement('${data.comment.id}')"><span class="constant">let</span> <span class="variable">body</span></a> = {`;
    // check if parent element is of type t3 (article)
    // parent_id is of the form "t3_ewrwj" and accessing the index 1 allows us to get the type number
    // this allows to show root comments as default
    if (data.comment.parent_id[1] === "3") {
      HTML += `<div id="${data.comment.id}" style="padding-left: ${data.tabsize}em; display: inherit;">`;
    } else {
      HTML += `<div id="${data.comment.id}" style="padding-left: ${data.tabsize}em; display: none;">`;
    }
    HTML += `${data.comment.body_html}`;
    // check if there are child comments
    if (<unknown>data.comment.replies !== "" && data.comment.replies.data.children.length > 0) {
      for (let i = 0; i < data.comment.replies.data.children.length; i++) {
        // check if element is of type t1 (comment)
        // this needs to be done as there are "more" elements to dynamically load comments
        if (data.comment.replies.data.children[i].kind === "t1") {
          // add the OP to the childcomment to allow the tagging of that user
          data.comment.replies.data.children[i].data.original_poster = data.comment.original_poster;
          HTML += comment({
            comment: data.comment.replies.data.children[i].data,
            view: data.view,
            tabsize: data.tabsize,
          });
        }
      }
    }
    //    };
    // }
    HTML += `</div>};</div><div>}</div></div><br />`;
  }
  // if(score in (author, 'date')) {
  //      let body = {};
  // }
  return HTML;
}

export function userAbout(data: ITemplateData): string {
  let HTML: string = ``;
  // let splittedData = data.split(",");
  // let karma = splittedData[karma];
  // let posts = splittedData[link_karma];
  // let comments = splittedData[comment_karma];
  if (data.user) {
    HTML = `<div><span class="constant">let</span> <span class="variable">splittedData</span> = <span class="variable">data</span>.<span 
    class="function">split</span>(<span class="string">","</span>);</div><div><span class="constant">let</span> <span class="variable">karma</span> = <span 
    class="variable">splittedData</span>[<span class="numeric">${data.user.link_karma + data.user.comment_karma}</span>];</div><div><span 
    class="constant">let</span> <span class="variable">posts</span> = <span class="variable">splittedData</span>[<span 
    class="numeric">${data.user.link_karma}</span>];</div><div><span class="constant">let</span> <span class="variable">comments</span> = <span 
    class="variable">splittedData</span>[<span class="numeric">${data.user.comment_karma}</span>];</div>`;
  }
  // let splittedData = data.split(",");
  // let karma = splittedData[karma];
  // let posts = splittedData[link_karma];
  // let comments = splittedData[comment_karma];
  return HTML;
}

export function subredditSearch(data: ITemplateData): string {
  // const subs = {
  let HTML: string = `<div><span class="constant">const</span> <span class="variable">subs</span> = {</div><div style="padding-left: ${data.tabsize}em;">`;
  if (data.subreddits) {
    for (let i = 0; i < data.subreddits.names.length; i++) {
      // "subreddit_name": params;
      HTML += `<div><a title="${data.subreddits.names[i]}" onclick="handleMessageSending('subreddit', '${data.view}', ['${data.subreddits.names[i]}'])" 
      class="string">"${data.subreddits.names[i]}"</a><span class="variable">: params</span>`;
      // add a comma if there are remainig elements
      if (i === data.subreddits.names.length - 1) {
        //
        HTML += `</div>`;
      } else {
        // ,
        HTML += `,</div>`;
      }
    }
  }
  // };
  HTML += `</div><span>};</span></div>`;
  // const subs = {
  //    "subreddit_name": params;
  //    "subreddit_name": params;
  // };
  return HTML;
}