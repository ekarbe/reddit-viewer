// api.js provides the functions to request the reddit data

const axios = require('axios');

const web = axios.create({
  timeout: 2000
});

// requests the subreddit data
function getSubreddit(subreddit, sort, interval){
  return new Promise((resolve, reject) => {
  web.get(`https://reddit.com/r/${subreddit}/${sort}.json?t=${interval}`)
    .then(response => {
      console.log(response);
      if(response.data.data.data === undefined) {
        reject("empty or unvailable subreddit");
      }
      resolve(response.data.data.children);
    })
    .catch(error => {
      reject(error);
    })
  })
}

// requests the article data
function getArticle(subreddit, article) {
  return new Promise((resolve, reject) => {
    web.get(`https://reddit.com/r/${subreddit}/comments/${article}.json`)
    .then(response => {
      resolve(response.data);
    })
    .catch(error => {
      reject(error);
    })
  })
}

// requests the trending subreddits data
function getTrendingSubreddits() {
  return new Promise((resolve, reject) => {
    web.get(`https://reddit.com/api/trending_subreddits.json`)
    .then(response => {
      resolve(response.data.subreddit_names);
    })
    .catch(error => {
      reject(error);
    })
  })
}

module.exports = {
  getSubreddit,
  getArticle,
  getTrendingSubreddits
}