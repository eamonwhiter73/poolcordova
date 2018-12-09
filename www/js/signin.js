function SignIn() {
	
	this.data = {

	};
	
	this.initialize = async function() {
		console.log("signin initialize");

		var signin = document.getElementById("signin");

		var container = document.createElement("div");
		container.style.flex = "1 1 100%";
		container.style.backgroundColor = "yellow";
		container.style.display = "flex";
		container.style.flexDirection = "column";
		container.id = "container";

		/*var fbLoginButton = document.createElement("fb:login-button");
		fbLoginButton.className = "fb-login-button";
		fbLoginButton.setAttribute("data-max-rows", "1");
		fbLoginButton.setAttribute("data-size", "medium");
		fbLoginButton.setAttribute("data-button-type", "login_with");
		fbLoginButton.setAttribute("data-show-faces", "false");
		fbLoginButton.setAttribute("data-button-type", "login_with");
		fbLoginButton.setAttribute("data-auto-logout-link", "false");
		fbLoginButton.setAttribute("data-use-continue-as", "false");
		fbLoginButton.setAttribute("scope", "public_profile,email");
		fbLoginButton.setAttribute("onlogin", "window.signin.checkLoginState();");

		var buttonsContainer = document.createElement("div");
		buttonsContainer.id = "buttons_container";
		buttonsContainer.style.flex = "0";
		buttonsContainer.style.display = "flex";
		buttonsContainer.style.justifyContent = "center";
		buttonsContainer.style.alignItems = "center";

		buttonsContainer.appendChild(fbLoginButton);
		container.appendChild(buttonsContainer);*/

		signin.appendChild(container);

		return await showSignIn();
	};

	var showSignIn = async function() {
		console.log("in showSignIn");
		var targetContainer = document.querySelector(".app");
    targetContainer.appendChild(document.importNode(document.querySelector("#signin>#container"), true));

    console.log("after importNode in signin");

    firebase.auth().onAuthStateChanged(function(firebase_user) {
    	console.log("onAuthStateChanged");
		  if (firebase_user) {
		  	console.log("firebase user found");
		    console.log("user from onAuthStateChanged: "+JSON.stringify(firebase_user));
		    window.user = firebase_user;
		    window.pool.populate();
		    console.log("populated");
		    return;
		  }
		  else {
		  	var provider = new firebase.auth.FacebookAuthProvider();
		    provider.addScope('public_profile');
		    provider.addScope('email');
		    provider.addScope('pages_show_list');

		    firebase.auth().signInWithRedirect(provider).then(function() {
		    	firebase.auth().getRedirectResult().then(function(result) {
			    	console.log("result: "+JSON.stringify(result));
					  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
					  var token = result.credential.accessToken;
					  // The signed-in user info.
					  var user = result.user;
					  
					  console.log("result.user: "+user); //////STORE USER IN DATABASE HERE!

					  var uid = user.uid;

					  // Initialize Cloud Firestore through Firebase
						var db = firebase.firestore();

						// Disable deprecated features
						db.settings({
						  timestampsInSnapshots: true
						});

						// Add a new document in collection "cities"
						db.collection("users").doc(uid).set(JSON.parse(JSON.stringify(user)))
							.then(function() {
						    console.log("Document successfully written!");
						    window.pool.populate();
						    return;
							})
							.catch(function(error) {
						    console.error("Error writing document: ", error);
						    return;
							});
					});
		    }).catch(function(error) {
				  // Handle Errors here.
				  var errorCode = error.code;
				  var errorMessage = error.message;
				  // The email of the user's account used.
				  var email = error.email;
				  // The firebase.auth.AuthCredential type that was used.
				  var credential = error.credential;
				  // ...
				  console.log("signInError: "+error);

			    if (error.code === 'auth/account-exists-with-different-credential') { //////CODE THIS SECTION CORRECTLY ACCORDING TO COMMENTS!
				    // Step 2.
				    // User's email already exists.
				    // The pending Facebook credential.
				    var pendingCred = error.credential;
				    // The provider account's email address.
				    var email = error.email;
				    // Get sign-in methods for this email.
				    auth.fetchSignInMethodsForEmail(email).then(function(methods) {
				      // Step 3.
				      // If the user has several sign-in methods,
				      // the first method in the list will be the "recommended" method to use.
				      if (methods[0] === 'password') {
				        // Asks the user his password.
				        // In real scenario, you should handle this asynchronously.
				        var password = promptUserForPassword(); // TODO: implement promptUserForPassword.
				        auth.signInWithEmailAndPassword(email, password).then(function(user) {
				          // Step 4a.
				          console.log("user: "+user); //////STORE USER IN DATABASE HERE!
				          return user.link(pendingCred);
				        }).then(function() {
				          // Facebook account successfully linked to the existing Firebase user.
				          window.pool.populate();
				        });
				        return;
				      }
				      // All the other cases are external providers.
				      // Construct provider object for that provider.
				      // TODO: implement getProviderForProviderId.
				      var provider = getProviderForProviderId(methods[0]);
				      // At this point, you should let the user know that he already has an account
				      // but with a different provider, and let him validate the fact he wants to
				      // sign in with this provider.
				      // Sign in to provider. Note: browsers usually block popup triggered asynchronously,
				      // so in real scenario you should ask the user to click on a "continue" button
				      // that will trigger the signInWithPopup.
				      auth.signInWithPopup(provider).then(function(result) {
				        // Remember that the user may have signed in with an account that has a different email
				        // address than the first one. This can happen as Firebase doesn't control the provider's
				        // sign in flow and the user is free to login using whichever account he owns.
				        // Step 4b.
				        // Link to Facebook credential.
				        // As we have access to the pending credential, we can directly call the link method.
				        result.user.linkAndRetrieveDataWithCredential(pendingCred).then(function(usercred) {
				          // Facebook account successfully linked to the existing Firebase user.
				          
				          console.log("usercred: "+usercred); //////STORE USER IN DATABASE HERE!
				          window.pool.populate();
				          return;
				        });
				      });
				    });
				  }
				});
		  }
		});
	};
}
