// creator.js provides the functions to create the html views

const templates = require( './templates' );
const api = require( './api' );

let stylesheetPath;

// creates the landing page html string
function createLandingpageView(config) {
  return new Promise((resolve, reject) => {
    api.getTrendingSubreddits()
       .then(response => {
        let html = templates.head(stylesheetPath)+templates.search(config.defaultSubreddit)+templates.trending(response);
        if (config.help){
          html += templates.help();
        }
        html += templates.project()+templates.tail();
        resolve(html);
       })
       .catch(error => {
        reject(error);
       })
  })
}

// creates the subreddit view html string
function createSubredditView(subreddit, sort, interval) {
  return new Promise((resolve, reject) => {
    api.getSubreddit(subreddit, sort, interval)
       .then(response => {
        let html = templates.head(stylesheetPath)+templates.home()+templates.sort();
        if (sort === 'top' || sort === 'controversial') {
          html += templates.time();
        }
        for (let i in response) {
          html += templates.article(response[i].data);
        }
        html += templates.tail();
        resolve(html);
       })
       .catch(error => {
         reject(error);
       })
    
  })
}

// creates article view html string
function createArticleView(subreddit, articleID) {
  return new Promise((resolve, reject) => {
    api.getArticle(subreddit, articleID)
       .then(response => {
        let articleDetails = response[0].data.children[0].data;
        let comments = response[1].data;
        let html = templates.head(stylesheetPath)+templates.home()
        +templates.subreddit(subreddit)+templates.articleDetails(articleDetails);
        for (let i=0; i<comments.children.length; i++) {
          html += templates.comment(comments.children[i]);
        }
        html += templates.tail();
        resolve(html);
       })
       .catch(error => {
         reject(error);
       })
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