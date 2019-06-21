// templates.js provides the panel templates for creating the html views

const media = require('./media');

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

		// Collapse divs
		function collapseDiv(divid) {
			selectedDiv = document.getElementById(divid);
			if (selectedDiv.style.display === "none") {
				selectedDiv.style.display = "block";
			}
			else {
				selectedDiv.style.display = "none";
			}
    }

    // trigger search on enter
    $(document).ready(function(){
      $('#search_input').keypress(function(e){
        if(e.keyCode==13)
        submitSearch();
        //$('#search_execute').click();
      });
    });

	</script>
	`;
}

// panel to return back to landing page
function home() {
  return `
  <p>
		<span class="keyword-color">const </span>
		<span class="variable-color">home </span>
		<span class="operator-color">= </span>
		<span class="function-color">require</span><span class="bracket-color">(</span>
      <a onclick="handleMessageSending('Go back to landing page', 'homeView')">
        <span class="string-color">'home-env'</span>
      </a>
		<span class="bracket-color">)</span><span class="variable-color">;</span>
	</p>
  `;
}

// panel to return back to article overview
function subreddit(subreddit) {
  return `
  <p>
		<span class="keyword-color">const </span>
		<span class="variable-color">sub </span>
		<span class="operator-color">= </span>
		<span class="function-color">require</span><span class="bracket-color">(</span>
      <a onclick="handleMessageSending('${subreddit}', 'subredditView')">
        <span class="string-color">'sub-env'</span>
      </a>
		<span class="bracket-color">)</span><span class="variable-color">;</span>
	</p>
  `;
}

// panel to display sort options
function sort(selectedSort) {
  let sorts = ["hot", "new", "controversial", "top", "rising"];

  let html = `
  <p>
    <span class="keyword-color">let</span>
    <span class="variable-color">sort =</span>
    <span class="bracket-color">[</span>
  `;

  for (let i=0; i<sorts.length; i++) {
    html += `
    <a onclick="handleMessageSending('${sorts[i]}', 'sort')">
    `
    // highlight selection
    if (sorts[i] === selectedSort) {
      html += `<span class="argument-color">"${sorts[i]}"</span>
      </a>
      `;
    }else{
      html += `<span class="string-color">"${sorts[i]}"</span>
      </a>
      `;
    }

    if (i !== sorts.length-1){
      html += `<span class="variable-color">,</span>`;
    }
  }

  html += `
  <span class="bracket-color">]</span><span class="variable-color">;</span>
  `;

  return html;
}

// panel to display time options
function time(selectedInterval) {
  let intervals = ["hour", "day", "week", "month", "year", "all"];

  let html = `
  <p>
    <span class="keyword-color">let</span>
    <span class="variable-color">intervals =</span>
    <span class="bracket-color">[</span>
  `;

  for (let i=0; i<intervals.length; i++) {
    html +=`
    <a onclick="handleMessageSending('${intervals[i]}', 'interval')"  
    `;
    // highlight selection
    if (intervals[i] === selectedInterval) {
      html += `
      <span class="argument-color">"${intervals[i]}"</span>
      </a>
      `;
    } else {
      html += `
      <span class="string-color">"${intervals[i]}"</span>
      </a>
      `;
    }

    if (i !== intervals.length-1){
      html += `<span class="variable-color">,</span>
      `;
    }
  }

  html += `
  <span class="bracket-color">]</span><span class="variable-color">;</span>
  `;
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
  `;
}

// panel to display project resources
function project() {
  return `
  <p>
    <span class="operator-color">module</span><span class="variable-color">.</span><span class="function-color">exports</span>
    <span class="operator-color">=</span>
    <span class="bracket-color">{</span>

    </br>
    
      <a href="https://github.com/ekarbe/reddit-viewer/issues">
        <span class="variable-color">&nbsp; &nbsp; issues,</span>
      </a>
    
    </br>
    
      <a href="https://github.com/ekarbe/reddit-viewer">
        <span class="variable-color">&nbsp; &nbsp; project</span>
      </a>
    
    </br>
    
    <span class="bracket-color">}</span>
  </p>
  `;
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
  `;

  // add a clickable array entry for every given subreddit
  for (let i = 0; i < subreddits.length; i++) {
    html += `
    <a href="#" onclick="handleMessageSending('${subreddits[i]}', 'search')">
      <span class="string-color">"${subreddits[i]}"</span>
    </a>
    `;

    if (i !== subreddits.length - 1) {
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
      <a id="search_execute" onclick="submitSearch()" class="function-color">executeSearch</a>
        <span class="bracket-color">(</span><span class="bracket-color">)
      </span>
    
    </br>
    
    <span class="bracket-color">}</span>
	</p>
  `;
}

// panel to display an article list entry
function article(data) {
  if (!data || data === undefined) {
    return ``;
  }

  return `
  <div id="${data.id}" class="post-list-post-container">
    <p>
      <a onclick=collapseDiv('${data.id}-pre')>
        <span class="keyword-color">let </span>
      </a>
      <span class="variable-color">
        <a onclick="handleMessageSending('${data.subreddit},${data.id}', 'article')">${data.id}</a>
      </span>
      <span class="string-color">
        <span class="bracket-color">(</span>
        "${data.title}"<span class="variable-color">,</span>
        <span class="argument-color">${data.author}</span><span class="variable-color">,</span>
        <span class="bracket-color"> { </span>
        <span class="variable-color"> ${data.subreddit}</span>
        <span class="bracket-color"> } </span>
        <span class="bracket-color">)</span></span>;
          <div id="${data.id}-pre" style="display: none">
            <img src="${data.thumbnail}" alt="Preview"></img>
          </div>
    </p>
  </div>
  `;
}

// panel to paginate subreddits
function pagination(after, before) {
  let html = `
  <p>
    <span class="operator-color">module</span><span class="variable-color">.</span><span class="function-color">exports</span>
    <span class="operator-color">=</span>
    <span class="bracket-color">{</span>

    </br>
  `;

  if(before !== null){
  html += `
      <a onclick="handleMessageSending('${before}', 'prev')">
        <span class="variable-color">&nbsp; &nbsp; prev,</span>
      </a>

    </br>
  `;
  }
  
  html += `
      <a onclick="handleMessageSending('${after}', 'next')">
        <span class="variable-color">&nbsp; &nbsp; next</span>
      </a>

    </br>

    <span class="bracket-color">}</span>
  </p>
  `;

  return html;
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
    <a href="${data.url}">
      <span class="string-color">'${data.url}'</span>
    </a>
  </br>
  `;

  // handle media
  if(media.isMedia(data)) {
    html += media.createMediaHTML(data);
  }

  html += `
  <span class="bracket-color">&nbsp; &nbsp; }</span>
  
  </br>
  
  <span class="bracket-color">}</span>
  `

  return html;
}

// comment panel
function comment(comment) {
  let html = `
    <p>
      <span class="keyword-color">export class</span>
        <a onclick=collapseDiv('${comment.data.id}')>
          <span class="function-color">Comment_${comment.data.author}</span>
        </a>
      <span class="bracket-color">{</span>
      
      </br>

        <div id="${comment.data.id}" style="display: none">
          <span class="variable-color">&nbsp; &nbsp; score: ${comment.data.score};</span>
      
          </br>
      
          <span class="variable-color">&nbsp; &nbsp; body: ${comment.data.body};</span>
      
          </br>
      
          </br>
  `;

  if (comment.data.replies !== "") {
    html += `
    <span class="keyword-color">&nbsp; &nbsp; switch</span>
    <span class="bracket-color">(</span>
      <a onclick=collapseDiv('${comment.data.id}-cmt')>
        <span class="variable-color">children</span>
      </a>
    <span class="bracket-color">) {</span>
    
    </br>
    
      <div id="${comment.data.id}-cmt" style="display: none">
    `;

    // recursive childComment function to add all child comments
    html += childComment(comment.data);
    
    html += `
    </div>
    <span class="bracket-color">&nbsp; &nbsp; }</span>
    `;
  }

  html += `
  </br>

  </div>
  <span class="bracket-color">}</span>
  </p>
  `;

  return html;
}

// recursive child comment element
function childComment(comment) {
  if (comment.replies === undefined) {
    return;
  }

  let html = '';

  for (let i=0; i<comment.replies.data.children.length; i++) {
    for(let j=0; j<comment.replies.data.children[i].data.depth; j++) {
      html += `&nbsp; &nbsp; &nbsp; &nbsp;`;
    }

    html += `
      <span class="keyword-color"> case</span>
        <a onclick=collapseDiv('comment-${comment.replies.data.children[i].data.id}')>
          <span class="string-color">'${comment.replies.data.children[i].data.author}'</span>
        </a>
      <span class="variable-color">:</span>
      
      </br>
      
        <div id="comment-${comment.replies.data.children[i].data.id}" style="display: none">
          <span class="variable-color">
    `;

    for(let j=0; j<comment.replies.data.children[i].data.depth; j++) {
      html += `&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;`;
    }

    html += `
      body: ${comment.replies.data.children[i].data.body}</span>
      
      </br>
      
      <span class="keyword-color">
    `;

    for(let j=0; j<comment.replies.data.children[i].data.depth; j++) {
      html += `&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;`;
    }

    html += `
      this</span><span class="variable-color">.open</span><span class="bracket-color">(</span>
      <span class="variable-color">${comment.replies.data.children[i].data.score}</span>
      <span class="bracket-color">)</span><span class="variable-color">;</span>
      
      </br>
    `;

    if (comment.replies.data.children[i].data.replies !== "") {
      html += childComment(comment.replies.data.children[i].data);
    }

    html += `</div>`;
  }
  
  return html;
}

// essential panel to close html
function tail() {
  return `
  </body>
  </html>
  `;
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
  search,
  pagination,
  article,
  articleDetails,
  comment,
  tail
}