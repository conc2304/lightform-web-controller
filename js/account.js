
function initUser() {
    var source = document.getElementById("account-template").innerHTML
    var template = Handlebars.compile(source)

    fetch(config().apiUrl + '/users/me', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
    })
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        if(response.status == 401) {
            localStorage.removeItem('accessToken');
            window.location.href = 'login.html';
        }
    })
    .then(json => {
        document.getElementById('account').innerHTML = template(json);
    })
}

function onPasswordUpdate(newPassword) {
    fetch(config().apiUrl + '/users/me/password', {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ password: newPassword })
    })
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        if(response.status == 401) {
            localStorage.removeItem('accessToken');
            window.location.href = 'login.html';
        }
    })
}

function initBilling() {
		// Create a Stripe client.
		var stripe = Stripe(config().stripePK);

		// Create an instance of Elements.
		var elements = stripe.elements();

		// Custom styling can be passed to options when creating an Element.
		// (Note that this demo uses a wider set of styles than the guide below.)
		var style = {
			base: {
				color: '#fff',
				fontFamily: '"Atlas Typewriter", monospace',
				fontSize: '16px',
				'::placeholder': {
					color: '#6c757d'
				}
			},
			invalid: {
				color: '#D43333',
				iconColor: '#D43333'
			}
		};

		// Create an instance of the card Element.
		var card = elements.create('card', {style: style});

		// Add an instance of the card Element into the `card-element` <div>.
		card.mount('#card-element');

		var displayError = document.getElementById('card-errors');

		// Handle real-time validation errors from the card Element.
		card.addEventListener('change', function(event) {

			if (event.error) {
				displayError.textContent = event.error.message;
				displayError.style.display = "block";
			} else {
				displayError.style.display = "none";
			}
		});

		// Handle form submission.
		var form = document.getElementById('payment-form');
		form.addEventListener('submit', function(event) {
			event.preventDefault();

			stripe.createToken(card).then(function(result) {
				if (result.error) {
					// Inform the user if there was an error.
					displayError.textContent = result.error.message;
					displayError.style.display = "block";
				} else {
					// Send the token to your server.
					stripeTokenHandler(result.token);
				}
			});
		});
}

// Submit the form with the token ID.
function stripeTokenHandler(token) {

	fetch(config().apiUrl + '/users/me/stripeSource', {
		method: 'put',
		headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
		},
		body: JSON.stringify({source: token.id})
	})
	.then(response => {
		window.location.href = 'account.html'
	});
}
