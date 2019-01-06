//Functions Functions Functions

/* Popups Open and Close */
$(".open").on("click", function() {
	let contents = $(this).parents(".article").find(".popup-content").html();
	$(this).parents(".article").find(".popup-overlay").addClass("active");
	$(this).parents(".article").find(".popup-overlay").html(contents);
});

$(".popup-overlay").on("click", function() {
	$(".popup-overlay").removeClass("active");
});

/* Go to Top Button */
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
	if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
		document.getElementById("goToTop").style.display = "block";
	} else {
		document.getElementById("goToTop").style.display = "none";
	}
}

function topFunction() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

/* Smooth, Slow Scroll Up and Down Page */
$(document).ready(function(){
	$("#link1").click(function() {
			$path=$("#about").offset().top;
			$("body").animate({scrollTop:$path}, 2000);
	});
	$("#link2").click(function() {
			$path=$("#tips").offset().top;
			$("body").animate({scrollTop:$path}, 2000);
	});
	$("#link3").click(function() {
			$path=$("#articles").offset().top;
			$("body").animate({scrollTop:$path}, 2000);
	});
	$("#link4").click(function() {
			$path=$("#contact").offset().top;
			$("body").animate({scrollTop:$path}, 2000);
	});
});

/* Validate Contact Form Fields are not Blank (Client Side) */

function validateForm() {
	var email =  document.getElementById('email').value;
	if (email == "") {
			document.getElementById('status').innerHTML = "Oops! Email cannot be empty";
			return false;
	} else {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(!re.test(email)){
					document.getElementById('status').innerHTML = "Oops! Email format invalid";
					return false;
			}
	}
	var message =  document.getElementById('message').value;
	if (message == "") {
			document.getElementById('status').innerHTML = "Oops! Message cannot be empty";
			return false;
	}
	document.getElementById('status').innerHTML = "Sending...";
	document.getElementById('formContact').submit();
}


////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Contact Form: Submit to database to send on to email address
//
//

// Form Listener Function called 1) on page load and 2) again after AJAX Success

function listenForm(formID, submitFormFunction) {
  var formID = document.querySelector(formID);
  if(formID.addEventListener){
      formID.addEventListener("submit", submitFormFunction, false);  //Modern browsers
  }
}

// Success Message Function (called after AJAX Success)

function successMessage(jsClass) {
  let elementSuccess = document.querySelectorAll(jsClass);
  $(elementSuccess).show(0).delay(5000).hide(0);
}

// Function Call:
// first parameter selects form to listen to, second parameter is function to attach to form
listenForm('#formContact', submitFormContact);

// Submit Contact Form via AJAX
// https://us-central1-earring-happiness.cloudfunctions.net/contactFormSubmit
// http://localhost:5001/earring-happiness/us-central1/contactFormSubmit

function submitFormContact(formContact){
  formContact.preventDefault();
  $.ajax({
    url:'https://us-central1-earring-happiness.cloudfunctions.net/contactFormSubmit',
    type:'post',
    data:$('#formContact').serialize(),
    success:function(data){
      // Show/Hide success message via function call
      successMessage(".js-success.formContact");
      // Clear inputs and textarea of content
      $("#formContact .form-control").val("");
    }
  });
}

//
//
// END: Contact Form: Submit to database to send on to email address
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
