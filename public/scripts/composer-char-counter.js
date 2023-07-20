$(document).ready(function () {

  $(".new-tweet").on("keyup keypress", "textarea" , function(event) {
    $text = $(this).val();
    $charsLeft = 140 - $text.length;

    $counter = $(this).closest("form").find(".counter")
    $counter.text($charsLeft);
    
    if ($charsLeft < 0) {
      $counter.addClass("fontRed");
    } else {
      $counter.removeClass("fontRed");
    }
  });

});