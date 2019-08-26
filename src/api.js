// api.js provides the functions to request the reddit data

const axios = require("axios");

const web = axios.create({
  timeout: 10000
});

// requests the subreddit data
function getSubreddit(subreddit, sort, interval, limit, count, after, before) {
  return new Promise((resolve, reject) => {
    web
      .get(
        `https://reddit.com/r/${subreddit}/${sort}.json?t=${interval}&limit=${limit}&count=${count}${
          after ? "&after=" + after : ""
        }${before ? "&before=" + before : ""}`
      )
      .then(response => {
        if (response.data.data.children.length === 0) {
          reject("empty or unvailable subreddit");
        }
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// requests the article data
function getArticle(subreddit, article) {
  return new Promise((resolve, reject) => {
    web
      .get(`https://reddit.com/r/${subreddit}/comments/${article}.json`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// requests the trending subreddits data
function getTrendingSubreddits() {
  return new Promise((resolve, reject) => {
    web
      .get(`https://reddit.com/api/trending_subreddits.json`)
      .then(response => {
        resolve(response.data.subreddit_names);
      })
      .catch(error => {
        reject(error);
      });
  });
}

module.exports = {
  getSubreddit,
  getArticle,
  getTrendingSubreddits
};
