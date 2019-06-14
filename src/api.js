// api.js provides the functions to request the reddit data

const logger = require('./logger');
const axios = require('axios');

function getSubreddit(subreddit, sort, interval){
  return new Promise(resolve => {
  axios.get(`https://reddit.com/r/${subreddit}/${sort}.json?t=${interval}`)
    .then(function (response) {
      resolve(response.data.data.children);
    })
    .catch(function (error) {
      logger.error(error);
    })
  })
}

function getArticle(subreddit, article) {
  return new Promise(resolve => {
    axios.get(`https://reddit.com/r/${subreddit}/comments/${article}.json`)
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (error) {
      logger.error(error);
    })
  })
}

function getTrendingSubreddits() {
  return new Promise(resolve => {
    axios.get(`https://reddit.com/api/trending_subreddits.json`)
    .then(function (response) {
      resolve(response.data.subreddit_names);
    })
    .catch(function (error) {
      logger.error(error);
    })
  })
}

module.exports = {
  getSubreddit,
  getArticle,
  getTrendingSubreddits
}