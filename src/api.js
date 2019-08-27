// api.js provides the functions to request the reddit data

const axios = require("axios");
const vscode = require("vscode");
let config = vscode.workspace.getConfiguration("redditviewer");

const web = axios.create({
  timeout: config.requestTimeout
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

// requests the given view of an user
// can be 'about', 'posts', 'comments'
function getUser(username, view) {
  return new Promise((resolve, reject) => {
    let url;
    if (view === "posts") {
      url = `https://reddit.com/user/${username}/submitted.json`;
    } else {
      url = `https://reddit.com/user/${username}/${view}.json`;
    }
    web
      .get(url)
      .then(response => {
        resolve({
          view: view,
          data: response.data
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

// get the collections of the current user
function getCollections(cookie) {
  return new Promise((resolve, reject) => {
    web
      .get(`https://www.reddit.com/api/multi/mine`, {
        headers: {
          Cookie: `reddit_session=${encodeURIComponent(cookie)}`
        }
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// request a user login with given username and password
function userLogin(username, password) {
  return new Promise((resolve, reject) => {
    // create login request with encoded password
    let url = `https://ssl.reddit.com/api/login/${username}?api_type=json&user=${username}&passwd=${encodeURIComponent(
      password
    )}`;
    web
      .post(url)
      .then(response => {
        if (response.data.json.data !== undefined) {
          resolve(response.data.json.data.cookie);
        } else {
          reject();
        }
      })
      .catch(() => {
        reject();
      });
  });
}

// checks if current session is valid
function checkSession(cookie) {
  return new Promise((resolve, reject) => {
    web
      .get(`https://reddit.com/.json`, {
        headers: {
          Cookie: `reddit_session=${encodeURIComponent(cookie)}`
        }
      })
      .then(response => {
        if (response.data.data.modhash) {
          resolve();
        } else {
          reject();
        }
      })
      .catch(() => {
        reject();
      });
  });
}

module.exports = {
  getSubreddit,
  getArticle,
  getTrendingSubreddits,
  getUser,
  getCollections,
  userLogin,
  checkSession
};
