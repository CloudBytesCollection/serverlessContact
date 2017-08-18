/*
	Custom Contact Form Handler
*/
$(function () {
	var _contactURL = $("meta[name=serverlessContact]").attr("content");

	$('form[id=contactForm]').on('submit', function (e) {
		e.preventDefault();

		var contactName = $('#name')[0].value + "";
		var contactPhone = $('#phone')[0].value + "";
		var contactEmail = $('#email')[0].value + "";
		var contactMessage = $('#message')[0].value + "";

		var formData = $(this).serializeArray();
		var formJSON = {};

		// Format form data to JSON
		$.each(formData, function () {
			if (formJSON[this.name]) {
				if (!formJSON[this.name].push) {
					formJSON[this.name] = [formJSON[this.name]];
				}
				formJSON[this.name].push(this.value || '');
			} else {
				formJSON[this.name] = this.value || '';
			}
		});

		$.ajax({
			url: _contactURL,
			method: "POST",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify(formJSON),
			cache: false,
			success: function (response) {
				console.log("Email successfully sent");
				$('#successMessage').removeClass("hidden");
				$('#formGroup').addClass("hidden");
			},
			error: function (msg) {
				console.log("Form error: " + msg);
				$('#errorMessage').removeClass("hidden");
			}
		});
	});
});
