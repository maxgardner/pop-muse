$('#submit-comment').on('click', function(e) {
  e.preventDefault();

  // Grab data from the form
  var email = $('#email').val().trim();
  var name = $('#name').val().trim();
  var comment = $('#comment').val().trim();
  var articleId = $('#article-id').val();

  // Create object to send to server and construct request url
  var data = {
    email: email,
    name: name,
    comment: comment
  }
  var reqUrl = '/' + articleId + '/comments';

  // Send post request and receive response
  $.post(reqUrl, data)
  .done(function(data) {
    console.log(data);
    window.location.reload(true);
  })
  .fail(function(error) {
    console.log(error);
  });
});

$(document).on('click', '.initiate-delete', function(e) {
  e.preventDefault();

  if ($('#submit-delete').hasOwnProperty("0")) {
    return;
  }

  var commentId = $(this).data("comment-id");
  var deleteSection = $('#' + commentId);
  deleteSection.empty();

  var form = '<form>' +
             '<div class="form-group">' +
                '<label for="email">Type email to confirm</label>' +
                '<input type="text" class="form-control" id="confirm-email" />' +
             '</div>' +
             '<input type="hidden" id="comment-id" value="' + commentId + '" />' +
             '<button id="submit-delete" type="submit" class="btn btn-sm btn-danger">Delete</button>' +
             '<button id="cancel-delete" class="btn btn-sm btn-secondary" data-comment-id="' + commentId + '">haha jk nvm</button>';
  deleteSection.append(form);
});

$(document).on('click', '#submit-delete', function(e) {
  e.preventDefault();

  var email = $('#confirm-email').val().trim();
  var commentId = $('#comment-id').val();

  var data = {
    email: email
  };

  var reqUrl = '/' + commentId;

  $.ajax({
    headers: {
      'X-HTTP-Method-Override': 'DELETE',
      'X-Method-Override': 'DELETE'
    },
    method: 'POST',
    url: reqUrl,
    dataType: 'json',
    data: data
  })
  .fail(function(error) {
    var errorTxt = $('<p/>').addClass('error-text');
    errorTxt.text(error.responseText);
    $('#confirm-email').before(errorTxt);
  })
  .done(function(data) {
    window.location.reload(true);
  });
});

$(document).on('click', '#cancel-delete', function(e) {
  e.preventDefault();

  var commentId = $(this).data('comment-id');
  var deleteSection = $('#' + commentId);
  deleteSection.empty();
  var button = '<div class="text-right">' +
                  '<a href="#" data-comment-id="' + commentId + '" class="initiate-delete">Delete</a>' +
                '</div>';

  deleteSection.append(button);
});

/* Vanilla JS attempt at handling server interaction

document.getElementById("submit-comment").addEventListener("click", function(e) {
  e.preventDefault();

  var email = document.getElementById("email").value;
  var name = document.getElementById("name").value;
  var comment = document.getElementById("comment").value;
  var articleId = document.getElementById("article-id").value;

  var data = JSON.stringify({
    Body: {
      email: email,
      name: name,
      comment: comment
    }
  });

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
    }
  };
  xhr.open('POST', '/' + articleId + '/comments');
  xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
  xhr.send(data);
});

*/
