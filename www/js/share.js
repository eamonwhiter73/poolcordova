function Share() {
	this.data = {
		uri: null,
		item_name: null,
		description_text: null,
		available: true
	};
	
	this.initialize = async function() {

		var share = document.getElementById("share");
		
		var container = document.createElement("div");
		container.style.flex = "1 1 100%";
		container.style.backgroundColor = "yellow";
		container.style.display = "flex";
		container.style.flexDirection = "column";
		container.id = "container";

		/*var form = document.createElement("form");
		form.action = "";
		form.id = "share_form";
		form.setAttribute("onsubmit", "window.share.submitShare(event)");*/

		var picContainer = document.createElement("div");
		picContainer.style.display = "flex";
		picContainer.style.flex = "0";
		picContainer.style.flexDirection = "column";
		picContainer.id = "pic_container";

		var toggleContainer = document.createElement("div");
		toggleContainer.style.display = "flex";
		toggleContainer.style.flex = "1";
		toggleContainer.style.alignItems = "center";
		toggleContainer.style.justifyContent = "space-evenly";
		toggleContainer.style.flexDirection = "row";
		toggleContainer.id = "toggle_container";

		var descriptionContainer = document.createElement("div");
		descriptionContainer.style.display = "flex";
		descriptionContainer.style.flex = "1";
		descriptionContainer.style.alignItems = "center";
		descriptionContainer.style.justifyContent = "center";
		descriptionContainer.style.flexDirection = "column";
		descriptionContainer.id = "description_container";

		var descriptionLabel = document.createElement("h3");
		descriptionLabel.style.display = "flex";
		descriptionLabel.style.flex = "0";
		descriptionLabel.style.margin = "0em 0em 0em 0em";
		descriptionLabel.innerText = "Description";
		descriptionLabel.style.alignItems = "center";
		descriptionLabel.id = "description_label";

		var descriptionTextArea = document.createElement("textarea");
		descriptionTextArea.rows = "2";
		descriptionTextArea.cols = "50";
		descriptionTextArea.id = "description_text_area";
		descriptionTextArea.name = "description_text_area_name";
		descriptionTextArea.placeholder = "Item description...";
		descriptionTextArea.setAttribute("onchange", "window.share.textAreaChange(this.value)", false);

		var shareAvailable = document.createElement("h3");
		shareAvailable.style.display = "flex";
		shareAvailable.style.flex = "0.33";
		shareAvailable.style.margin = "0em 0em 0em 0em";
		shareAvailable.innerText = "Active";
		shareAvailable.style.justifyContent = "center";
		shareAvailable.style.alignItems = "center";
		shareAvailable.id = "share_available";

		var shareNotAvailable = document.createElement("h3");
		shareNotAvailable.style.display = "flex";
		shareNotAvailable.style.flex = "0.33";
		shareNotAvailable.style.margin = "0em 0em 0em 0em";
		shareNotAvailable.innerText = "Inactive";
		shareNotAvailable.style.justifyContent = "center";
		shareNotAvailable.style.alignItems = "center";
		shareNotAvailable.id = "not_available";

		var switchLabel = document.createElement("label");
		switchLabel.className = "switch";

		var switchInput = document.createElement("input");
		switchInput.type = "checkbox";
		switchInput.name = "toggle";
		switchInput.id = "toggle";
		switchInput.setAttribute("onchange", "window.share.availableChange(this.value)", false);

		var sliderSpan = document.createElement("span");
		sliderSpan.className = "slider";

		var itemContainer = document.createElement("div");
		itemContainer.style.display = "flex";
		itemContainer.style.flex = "1";
		itemContainer.style.alignItems = "center";
		itemContainer.style.justifyContent = "center";
		itemContainer.style.flexDirection = "column";
		itemContainer.id = "item_container";

		var itemLabel = document.createElement("h3");
		itemLabel.style.display = "flex";
		itemLabel.style.flex = "0";
		itemLabel.style.margin = "0em 0em 0em 0em";
		itemLabel.innerText = "Item";
		//itemLabel.style.justifyContent = "flex-start";
		itemLabel.style.alignItems = "center";
		itemLabel.id = "item_label";

		var itemInput = document.createElement("input");
		itemInput.type = "text";
		itemInput.size = "50";
		itemInput.style.lineHeight = "2em";
		itemInput.name = "item_name_input_name";
		itemInput.id = "item_name_input";
		itemInput.placeholder = "Name of item...";
		itemInput.setAttribute("onchange", "window.share.inputItemNameChange(this.value)", false);

		var submitButton = document.createElement("button");
		submitButton.style.borderRadius = "0px";
		submitButton.style.display = "flex";
		submitButton.style.width = "361px";
		submitButton.style.height = "64px";
		submitButton.style.backgroundColor = "green";
		submitButton.innerHTML = "SUBMIT";
		submitButton.style.justifyContent = "center";
		submitButton.style.alignItems = "center";
		submitButton.style.marginTop = "10px";
		submitButton.id = "submit_button";
		submitButton.setAttribute("ontouchstart", "window.share.submitShare(event)", false);

		container.appendChild(picContainer);

		switchLabel.appendChild(switchInput);
		switchLabel.appendChild(sliderSpan);

		toggleContainer.appendChild(shareAvailable);
		toggleContainer.appendChild(switchLabel);
		toggleContainer.appendChild(shareNotAvailable);
		toggleContainer.style.padding = "10px";
		//form.appendChild(toggleContainer);
		container.appendChild(toggleContainer);

		itemContainer.appendChild(itemLabel);
		itemContainer.appendChild(itemInput);
		//form.appendChild(itemContainer);
		container.appendChild(itemContainer);

		descriptionContainer.appendChild(descriptionLabel);
		descriptionContainer.appendChild(descriptionTextArea);
		descriptionContainer.appendChild(submitButton);
		descriptionContainer.style.paddingBottom = "10px";
		//form.appendChild(descriptionContainer);
		container.appendChild(descriptionContainer);

		//container.appendChild(form);

		share.appendChild(container);
		return;

		/*$("#item_name_input").change(function() {
			console.log("in item_name change");
		  this.data.item_name = $(this).val();
		});

		$("#description_text").change(function() {
			console.log("in description_text change");
			this.data.description_text = $(this).val(); 
		}*/
	};

	this.textAreaChange = function(value) {
		this.data.description_text = value;
	}

	this.inputItemNameChange = function(value) {
		this.data.item_name = value;
	}

	this.availableChange = function(value) {
		this.data.available = value;
	}

	this.submitShare = function(event) {
		//event.preventDefault();
		//var item_name = $("#item_name_input").attr("value");
    //var description_text = $("#description_text_area").attr("value"); // TEST THIS OUT FIRST THING TOMMORROW, JUST RUN IT!!!!!!!!!!!!!
		if(this.data.item_name == null || this.data.description_text == null) {
			alert("You need to fill out all of the fields");
			return;
		}

		resolveLocalFileSystemURL(this.data.uri, function(entry) {
	    entry.file(function (file) {
         var reader = new FileReader();
         reader.onloadend = function () {
	          // This blob object can be saved to firebase
	          var blob = new Blob([new Uint8Array(this.result)], { type: "image/jpeg" });                  
	          sendToFirebase(blob);
         };
         
         reader.readAsArrayBuffer(file);
      });
	  }, function (error) {
	    console.log(error);
	  });
	};

	const generateUUID = function() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
	};

	const sendToFirebase = function(blob) {
		var date = new Date().getTime();
		var storageRef = firebase.storage().ref();
		//var item_name = document.getElementById("item_name_input").value;
		//var description_text = document.getElementById("description_text_area").value;
		var uploadTask = storageRef.child('share_images/'+window.user.uid+'/'+date+'.jpg').put(blob);

    // Register three observers:
		// 1. 'state_changed' observer, called any time the state changes
		// 2. Error observer, called on failure
		// 3. Completion observer, called on successful completion
		uploadTask.on('state_changed', function(snapshot){
		  // Observe state change events such as progress, pause, and resume
		  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		  console.log('Upload is ' + progress + '% done');
		  switch (snapshot.state) {
		    case firebase.storage.TaskState.PAUSED: // or 'paused'
		      console.log('Upload is paused');
		      break;
		    case firebase.storage.TaskState.RUNNING: // or 'running'
		      console.log('Upload is running');
		      break;
		  }
		}, function(error) {
		  // Handle unsuccessful uploads
		}, function() {
		  // Handle successful uploads on complete
		  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
		  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
		    console.log('File available at', downloadURL);
		    // Initialize Cloud Firestore through Firebase
				var db = firebase.firestore();

				// Disable deprecated features
				db.settings({
				  timestampsInSnapshots: true
				});

				// Add a new document in collection "cities"
				db.collection("shares").doc(window.user.uid).collection("data").doc(date).set({date: date, downloadURL: downloadURL, item: this.data.item_name, description: this.date.description_text, available: this.data.available})
					.then(function() {
				    console.log("Document successfully written!");
				    this.data.item_name = null;
				    this.data.description_text = null;
				    this.data.available = true;
					})
					.catch(function(error) {
				    console.error("Error writing document: ", error);
					});
		  });
		});
	};

	this.setPicture = function(uri) {
		this.data.uri = uri;
		var picContainer = document.querySelector("#share>#container>#pic_container");

		var image = document.createElement("img");
		image.src = uri;
		image.id = "share_photo";
		image.width = window.innerWidth;

		picContainer.appendChild(image);
	};

	this.showShare = function() {
		self = this;
		var targetContainer = document.querySelector(".app");
		targetContainer.innerHTML = "";
    targetContainer.appendChild(document.importNode(document.querySelector("#share>#container"), true));
    setTimeout(function() {
    	scrollPage();
    }, 1000);

    firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {
		    self.data.user = user;
		  }
		});
	};

	const scrollPage = function() {
		console.log("scrolling page");
		document.body.scrollTop = document.body.scrollHeight - window.innerHeight;
	};
}
