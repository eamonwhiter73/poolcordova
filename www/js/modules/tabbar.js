function Tabbar() {
	this.initialize = function() {
		var tabbar = document.createElement("div");
		tabbar.style.position = "fixed";
		tabbar.style.display = "flex";
		tabbar.style.top = window.innerHeight - 64 + "px";
		tabbar.style.left = "0px";
		tabbar.style.right = "0px";
		tabbar.style.height = "64px";
		tabbar.style.zIndex = "999";
		tabbar.id = "tabbar";

		createTab(tabbar).then(function(tabbar) {
    	document.body.appendChild(tabbar);
		});
	};

	this.navigate = function(event) {
		if(event.target.id == "tab_0") {
			navigator.camera.getPicture(cameraSuccess, cameraError, {
				quality: 20, 
				destinationType: Camera.DestinationType.FILE_URI,
				sourceType:Camera.PictureSourceType.CAMERA
			});
		}

		event.preventDefault();
		event.stopPropagation();
	}

	const cameraSuccess = function(uri) {
		window.share.setPicture(uri);
		window.share.showShare();
	}

	const cameraError = function(err) {
		document.getElementById("tabbar").style.display = "flex";
		alert(err);
	}

	const createTab = async function(tabbar) {
		for(let x = 0; x < 4; x++) {
			let tab = document.createElement("div");
			tab.id = "tab_"+x;
			tab.style.display = "flex";
			tab.style.flex = "0.25";
			tab.style.backgroundColor = "blue";
			tab.style.justifyContent = "center";
			tab.style.alignItems = "center";
			tab.setAttribute("ontouchstart", "tabbar.navigate(event)");

			let icon = document.createElement("i");
			icon.style.fontSize = "32px";
			icon.style.pointerEvents = "none";

			switch(x) {
				case 0:
					icon.className = "fas fa-share-square";
					break;
				case 1:
					icon.className = "fas fa-list-ul";
					break;
				case 2:
					icon.className = "fas fa-gift";
					break;
				case 3:
					icon.className = "fas fa-cog";
					break;
				default:
					//
			}

			tab.appendChild(icon);
			tabbar.appendChild(tab);

			if(x == 3) {
				return tabbar;
			}
		}
	}
}
