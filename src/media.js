// media.js provides functions to create media objects

const logger = require("./logger");

// checks if the article is media
function isMedia(data) {
  return (
    data.media !== null || data.url.match(/(.jpg)|(.png)|(.gif\b)|(.gifv\b)/g)
  );
}

// creates html string for media
function createMediaHTML(data) {
  if (data.url.match(/(.jpg)|(.png)/g)) {
    return createImageHTML(data.url);
  }
  if (data.url.match(/(.gif\b)|(.gifv\b)/g)) {
    return createGifHTML(data);
  }
  if (data.media.oembed) {
    return createIframeHTML(data.media);
  }
  if (data.media.reddit_video) {
    return createVideoHTML(data.media.reddit_video);
  }
  logger.error("couldn't create media panel");
  return null;
}

// creates html string for image files
function createImageHTML(url) {
  return `
  <a class="function-color" onclick=collapseDiv('imgContainer')>&nbsp; &nbsp; &nbsp; &nbsp; expand</a>
  <span class="bracket-color">() {</span>
    <div id="imgContainer" style="display: none">
      <img src="${url}" alt="media" height="auto" width="auto"></img>
    </div>
  <span class="bracket-color">}</span>
  
  </br>
  `;
}

// creates html string for embedded media
function createIframeHTML(media) {
  let videohtml = media.oembed.html;

  // decode html
  videohtml = videohtml.replace(/&lt;/g, "<");
  videohtml = videohtml.replace(/&amp;/g, "&");
  videohtml = videohtml.replace(/&gt;/g, ">");

  let html = `
  <a class="function-color" onclick=collapseDiv('mediaContainer')>&nbsp; &nbsp; &nbsp; &nbsp; expand</a>
  <span class="bracket-color">() {</span>
    <div id="mediaContainer" style="display: none">
  `;

  html += videohtml;

  html += `
    </div>
  <span class="bracket-color">}</span>
  `;

  return html;
}

// creates html string for dash url videos
function createVideoHTML(reddit_video) {
  return `
  <a class="function-color" onclick=collapseDiv('videoContainer')>&nbsp; &nbsp; &nbsp; &nbsp; expand</a>
  <span class="bracket-color">() {</span>
    <div id="videoContainer" style="display: none">
      <video autoplay>
        <source src="${reddit_video.fallback_url}" type="video/mp4">
      </video>
    </div>
  <span class="bracket-color">}</span>
  `;
}

// creates html string for gifv
function createGifHTML(data) {
  return `
  <a class="function-color" onclick=collapseDiv('gifContainer')>&nbsp; &nbsp; &nbsp; &nbsp; expand</a>
  <span class="bracket-color">() {</span>
    <div id="gifContainer" style="display: none">
      <iframe src=${data.url} frameborder="0" scrolling="no" width="${
    data.preview.images[0].source.width
  }" height="${data.preview.images[0].source.height}"></iframe>
    </div>
  <span class="bracket-color">}</span>
  
  </br>
  `;
}

module.exports = {
  isMedia,
  createMediaHTML
};
