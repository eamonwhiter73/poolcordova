function Share() {
	this.data = {
		picture: null,
		available: false,
		description: "Description here..."
	};
	
	this.initialize = function() {
		var share = document.getElementById("share");
		
		var container = document.createElement("div");
		container.style.flex = "1 1 100%";
		container.style.backgroundColor = "yellow";
		container.style.display = "flex";
		container.style.flexDirection = "column";
		container.id = "container";

		var picContainer = document.createElement("div");
		picContainer.style.display = "flex";
		picContainer.style.flex = "0"
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
		//descriptionLabel.style.justifyContent = "flex-start";
		descriptionLabel.style.alignItems = "center";
		descriptionLabel.id = "description_label";

		var descriptionTextArea = document.createElement("textarea");
		descriptionTextArea.rows = "2";
		descriptionTextArea.cols = "50";
		descriptionTextArea.id = "description_text_area";

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
		itemInput.name = "item_name_input";
		itemInput.id = "item_name_input";

		container.appendChild(picContainer);

		switchLabel.appendChild(switchInput);
		switchLabel.appendChild(sliderSpan);

		toggleContainer.appendChild(shareAvailable);
		toggleContainer.appendChild(switchLabel);
		toggleContainer.appendChild(shareNotAvailable);
		container.appendChild(toggleContainer);

		itemContainer.appendChild(itemLabel);
		itemContainer.appendChild(itemInput);
		container.appendChild(itemContainer);

		descriptionContainer.appendChild(descriptionLabel);
		descriptionContainer.appendChild(descriptionTextArea);
		container.appendChild(descriptionContainer);

		share.appendChild(container);
	};

	this.setPicture = function(uri) {
		var picContainer = document.querySelector("#share>#container>#pic_container");

		var image = document.createElement("img");
		image.src = uri;
		image.id = "share_photo";
		image.width = window.innerWidth;

		picContainer.appendChild(image);
	};

	this.showShare = function() {
		var targetContainer = document.querySelector(".app");
		targetContainer.innerHTML = "";
    targetContainer.appendChild(document.importNode(document.querySelector("#share>#container"), true));
    setTimeout(function() {
    	scrollPage();
    }, 1000);
	};

	const scrollPage = function() {
		console.log("scrolling page");
		document.body.scrollTop = document.body.scrollHeight - window.innerHeight;
	};
		/*var timerID = setInterval(function() {
	    window.scrollBy(0, 5);

	    if( window.pageYOffset >= document.body.scrollHeight - window.innerHeight ) {
	      clearInterval(timerID);
	    }
		}, 13);*/
}
