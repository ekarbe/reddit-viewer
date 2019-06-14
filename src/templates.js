// templates.js provides the panel templates for creating the html views

// essential panel to load all resources
function head(stylesheet) {
  return `
<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="${stylesheet}">
		<script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.3.1.min.js"></script>
	</head>
	<body>
	<!----------------SCRIPTS-------------------->
	<script>
			const vscode = acquireVsCodeApi();

			// Handle vs extension message passing (from extension to webpage)
			window.addEventListener('message', event => {
				const message = event.data;
				switch(message.command) {
					case 'updateView':
						break;
				}
			});

			// Handle vs extension message passing (from webpage to extension)
			function handleMessageSending(messageText, messageCommand) {
				vscode.postMessage({
					command: messageCommand,
					text: messageText
				});
			}

			// Search 
			function submitSearch() {
				const searchFieldText = document.getElementById('search_input').value;
				handleMessageSending(searchFieldText, 'search');
			}

			// Collapse the post-list view 
			function collapseDiv(divid) {
				selectedDiv = document.getElementById(divid);
				if (selectedDiv.style.display === "none") {
					selectedDiv.style.display = "block";
				}
				else {
					selectedDiv.style.display = "none";
				}
			}
		</script>
	`
}

// panel to return back to landing page
function home() {
  return `
  <p>
		<span class="keyword-color">const </span>
		<span class="variable-color">home </span>
		<span class="operator-color">= </span>
		<span class="function-color">require</span><span class="bracket-color">(</span>
    <a href="#" onclick="handleMessageSending('Go back to landing page', 'homeView')"><span class="string-color">'home-env'</span></a>
		<span class="bracket-color">)</span><span class="variable-color">;</span>
	</p>
  `
}

// panel to return back to article overview
function subreddit(subreddit) {
  return `
  <p>
		<span class="keyword-color">const </span>
		<span class="variable-color">sub </span>
		<span class="operator-color">= </span>
		<span class="function-color">require</span><span class="bracket-color">(</span>
		<a href="#" onclick="handleMessageSending('${subreddit}', 'subredditView')"><span class="string-color">'sub-env'</span></a>
		<span class="bracket-color">)</span><span class="variable-color">;</span>
	</p>
  `
}

// WIP panel to display sort options
function sort() {
  let sorts = ["hot", "new", "controversial", "top", "rising"];
  let html = `
  <p>
    <span class="keyword-color">let</span>
    <span class="variable-color">sort =</span>
    <span class="bracket-color">[</span>
  `
  for (let i=0; i<sorts.length; i++) {
    html +=`
    <a href="#" onclick="handleMessageSending('${sorts[i]}', 'sort')"><span class="string-color">"${sorts[i]}"</span>`;
    if (i !== sorts.length-1){
      html += `<span class="variable-color">,</span>`;
    }
  }
  html += `
  <span class="bracket-color">]</span><span class="variable-color">;</span>`;
  return html;
}

// WIP panel to display time options
function time() {
  let intervals = ["hour", "day", "week", "month", "year", "all"];
  let html = `
  <p>
    <span class="keyword-color">let</span>
    <span class="variable-color">intervals =</span>
    <span class="bracket-color">[</span>
  `
  for (let i=0; i<intervals.length; i++) {
    html +=`
    <a href="#" onclick="handleMessageSending('${intervals[i]}', 'time')"<span class="string-color">"${intervals[i]}"</span>`;
    if (i !== intervals.length-1){
      html += `<span class="variable-color">,</span>`;
    }
  }
  html += `
  <span class="bracket-color">]</span><span class="variable-color">;</span>`;
  return html;
}

// panel to display extension help
function help() {
  return `
  <p>
    <span class="keyword-color">const </span>
    <span class="variable-color">helpText </span>
    <span class="operator-color">= </span>
    <span class="bracket-color">{</span>
    </br>
    <span class="string-color">&nbsp; &nbsp; "search"</span>
    <span class="operator-color">: </span>
    <span class="string-color">"insert a subreddit name into the input at the top and click 'executeSearch' to start searching for it"</span>
    <span class="operator-color">,</span>
    </br>
    <span class="string-color">&nbsp; &nbsp; "trending"</span>
    <span class="operator-color">: </span>
    <span class="string-color">"to select a trending subreddit just click on its name"</span>
    <span class="operator-color">,</span>
    </br>
    <span class="string-color">&nbsp; &nbsp; "post"</span>
    <span class="operator-color">: </span>
    <span class="string-color">"to open a post you can click on its ID"</span>
    <span class="operator-color">,</span>
    </br>
    <span class="string-color">&nbsp; &nbsp; "home"</span>
    <span class="operator-color">: </span>
    <span class="string-color">"you can navigate back to this landing page by clicking on the home-env"</span>
    <span class="operator-color">,</span>
    </br>
    <span class="string-color">&nbsp; &nbsp; "back"</span>
    <span class="operator-color">: </span>
    <span class="string-color">"to go back to the overview of a subreddit you have to click on the subreddit-env"</span>
    <span class="operator-color">,</span>
    </br>
    <span class="bracket-color">}</span><span class="variable-color">;</span>
  </p>
  `
}

// panel to display project resources
function project() {
  return `
  <p>
    <span class="operator-color">module</span><span class="variable-color">.</span><span class="function-color">exports</span>
    <span class="operator-color">=</span>
    <span class="bracket-color">{</span>
    </br>
    <a href="https://github.com/ekarbe/reddit-viewer/issues"><span class="variable-color">&nbsp; &nbsp; issues,</span></a>
    </br>
    <a href="https://github.com/ekarbe/reddit-viewer"><span class="variable-color">&nbsp; &nbsp; project</span></a>
    </br>
    <span class="bracket-color">}</span>
  </p>
  `
}

// panel to display the trending subreddits
function trending(subreddits) {
  if (!subreddits || subreddits.length === 0) {
    return ``;
  }
  let html = `
  <p>
    <span class="keyword-color">function</span>
    <span class="function-color">trends</span><span class="bracket-color">() {</span>
    </br>
    <span class="keyword-color">&nbsp; &nbsp; return</span>
    <span class="bracket-color">[</span>
  `
  // add a clickable array entry for every given subreddit
  for (let i = 0; i < subreddits.length; i++) {
    html += `
    <a href="#" onclick="handleMessageSending('${subreddits[i]}', 'search')"><span class="string-color">"${subreddits[i]}"</span></a>`;
    if (i != subreddits.length - 1) {
      html += `<span class="variable-color">,</span>`
    }
  }
  html += `
    <span class="bracket-color">]</span><span class="variable-color">;</span>
    </br>
    <span class="bracket-color">}</span>
  `
  return html;
}

// panel to display empty subreddit error
function empty(subreddit) {
  return `
  <p>
    <span class="keyword-color">function </span>
    <span class="function-color">loadArticles</span><span class="bracket-color">(</span>
    <span class="variable-color">id </span><span class="bracket-color">) {</span>
    </br>
    <span class="keyword-color">&nbsp; &nbsp; try</span>
    <span class="bracket-color">{</span>
    </br>
    <span class="variable-color">&nbsp; &nbsp; &nbsp; &nbsp; api.</span><span class="function-color">get</span><span class="bracket-color">(</span>
    <span class="string-color">'/articles/'</span>
    <span class="variable-color">+ id</span><span class="bracket-color">)</span><span class="variable-color">;</span>
    </br>
    <span class="bracket-color">&nbsp; &nbsp; }</span>
    </br>
    <span class="keyword-color">&nbsp; &nbsp; catch</span><span class="bracket-color">(</span>
    <span class="variable-color">err</span>
    <span class="bracket-color">) {</span>
    </br>
    <span class="variable-color">&nbsp; &nbsp; &nbsp; &nbsp; window.</span><span class="function-color">alert</span><span class="bracket-color">(</span>
    <span class="string-color">'Subreddit "${subreddit}" seems to be empty or not available'</span><span class="variable-color">, err</span><span class="bracket-color">)</span><span class="variable-color">;</span>
    </br>
    <span class="bracket-color">&nbsp; &nbsp; }</span>
    </br>
    <span class="bracket-color">}</span>
  </p>
  `
}

// panel to display subreddit search
function search(subreddit) {
  return `
  <p>
		<span class="keyword-color">function </span>
		<span class="function-color">search</span><span class="bracket-color">(</span>
		<span class="argument-color">subreddit</span>
		<span class="operator-color">=</span>
		<span class="string-color">'</span>
		<input type="text" id="search_input" placeholder="${subreddit}"/>
		<span class="string-color">'</span>
		<span class="bracket-color">) {</span>
		</br>
		<span class="keyword-color">&nbsp; &nbsp; return</span>
		<a href="#" onclick="submitSearch()" class="function-color">executeSearch</a><span class="bracket-color">(</span><span class="bracket-color">)</span>
		</br>
		<span class="bracket-color">}</span>
	</p>
  `
}

// panel to display an article list entry
function article(data) {
  if (!data || data === undefined) {
    return ``;
  }
  return `
  <div id="${data.id}" class="post-list-post-container">
    <p>
      <span class="keyword-color">let </span>
      <span class="variable-color">
        <a href="#" onclick="handleMessageSending('${data.subreddit},${data.id}', 'article')">${data.id}</a>
      </span>
        = 
      <span class="string-color">
        <span class="bracket-color">(</span>
        "${data.title}"<span class="variable-color">,</span>
        <span class="argument-color">${data.author}</span><span class="variable-color">,</span>
        <span class="bracket-color"> { </span>
        <span class="variable-color"> ${data.subreddit}</span>
        <span class="bracket-color"> } </span>
        <span class="bracket-color">)</span></span>;
    </p>
  </div>
  `
}

// panel to display article details
function articleDetails(data) {
  if (!data || data === undefined) {
    return ``;
  }
  let html = `
  <span class="keyword-color">const</span>
  <span class="function-color">${data.title}</span>
  <span class="variable-color">=</span>
  <span class="bracket-color">(</span>
  <span class="variable-color">${data.author}</span>
  <span class="bracket-color">)</span>
  <span class="keyword-color">=></span>
  <span class="bracket-color">{</span>
  </br>
  <span class="keyword-color">&nbsp; &nbsp; let</span>
  <span class="variable-color">score =</span>
  <span class="string-color">${data.score}</span><span class="variable-color">;</span>
  </br>
  <span class="keyword-color">&nbsp; &nbsp; for</span>
  <span class="bracket-color">(</span>
  <span class="keyword-color">let</span>
  <span class="variable-color">text</span>
  <span class="keyword-color">in</span>
  <span class="variable-color">author</span><span class="bracket-color">)</span>
  <span class="bracket-color">{</span>
  </br>
  <span class="keyword-color">&nbsp; &nbsp; &nbsp; &nbsp; let</span>
  <span class="variable-color">body =</span>
  <span class="string-color">'${data.selftext}'</span>
  </br>
  <span class="keyword-color">&nbsp; &nbsp; &nbsp; &nbsp; let</span>
  <span class="variable-color">url =</span>
  <a href="${data.url}"><span class="string-color">'${data.url}'</span></a>
  </br>
  `
  // TODO put in div and hide/unhide!
  if (data.post_hint === "image") {
    html += `
    <img src="${data.url}" alt="media"></img>`
  }
  html += `
  <span class="bracket-color">&nbsp; &nbsp; }</span>
  </br>
  <span class="bracket-color">}</span>
  `
  return html;
}

// WIP comment panel
function comment(comment) {
  let html = `
    <p>
      <span class="keyword-color">export class</span>
      <span class="function-color">Comment${comment.data.author}</span>
      <span class="bracket-color">{</span>
      </br>
      <span class="variable-color">&nbsp; &nbsp; score: ${comment.data.score};</span>
      </br>
      <span class="variable-color">&nbsp; &nbsp; body: ${comment.data.selftext};</span>
      </br></br>
      <span class="keyword-color">&nbsp; &nbsp; constructor</span>
      <span class="bracket-color">(</span>
      <span class="variable-color">comment: Object</span>
      <span class="bracket-color">) {</span>
      <span class="keyword-color">&nbsp; &nbsp; &nbsp; &nbsp; this</span><span class="variable.color">.children = comment.children;</span>
      </br>
      <span class="bracket-color">&nbsp; &nbsp; }</span>
  `;
  if (comment.data.replies !== "") {
    html += `
      <span class="keyword-color">&nbsp; &nbsp; switch</span>
      <span class="bracket-color">(</span>
      <span class="variable-color">children</span>
      <span class="bracket-color">) {</span>
      </br>
    `;
    for (let i=0; i<comment.data.replies.children.length; i++) {
      html += `
      <span class="keyword-color">&nbsp; &nbsp; &nbsp; &nbsp; case</span>
      <span class="string-color">'${comment.data.replies.children[i].author}'</span>
      <span class="variable-color">:</span>
      </br>
      <span class="keyword-color">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; this</span><span class="variable.color">.open</span><span class="bracket-color">(>
      <span class="variable-color">${comment.data.replies.children[i].id}</span>
      <span class="bracket-color">)</span><span class="variable-color">;</span>
      </br>
      `;
    }
    html += `
      <span class="bracket-color">&nbsp; &nbsp; }</span>
      </br>
    `;
  }
  html += `
    <span class="bracket-color">}</span>
    </p>
  `;
  return html;
}

// essential panel to close html
function tail() {
  return `
  </body>
  </html>
  `
}

module.exports = {
  head,
  home,
  subreddit,
  sort,
  time,
  help,
  project,
  trending,
  empty,
  search,
  article,
  articleDetails,
  comment,
  tail
}