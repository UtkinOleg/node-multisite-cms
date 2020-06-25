function validateText(id) {
  if ($("#"+id).val()==null || $("#"+id).val()=="") {
    var div = $("#"+id).closest("div");
    div.removeClass("has-success");
    div.addClass("has-error");
    return false;
  } else {
    var div = $("#"+id).closest("div");
    div.removeClass("has-error");
    div.addClass("has-success");
    return true;
  }
}

function validateEmail(id) {
  var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
  if (!email_regex.test($("#"+id).val())) {
    var div = $("#"+id).closest("div");
    div.removeClass("has-success");
    div.addClass("has-error");
    return false;
  } else{
      var div = $("#"+id).closest("div");
      div.removeClass("has-error");
      div.addClass("has-success");
      return true;
  }
}


$(document).ready(function () {

});
