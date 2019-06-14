// creator.js provides the functions to create the html views

const templates = require( './templates' );
const api = require( './api' );

let stylesheetPath;

// creates the landing page html string
function createLandingpageView(config) {
  return new Promise(async resolve => {
    let trends = await api.getTrendingSubreddits();
    let html = templates.head(stylesheetPath)+templates.search(config.defaultSubreddit)+templates.trending(trends);
    if (config.help){
      html += templates.help();
    }
    html += templates.project()+templates.tail();
    resolve(html);
  })
}

// creates the subreddit view html string
function createSubredditView(subreddit, sort, interval) {
  return new Promise(async resolve => {
    let articles = await api.getSubreddit(subreddit, sort, interval);
    let html = templates.head(stylesheetPath)+templates.home()+templates.sort();
    if (sort === 'top' || sort === 'controversial') {
      html += templates.time();
    }
    if (!articles || articles.length === 0 || articles === undefined) {
      html += templates.empty(subreddit);
    }
    else {
      for (let i in articles) {
        html += templates.article(articles[i].data);
      }
    }
    html += templates.tail();
    resolve(html);
  })
}

// creates article view html string
function createArticleView(subreddit, articleID) {
  return new Promise(async resolve => {
    let article = await api.getArticle(subreddit, articleID);
    let articleDetails = article[0].data.children[0].data;
    let html = templates.head(stylesheetPath)+templates.home()
    +templates.subreddit(subreddit)+templates.articleDetails(articleDetails)+templates.tail();
    resolve(html);
  })
}

// sets the path of the stylesheet
function setStylesheetPath(path) {
  stylesheetPath = path;
}

module.exports = {
  setStylesheetPath,
  createLandingpageView,
  createSubredditView,
  createArticleView
}