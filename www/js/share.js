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

		container.appendChild(picContainer);
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
	};
}
