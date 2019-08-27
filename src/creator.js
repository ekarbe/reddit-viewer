// creator.js provides the functions to create the html views

const templates = require("./templates");
const api = require("./api");

let stylesheetPath;

// creates the landing page html string
function createLandingpageView(config, session) {
  return new Promise((resolve, reject) => {
    api
      .getTrendingSubreddits()
      .then(response => {
        let html =
          templates.head(stylesheetPath) +
          templates.search(config.defaultSubreddit) +
          templates.trending(response);
        if (config.help) {
          html += templates.help();
        }
        html += templates.project();
        if (session.active) {
          html += templates.logout(session.username);
        } else {
          html += templates.login();
        }
        html += templates.tail();
        resolve(html);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// creates the subreddit view html string
function createSubredditView(data) {
  return new Promise((resolve, reject) => {
    api
      .getSubreddit(
        data.subreddit,
        data.sort,
        data.interval,
        data.limit,
        data.count,
        data.after,
        data.before
      )
      .then(response => {
        let articles = response.data.children;
        let html =
          templates.head(stylesheetPath) +
          templates.homeBack() +
          templates.sort(data.sort);
        if (data.sort === "top" || data.sort === "controversial") {
          html += templates.time(data.interval);
        }
        for (let i in articles) {
          html += templates.article(articles[i].data);
        }
        html +=
          templates.pagination(response.data.after, response.data.before) +
          templates.tail();
        resolve(html);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// creates article view html string
function createArticleView(subreddit, articleID) {
  return new Promise((resolve, reject) => {
    api
      .getArticle(subreddit, articleID)
      .then(response => {
        let articleDetails = response[0].data.children[0].data;
        let comments = response[1].data;
        let html =
          templates.head(stylesheetPath) +
          templates.homeBack() +
          templates.subredditBack(subreddit) +
          templates.articleDetails(articleDetails);
        for (let i = 0; i < comments.children.length; i++) {
          comments.children[i].data.orginalPostAuthor = articleDetails.author;
          if (comments.children[i].kind !== "more") {
            if (comments.children[i].data.author === articleDetails.author) {
              comments.children[i].data.author += " (OP)";
            }
            html += templates.comment(comments.children[i]);
          }
        }
        html += templates.tail();
        resolve(html);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// creates user view html string
function createUserView(data) {
  return new Promise((resolve, reject) => {
    api
      .getUser(data.username, data.view)
      .then(response => {
        let html = templates.head(stylesheetPath) + templates.homeBack();
        if (data.refLocation == "subreddit") {
          html += templates.subredditBack(data.refID);
        } else if (data.refLocation == "article") {
          html += templates.articleBack(data.refID);
        }
        html += templates.userNav(data);
        switch (data.view) {
          case "about":
            html += templates.userAbout(response.data.data);
            resolve(html);
            break;
          case "posts":
            let articles = response.data.data.children;
            if (articles.length === 0) {
              html += templates.empty("Articles");
            }
            for (let i in articles) {
              html += templates.article(articles[i].data);
            }
            resolve(html);
            break;
          case "comments":
            let comments = response.data.data.children;
            if (comments.length === 0) {
              html += templates.empty("Comments");
            }
            for (let i in comments) {
              html += templates.comment(comments[i]);
            }
            resolve(html);
            break;
          default:
            reject("invalid view");
            break;
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

// sets the path of the stylesheet
function setStylesheetPath(path) {
  stylesheetPath = path;
}

module.exports = {
  setStylesheetPath,
  createLandingpageView,
  createSubredditView,
  createArticleView,
  createUserView
};
