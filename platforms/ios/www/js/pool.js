function Pool() {
	self = this;

	this.fake_data = [{name: "Hammer", pic: cordova.file.applicationDirectory + "www/assets/images/one.png", active: true}, {name: "Screwdriver", pic: cordova.file.applicationDirectory + "www/assets/images/five.png", active: true},
									 {name: "Iron", pic: cordova.file.applicationDirectory + "www/assets/images/two.png", active: true}, {name: "Pot", pic: cordova.file.applicationDirectory + "www/assets/images/two.png", active: true},
									 {name: "Stapler", pic: cordova.file.applicationDirectory + "www/assets/images/three.png", active: true}, {name: "Frying pan", pic: cordova.file.applicationDirectory + "www/assets/images/four.png", active: true},
									 {name: "Sugar", pic: cordova.file.applicationDirectory + "www/assets/images/four.png", active: true}, {name: "Tape", pic: cordova.file.applicationDirectory + "www/assets/images/one.png", active: true}];
	this.data = [];
	this.total_rows = 1;
	this.total_boxes = 0;
	this.last_total_boxes = 0;
	this.debounce_timer = null;
	this.lastY = 0;
	this.interval = null;
	this.dragStartTime = null;
	this.startScrollTopHold = 0;
	this.absValue = 1;
	this.mult = 1;
	this.pool_name = null;
	this.nearestPlace = null;
	this.myPosition = null;
	this.lastDateIndex = 0;
	this.last_total_rows = 0;

	this.initialize = async function() { //MAKE ASYNC!!!!!!!!!!!!!!!!!!!
		var pool = document.getElementById("pool");

		var container = document.createElement("div");
		container.style.height = (window.innerHeight - 63)+"px";
		container.style.backgroundColor = "yellow";
		container.style.display = "flex";
		container.style.flexDirection = "column";
		container.style.overflow = "auto";
		container.id = "container";
		container.setAttribute("ontouchmove", "window.pool.dragging(event)");
		container.setAttribute("ontouchend", "window.pool.endDrag(event)");
		container.setAttribute("ontouchstart", "window.pool.startDrag(event)");
		container.setAttribute("onscroll", "window.pool.loadMore()");

		var row = document.createElement("div");
		row.style.display = "none";
		row.style.flexDirection = "row";
		row.style.flex = "0.94";
		row.style.backgroundColor = "green";
		row.style.minHeight = (window.innerHeight - 63) / 2 + "px";
		row.className = "row";
		row.id = "row_0";

		container.appendChild(row);
		pool.appendChild(container);

		//retrieve currentPoolId
		var storage = window.localStorage;
		window.currentPoolId = storage.getItem("currentPoolId");

		var db = firebase.firestore();

		// Disable deprecated features
		db.settings({
		  timestampsInSnapshots: true
		});

		db.collection("pools").doc(window.currentPoolId).collection("list")
	    .onSnapshot(function(snapshot) {
        console.log("snapshot when something is added:");
        console.dir(snapshot);

        var cou = 0;
        window.pool.last_total_rows = window.pool.total_rows;

        snapshot.docChanges().forEach(function(change) {
          if (change.type === "added") {
            console.log("New: ", change.doc.data());
            if(window.pool.data.length != 0) {
            	window.pool.data.insert(0, change.doc.data());
            }
          }
          if (change.type === "modified") {
              console.log("Modified city: ", change.doc.data());
          }
          if (change.type === "removed") {
              console.log("Removed city: ", change.doc.data());
          }

          if(cou == snapshot.docChanges().size - 1) {
          	window.pool.createBoxes("shifting").then(function() {
           		window.pool.showPool("adding");
           	});
          }

          cou++;
      	});
	    }, function(error) {
	        console.log("error with onSnapshot: "+error);
	    });

		return;
	}

	this.createBoxes = async function(load) {
		var added_row = false;
		var pool_var = null;
		/*if(load) {
			pool_var = document.querySelector(".app>#container");
		}
		else {*/
			pool_var = document.querySelector("#pool>#container");
		//}

		console.log("window.pool.data: "+JSON.stringify(window.pool.data));
		console.log("window.pool.total_boxes: "+window.pool.total_boxes);
		console.log("window.pool.data.length: "+window.pool.data.length);
		//console.log("window.pool.data[0].downloadURL: "+JSON.stringify(window.pool.data[window.pool.total_boxes].downloadURL));
		

		for (var i = 1; this.total_boxes < window.pool.data.length; i++) {

			var item_box = document.createElement("div");
			item_box.style.flex = "0.5 0 ";
			item_box.style.display = "flex";
			item_box.style.position = "relative";
			item_box.style.overflow = "hidden";
			document.styleSheets[0].insertRule('#item_box_'+window.pool.total_boxes+':before { content: ""; }', window.pool.total_boxes);
			document.styleSheets[0].cssRules[window.pool.total_boxes].style.position = "absolute";
			document.styleSheets[0].cssRules[window.pool.total_boxes].style.width = "139%";
			document.styleSheets[0].cssRules[window.pool.total_boxes].style.height = "139%";
			document.styleSheets[0].cssRules[window.pool.total_boxes].style.top = "-25%";
			document.styleSheets[0].cssRules[window.pool.total_boxes].style.left = "-73%";
			document.styleSheets[0].cssRules[window.pool.total_boxes].style.background = "no-repeat left top/100% url("+window.pool.data[window.pool.total_boxes].downloadURL+")";
			document.styleSheets[0].cssRules[window.pool.total_boxes].style.transform = "rotate(90deg)";
			document.styleSheets[0].cssRules[window.pool.total_boxes].style.webkitTransform = "rotate(90deg)";
			document.styleSheets[0].cssRules[window.pool.total_boxes].style.zIndex = "0";
			item_box.style.flexDirection = "column";
			item_box.style.justifyContent = "flex-end";
			item_box.style.borderBottom="2px solid #9a9a9a";
			//item_box.style.background = "no-repeat center/100% url("+window.pool.data[window.pool.total_boxes].downloadURL+")";
			item_box.id = "item_box_"+window.pool.total_boxes;

			console.log("item_box.style.background: "+item_box.style.background);

			var colors = ["#e0e0e0", "#bfbfbf"];

			var item_name = document.createElement("h3");
			item_name.style.display = "flex";
			item_name.style.flex = "0.11 0";
			item_name.style.width = "100%";

			item_name.style.backgroundColor = (i % 2 == 0 ? colors[0] : colors[1]);
			item_name.style.justifyContent = "center";
			item_name.style.alignItems = "center";
			item_name.style.margin = "0em 0em 0em 0em";
			item_name.style.zIndex = "1";
			item_name.innerText = window.pool.data[window.pool.total_boxes].item;
			item_name.id = "item_name_"+window.pool.total_boxes;
			
			item_box.appendChild(item_name);

			console.log("window.pool.total_rows: "+window.pool.total_rows);
			//console.log("length of row elements: "+pool_var.getElementsByClassName("row").length);

			if(load == "shifting") {
				window.pool.in_box_shift = true;
				if(window.pool.data.length % 2 != 0) {
					var item = null;
					for(var c = 0; c < window.pool.total_rows; c++) {
						if(c != 0) {
							//pool_var.getElementsByClassName("row")[c].insertBefore(last_item_box, pool_var.getElementsByClassName("row")[c+1].childNodes[0]));
							item = pool_var.getElementsByClassName("row")[c - 1].childNodes[2];
							pool_var.getElementsByClassName("row")[c].insertBefore(item, pool_var.getElementsByClassName("row")[c].childNodes[0]);
							pool_var.getElementsByClassName("row")[c - 1].childNodes[2].remove();

							if(c == window.pool.total_rows - 1 && pool_var.getElementsByClassName("row")[c].childNodes.length == 3) {
								item = pool_var.getElementsByClassName("row")[c].childNodes[2];
								pool_var.getElementsByClassName("row")[c].childNodes[2].remove();

								window.pool.total_rows++;

								var row_added = document.createElement("div");
								row_added.style.display = "flex";
								row_added.style.flexDirection = "row";
								row_added.style.flex = "0.94";
								row_added.style.backgroundColor = "green";
								row_added.className = "row";
								row_added.style.minHeight = (window.innerHeight - 63) / 2 + "px";
								row_added.id = "row_"+window.pool.total_rows

								row_added.appendChild(item);
								pool_var.appendChild(row_added);

								added_row = true;
							}
						}
						else {
							pool_var.getElementsByClassName("row")[c].insertBefore(item_box, pool_var.getElementsByClassName("row")[c].childNodes[0]);
						}
					}
				}
			}
			else if(load == "initial" || load == "adding") {
				pool_var.getElementsByClassName("row")[window.pool.total_rows - 1].appendChild(item_box);
				pool_var.getElementsByClassName("row")[window.pool.total_rows - 1].style.display = "flex";
			}

			window.pool.total_boxes++;

			console.log("window.pool.total_boxes inside loop: "+window.pool.total_boxes);
			console.log("window.pool.data.length: "+window.pool.data.length);

			if(i % 2 == 0 && !added_row) {				
				var inner_row = document.createElement("div");
				inner_row.style.display = "none";
				inner_row.style.flexDirection = "row";
				inner_row.style.flex = "0.94";
				inner_row.style.backgroundColor = "green";
				inner_row.className = "row";
				inner_row.style.minHeight = (window.innerHeight - 63) / 2 + "px";
				inner_row.id = "row_"+window.pool.total_rows

				pool_var.appendChild(inner_row);

				window.pool.total_rows++;
			}
			else if(window.pool.total_boxes == window.pool.data.length) {
				return;
			}
		}
	}

	var setTimedInterval = function(callback, delay, timeout){
		window.clearInterval(this.interval);
    this.interval=window.setInterval(callback, delay);
    window.setTimeout(function(){
        window.clearInterval(this.interval);
    }, timeout);
	}

	this.startDrag = function(event) {
		this.lastY = event.pageY;
		this.dragStartTime = new Date().getTime();
		this.startScrollTopHold = document.querySelector(".app>#container").scrollTop;
	}

	this.endDrag = function(event) {
		self = this;

		this.absValue = 1;
		this.mult = new Date().getTime() - this.dragStartTime;
		var initial_mult = this.mult;

		let currentY = event.pageY;
		console.log("scroll length in endDrag: "+(Math.abs(document.querySelector(".app>#container").scrollTop - self.startScrollTopHold)))


		if(document.querySelector(".app>#container").scrollTop > 0 && currentY < this.lastY) { // DOWN
			setTimedInterval(function() {
				var exp1 = 200/Math.abs(self.absValue);
				//var exp2 = Math.log2(exp1);
				var exp = 24*exp1*(Math.abs(self.absValue)/self.mult); // /CUBE IT or QUAD IT!
				//var exp = Math.log2((30*exp2)*);

				//console.log("exp1 in endDrag: "+exp1);
				//console.log("exp2 in endDrag: "+exp2);
				//console.log("exp in endDrag: "+exp);
				//console.log("mult: "+self.mult);

				if(initial_mult < 200 && Math.abs(document.querySelector(".app>#container").scrollTop - self.startScrollTopHold) > 10) {
					document.querySelector(".app>#container").scrollBy(0,exp);
					self.absValue+=Math.floor(exp);
					self.mult+=(Math.floor(exp) + 10);
				}

				//console.log("self.absValue down: "+self.absValue);
			}, 5, 300);
		}
		else if(currentY > this.lastY) { // UP
			setTimedInterval(function() {
				var exp1 = -200/Math.abs(self.absValue);
				//var exp2 = Math.log2(exp1);
				var exp = 24*exp1*(Math.abs(self.absValue)/self.mult);

				//console.log("exp1 in endDrag: "+exp1);
				//console.log("exp2 in endDrag: "+exp2);
				//console.log("exp in endDrag: "+exp);
				//console.log("mult: "+self.mult);

				if(initial_mult < 200 && Math.abs(document.querySelector(".app>#container").scrollTop - self.startScrollTopHold) > 10) {
					document.querySelector(".app>#container").scrollBy(0,exp);
					self.absValue+=Math.floor(exp);
					self.mult+=(-1*Math.floor(exp) + 10);
				}

				//console.log("self.absValue up: "+self.absValue);
			}, 5, 300);
		}

		this.lastY = currentY;
	}

	this.dragging = function(event) {
		this.lastY = event.touches[0].pageY;
	}

	this.loadMore = function() {
		var forConsole = document.querySelector(".app>#container");
		this.absValue = forConsole.scrollTop - self.startScrollTopHold;

		console.log("forConsole.scrollTop: "+forConsole.scrollTop);
		console.log("forConsole.clientHeight: "+forConsole.clientHeight);
		console.log("forConsole.scrollHeight: "+forConsole.scrollHeight);
		console.log("equation left: "+(forConsole.scrollTop + forConsole.clientHeight));
		console.log("equation right: "+(forConsole.scrollHeight - window.innerHeight + 64));
		console.log("left should be greater than or equal to right");

		if(this.debounce_timer) {
      window.clearTimeout(this.debounce_timer);
    }

    this.debounce_timer = window.setTimeout(function() {
			(forConsole.scrollTop + forConsole.clientHeight >= forConsole.scrollHeight - window.innerHeight + 64) ? window.pool.populate("adding") : null;
    }, 100);
	}

	this.loadData = async function() { //MAKE SURE TO ONLY PUSH THE ONES THAT ARE BEING ADDED

		window.pool.last_total_rows = window.pool.total_rows;

		var db = firebase.firestore();

		// Disable deprecated features
		db.settings({
		  timestampsInSnapshots: true
		});

		var docsRef = null;

		if(window.pool.data.length == 0) {
			docsRef = db.collection("pools").doc(window.currentPoolId).collection("list").where("active", "==", true).orderBy("date", "desc").limit(8);
		}
		else {
			console.log("window.pool.lastDateIndex: "+window.pool.lastDateIndex);
			docsRef = db.collection("pools").doc(window.currentPoolId).collection("list").where("active", "==", true).orderBy("date", "desc").startAfter(window.pool.lastDateIndex).limit(8);
		}

		var counter = 0;
		var result = await docsRef.get();

		//promise.then(function(querySnapshot) {
		return new Promise(function(resolve, reject) {
			result.forEach(function(doc) {
	        // doc.data() is never undefined for query doc snapshots
	        console.log(doc.id, " => ", doc.data());
	        //if(counter >= window.pool.last_total_boxes) {
	        window.pool.data.push(doc.data());
	        //}

	        console.log("result.size: "+result.size);
	        console.log("self.data.length: "+window.pool.data.length);
	        console.log("index in loadData: "+counter);
	        if(result.size - 1 == counter) {
	        	console.log("returning self data: "+JSON.stringify(window.pool.data));
	        	window.pool.lastDateIndex = doc.data().date;
	        	resolve(window.pool.data);
	        }

	        counter++;
	    });
		})
	}

	/*this.pickAPool = function(event) {

	}*/

	this.getPlace = function() {
		// Initialize Cloud Firestore through Firebase
    // retreive the current place
	  cordova.plugins.GooglePlaces.currentPlace(
	    // place contains the API result
	    place => {
	    	console.log("place:");
	    	console.log(JSON.stringify(place));
	      window.pool.nearestPlace = place.likelihoods[0].place;
	      window.pool.pool_name = window.pool.nearestPlace.name;
	      window.pool.newPool(window.pool.pool_name+"_"+window.pool.myPosition.timestamp);
	      //   {
	      //    place: {
	      //      name: "some place name",
	      //      placeID: "XXXXX"
	      //    },
	      //    likehood: 0.87 // <= means 87% accurate
	      //   }
	    },
	    err => console.log(err)
	  );
	}

	this.startAPool = function(event) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}

	// onSuccess Callback
  // This method accepts a Position object, which contains the
  // current GPS coordinates
  //
  var onSuccess = function(position) {
  		window.pool.myPosition = position;
  		window.pool.getPlace();
  };

  // onError Callback receives a PositionError object
  //
  var onError = function(error) {
      alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
  }

  this.newPool = function(name) {
  	var nameContainer = document.createElement("div");
		nameContainer.style.display = "flex";
		nameContainer.style.flex = "1";
		nameContainer.style.alignItems = "center";
		nameContainer.style.justifyContent = "center";
		nameContainer.style.flexDirection = "column";
		nameContainer.id = "name_container";

		var nameLabel = document.createElement("h3");
		nameLabel.style.display = "flex";
		nameLabel.style.flex = "0";
		nameLabel.style.margin = "0em 0em 0em 0em";
		nameLabel.innerText = "Item";
		nameLabel.style.alignItems = "center";
		nameLabel.id = "name_label";

		var nameInput = document.createElement("input");
		nameInput.type = "text";
		nameInput.size = "50";
		nameInput.style.lineHeight = "2em";
		nameInput.name = "item_name_input_name";
		nameInput.id = "pool_name_input";
		nameInput.value = name;
		nameInput.setAttribute("onchange", "window.pool.inputPoolNameChange(this.value)", false);

		var continueButton = document.createElement("button");
		continueButton.style.borderRadius = "0px";
		continueButton.style.display = "flex";
		continueButton.style.width = "361px";
		continueButton.style.height = "64px";
		continueButton.style.backgroundColor = "orange";
		continueButton.innerHTML = "START A POOL";
		continueButton.style.justifyContent = "center";
		continueButton.style.alignItems = "center";
		continueButton.style.marginTop = "10px";
		continueButton.style.marginLeft = "7px";
		continueButton.style.marginBottom = "10px";
		continueButton.id = "start_a_pool_button";
		continueButton.setAttribute("ontouchstart", "window.pool.continueWithPool(event)", false);

		nameContainer.appendChild(nameLabel);
		nameContainer.appendChild(nameInput);
		nameContainer.appendChild(continueButton);

		document.querySelector(".app>#container").innerHTML = "";
		document.querySelector(".app>#container").appendChild(nameContainer);
  }

  this.continueWithPool = function(event) {
  	//PUT IN CONDITIONAL TO CHECK IF NAME ALREADY EXISTS
  	/*db.collection("pools").doc(window.currentPoolId.toString()).update({"name": window.pool.pool_name})
			.then(function() {
				console.log("Pool named successfully");
				this.populate();
			})
			.catch(function(error) {
				alert("Something wrong in continueWithPool");
			})*/

		console.log('Latitude: '          + window.pool.myPosition.coords.latitude          + '\n' +
	            'Longitude: '         + window.pool.myPosition.coords.longitude         + '\n' +
	            'Altitude: '          + window.pool.myPosition.coords.altitude          + '\n' +
	            'Accuracy: '          + window.pool.myPosition.coords.accuracy          + '\n' +
	            'Altitude Accuracy: ' + window.pool.myPosition.coords.altitudeAccuracy  + '\n' +
	            'Heading: '           + window.pool.myPosition.coords.heading           + '\n' +
	            'Speed: '             + window.pool.myPosition.coords.speed             + '\n' +
	            'Timestamp: '         + window.pool.myPosition.timestamp                + '\n');

		var db = firebase.firestore();

		// Disable deprecated features
		db.settings({
		  timestampsInSnapshots: true
		});

		// Add a new document in collection "cities"
		db.collection("users").doc(window.user.uid.toString()).update({"lastLocation": JSON.parse(JSON.stringify(window.pool.myPosition))})
			.then(function() {
				console.log("Last location added");
				db.collection("users").doc(window.user.uid.toString()).collection("pools").doc(window.pool.myPosition.timestamp.toString()).set({"active": true})
					.then(function() {
						console.log("Pool added to users pools collection successfully");
				    // Add a new document in collection "cities"
						db.collection("pools").doc(window.pool.myPosition.timestamp.toString()).set({"name": window.pool.pool_name+"_"+window.pool.myPosition.timestamp, "nearestTo": window.pool.nearestPlace, "location": JSON.parse(JSON.stringify(window.pool.myPosition))})
							.then(function() {
								console.log("Pool named successfully");
						    db.collection("pools").doc(window.pool.myPosition.timestamp.toString()).collection("users").doc(window.user.uid.toString()).set({"active": true})
									.then(function() {
										var storage = window.localStorage;
										storage.setItem("currentPoolId", window.pool.myPosition.timestamp.toString()) // Pass a key name and its value to add or update that key.
								    window.currentPoolId = window.pool.myPosition.timestamp.toString();
								    console.log("User added to users collection of pool");
								    console.log("MAKE THIS A MESSAGE: There aren't any items being shared in your pool yet, be the first to share for a badge and a bonus!");
									})
									.catch(function(error) {
										console.log("Something wrong in: User added to users collection of pool: "+error);
									})
							})
							.catch(function(error) {
								console.log("Something wrong in: Pool named successfully: "+error);
							})
					})
					.catch(function(error) {
						console.log("Something wrong in: Pool being added to users pools collection: "+error);
					})
			})
			.catch(function(error) {
		    console.error("Error writing document: ", error);
			});
  }

  this.inputPoolNameChange = function(value) {
		window.pool.pool_name = value;
	}

	this.populate = async function(load) { //ASYNC THIS
		if(window.currentPoolId == null) {
			/*var pickAPool = document.createElement("button");
			pickAPool.style.borderRadius = "0px";
			pickAPool.style.display = "flex";
			pickAPool.style.width = "361px";
			pickAPool.style.height = "64px";
			pickAPool.style.backgroundColor = "red";
			pickAPool.innerHTML = "JOIN";
			pickAPool.style.justifyContent = "center";
			pickAPool.style.alignItems = "center";
			pickAPool.style.marginTop = "10px";
			pickAPool.style.marginLeft = "7px";
			pickAPool.id = "pick_a_pool_button";
			pickAPool.setAttribute("ontouchstart", "window.pool.pickAPool(event)", false);*/

			var startAPool = document.createElement("button");
			startAPool.style.borderRadius = "0px";
			startAPool.style.display = "flex";
			startAPool.style.width = "361px";
			startAPool.style.height = "64px";
			startAPool.style.backgroundColor = "orange";
			startAPool.innerHTML = "START A POOL";
			startAPool.style.justifyContent = "center";
			startAPool.style.alignItems = "center";
			startAPool.style.marginTop = "10px";
			startAPool.style.marginLeft = "7px";
			startAPool.style.marginBottom = "10px";
			startAPool.id = "start_a_pool_button";
			startAPool.setAttribute("ontouchstart", "window.pool.startAPool(event)", false);

			//document.querySelector("#pool>#container").appendChild(pickAPool);
			document.querySelector("#pool>#container").appendChild(startAPool);

			window.pool.showPool("copying");
			return;
		}
		else {
			window.pool.last_total_boxes = window.pool.data.length;
			var result = await window.pool.loadData();

			console.log("window.pool.last_total_boxes in populate else: "+window.pool.last_total_boxes);
			console.log("window.pool.result.length in populate else: "+result.length);
			//promise.then(function(datar) {
				//document.querySelector(".app>#container").innerHTML = "";
				if(result.length != 0) {
					//window.pool.last_total_boxes = window.pool.data.length;
					await window.pool.createBoxes(load);
					window.pool.showPool(load);
					return;
				}
				else {
					console.log("MAKE THIS A MESSAGE: There aren't any items being shared in your pool yet, be the first to share for a badge and a bonus!");
					return;
				}
			//})
		}	
	};

	this.showPool = function(load) {
		if(load == "adding") {
			for(var count = this.last_total_rows - 1; count < this.total_rows - 1; count++) {
				console.log("count in showPool: "+count);
				console.log("this.total_rows in showPool: "+this.total_rows);
				console.log("this.last_total_rows in showPool: "+this.last_total_rows);
				document.querySelector(".app>#container").appendChild(document.importNode(document.querySelector("#pool>#container").getElementsByClassName("row")[count], true));
			}
		}
		else if(load == "copying") {
			var targetContainer = document.querySelector(".app");
			targetContainer.innerHTML = "";
	  	targetContainer.appendChild(document.importNode(document.querySelector("#pool>#container"), true));
		}
		else if(load == "initial") {
			var targetContainerInitial = document.querySelector(".app");
			targetContainerInitial.innerHTML = "";
	  	targetContainerInitial.appendChild(document.importNode(document.querySelector("#pool>#container"), false));

	  	for(var coun = this.last_total_rows - 1; coun < this.total_rows - 1; coun++) {
				console.log("count in showPool: "+coun);
				console.log("this.total_rows in showPool: "+this.total_rows);
				console.log("this.last_total_rows in showPool: "+this.last_total_rows);
				document.querySelector(".app>#container").appendChild(document.importNode(document.querySelector("#pool>#container").getElementsByClassName("row")[coun], true));
			}
		}

		//window.pool.last_total_boxes = window.pool.data.length;
	}
}
