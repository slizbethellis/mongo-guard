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
    var id = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + id
    })
      // With that done, add the note information to the page
      .done(function (data) {
        location.assign(`/articles/${id}`);
      });
  });

  $(".make-comment").on("submit", function (event) {
    event.preventDefault();
    var id = $(this).attr("data-id");
    var title = $(`#new-title${id}`).val();
    var body = $(`#new-body${id}`).val();

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax("/articles/" + id, {
      method: "POST",
      data: {
        title: title,
        body: body,
        article: id
      }
    })
      // With that done
      .done(function (data) {
        // Reload the page to get the updated list
        location.reload();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $(`#new-title${id}`).val("");
    $(`#new-body${id}`).val("");
  });

  $(".delete").on("click", function () {
    var id = $(this).attr("data-id");
    var articleId = location.pathname;

    $.ajax(`${articleId}/deleteNote/${id}`, {
      method: "POST"
    })
      // With that done
      .done(function (data) {
        // Reload the page to get the updated list
        location.reload();
      });
  });
});