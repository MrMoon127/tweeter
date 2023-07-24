/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const renderTweets = function(tweets) {
  
  $("#tweets-container").empty();

  for (const tweet of tweets) {
    const $tweetElement = createTweetElement(tweet);
    $("#tweets-container").prepend($tweetElement);
  }
};

const createTweetElement = function(tweetData) {
  let $dateCreated = new Date(tweetData.created_at);
  $dateToday = new Date();
  $timeDifference = $dateToday.getTime() - $dateCreated.getTime();
  $numDays = Math.round($timeDifference / (1000 * 3600 * 24));

  //makes sure the content is in text form so we won't run any tweets as script
  const safeText = `<p class="tweet-p">${escape(tweetData.content.text)}</p>`;
  
  const $tweet = (`
  <article>
    <header class="tweet-header">
      <div class="profile">
        <img src="${tweetData.user.avatars}" alt="profile icon">
        <p>${tweetData.user.name}</p>
      </div>
      <div class="handle">
        ${tweetData.user.handle}
      </div>
    </header>
    ${safeText}
    <footer class="tweet-footer">
      ${$numDays} days ago
      <div class="icons">
        <i class="fa-solid fa-flag"></i>
        <i class="fa-solid fa-retweet"></i>
        <i class="fa-solid fa-heart"></i>
      </div>
    </footer>
  </article>`);
  return $tweet;
};

const loadTweets = function() {
  $.getJSON("/tweets", function(data) {
    renderTweets(data);
  });
};

//helper function for turning tweets to text
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}


// listens for the submit event
document.addEventListener('submit', (event) => {
  event.preventDefault();
  
  $textarea = $("#tweet-text");

  $text = $textarea.val().trim();

  //checks to see if the text adheres to our guidelines (must have text and have 140 characters or less)
  if ($text === "" || $text === null) {
    //slide up so if an alert is displaying, it will slide up to redisplay another error message
    $("#alerts").slideUp(600, function() {
      $("#alerts").empty();
      $("#alerts").append(`<i class="fa-solid fa-triangle-exclamation"></i> Your message is empty!! <i class="fa-solid fa-triangle-exclamation"></i>`);
    })
    //slides down once again to display the error message
    $("#alerts").slideDown(600, function() {
    })
  } else if ($text.length > 140) {
    $("#alerts").slideUp(600, function() {
      $("#alerts").empty();
      $("#alerts").append(`<i class="fa-solid fa-triangle-exclamation"></i> Your message is too long, please adhere to the 140 character limit <i class="fa-solid fa-triangle-exclamation"></i>`);
    })
    $("#alerts").slideDown(600, function() {
    })
  } else {
    //slides up and empties because there are no more errors to be shown
    $("#alerts").slideUp(600, function() {
      $("#alerts").empty();
    })

    $data = $textarea.serialize();

    // this clears the box after a tweet is submit
    $("#tweet-text").val('');
    $.post("/tweets", $data).done(() => loadTweets());
  }

});
