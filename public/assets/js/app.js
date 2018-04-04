$(function () {
  $("#scrape").on("click", function () {
    $.ajax({
      method: "GET",
      url: "/scrape"
    })
      .done(function (data) {
        location.reload();
        alert(data);
      });
  });

  $("#all-articles").on("click", function () {
    $.ajax({
      method: "GET",
      url: "/"
    })
      .done(function (data) {
        location.assign("/");
      });
  });

  $("#commented-articles").on("click", function () {
    $.ajax({
      method: "GET",
      url: "/comments"
    })
      .then(function () {
        location.assign("/comments");
      });
  });

  $(".article-button").on("click", function () {
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .done(function (data) {
        // Reload the page to get the updated list
        location.reload();
      });
  });

  $(".save-comment").on("submit", function (event) {
    event.preventDefault();
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#new-title").val(),
        // Value taken from note textarea
        body: $("#new-body").val()
      }
    })
      // With that done
      .done(function (data) {
        // Reload the page to get the updated list
        location.reload();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#new-title").val("");
    $("#new-body").val("");
  });
});