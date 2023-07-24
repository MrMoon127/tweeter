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
    <p class="tweet-p">
      ${tweetData.content.text}
    </p>
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
}

document.addEventListener('submit', (event) => {
  event.preventDefault();

  $textarea = $("#tweet-text");

  $text = $textarea.val().trim();

  if ($text === "" || $text === null) {
    alert("your message is empty!!!");
  } else if ($text.length > 140) {
    alert("your message is too long, please be more concise")
  } else {
    $data = $textarea.serialize();
    $.post("/tweets", $data)

    loadTweets();
  }

});
