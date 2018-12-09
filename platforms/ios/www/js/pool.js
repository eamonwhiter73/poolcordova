function Pool() {
	this.fake_data = [{name: "Hammer", pic: cordova.file.applicationDirectory + "www/assets/images/one.png", available: true}, {name: "Screwdriver", pic: cordova.file.applicationDirectory + "www/assets/images/five.png", available: true},
									 {name: "Iron", pic: cordova.file.applicationDirectory + "www/assets/images/two.png", available: true}, {name: "Pot", pic: cordova.file.applicationDirectory + "www/assets/images/two.png", available: true},
									 {name: "Stapler", pic: cordova.file.applicationDirectory + "www/assets/images/three.png", available: true}, {name: "Frying pan", pic: cordova.file.applicationDirectory + "www/assets/images/four.png", available: true},
									 {name: "Sugar", pic: cordova.file.applicationDirectory + "www/assets/images/four.png", available: true}, {name: "Tape", pic: cordova.file.applicationDirectory + "www/assets/images/one.png", available: true}];
	
	this.total_rows = 1;
	this.total_boxes = 0;
	this.debounce_timer = null;
	this.lastY = 0;
	this.lastScroll = 0;
	this.interval = null;
	this.startDragScrollTop = 0;
	this.lastScrollTop = 0;
	this.isScrolling = false;
	this.setTimeout = null;
	this.intervalEnded = true;
	this.dragStartTime = null;

	this.initialize = async function() { //MAKE ASYNC!!!!!!!!!!!!!!!!!!!
		var pool = document.getElementById("pool");

		console.log("pool retreived from template");

		var container = document.createElement("div");
		container.style.height = (window.innerHeight - 64)+"px";
		container.style.backgroundColor = "blue";
		container.style.display = "flex";
		container.style.flexDirection = "column";
		container.style.overflow = "auto";
		container.id = "container";
		container.setAttribute("ontouchmove", "window.pool.dragging(event)");
		container.setAttribute("ontouchend", "window.pool.endDrag(event)");
		container.setAttribute("ontouchstart", "window.pool.startDrag(event)");
		container.setAttribute("ontouchcancel", "window.pool.handleCancel(event)");
		container.setAttribute("onscroll", "window.pool.loadMore(event)");

		console.log("pool container created");

		var row = document.createElement("div");
		row.style.display = "flex";
		row.style.flexDirection = "row";
		row.style.flex = "1 0 200px";
		row.style.backgroundColor = "green";
		row.className = "row";
		row.id = "row_0";

		console.log("pool row added");

		container.appendChild(row);
		pool.appendChild(container);

		console.log("pool container added");
		return;
	}

	this.createBoxes = async function(load) {
		//var row_counter = 0;
		var pool_var = null;
		if(load) {
			pool_var = document.querySelector(".app>#container");
		}
		else {
			pool_var = document.querySelector("#pool>#container");
		}

		for (var i = 1; (i * this.total_rows) < (9 * this.total_rows); i++) {

			var item_box = document.createElement("div");
			item_box.style.flex = "1 0 50%";
			item_box.style.display = "flex";
			item_box.style.flexDirection = "column";
			item_box.style.justifyContent = "flex-end";
			item_box.style.borderBottom="2px solid #9a9a9a";
			item_box.style.background = "no-repeat center/100% url("+this.fake_data[i - 1].pic+")";
			item_box.id = "item_box_"+this.total_boxes;

			var colors = ["#e0e0e0", "#bfbfbf"];

			var item_name = document.createElement("h3");
			item_name.style.display = "flex";
			item_name.style.flex = "0.11 0";
			item_name.style.width = "100%";
			item_name.style.backgroundColor = (i % 2 == 0 ? colors[0] : colors[1]);
			item_name.style.justifyContent = "center";
			item_name.style.alignItems = "center";
			item_name.style.margin = "0em 0em 0em 0em";
			item_name.innerText = this.fake_data[i - 1].name;
			item_name.id = "item_name_"+this.total_boxes;
			
			item_box.appendChild(item_name);

			//console.log("this_total_rows before getting this_row: "+this.total_rows);

			pool_var.getElementsByClassName("row")[this.total_rows - 1].appendChild(item_box);
			//console.dir(pool_var.getElementsByClassName("row")[this.total_rows - 1]);

			this.total_boxes++;
			//console.log("total_boxes: "+this.total_boxes);

			//console.log("i: "+i);

			if(i % 2 == 0) {				
				var inner_row = document.createElement("div");
				inner_row.style.display = "flex";
				inner_row.style.flexDirection = "row";
				inner_row.style.flex = "1 0 200px";
				inner_row.style.backgroundColor = "green";
				inner_row.className = "row";
				inner_row.id = "row_"+this.total_rows

				pool_var.appendChild(inner_row);

				//row_counter++;
				this.total_rows++;
				//console.log("this_total_rows: "+this.total_rows);
			}
			else if(i == 8) {
				//console.log("entered ending else if");
				return;
			}
		}
	}

	this.handleCancel = function(event) {
	  evt.preventDefault();
	  console.log("touchcancel");
	  var touches = evt.changedTouches;
	  
	  for (var i = 0; i < touches.length; i++) {
	    var idx = ongoingTouchIndexById(touches[i].identifier);
	    ongoingTouches.splice(idx, 1);  // remove it; we're done
	  }
	}

	var setTimedInterval = function(callback, delay, timeout){
		window.clearInterval(this.interval);
		//this.intervalEnded = false;
    this.interval=window.setInterval(callback, delay);
    window.setTimeout(function(){
    		console.log("this.interval at start: "+this.interval);
        window.clearInterval(this.interval);
        //this.intervalEnded = true;
    }, timeout);
	}

	this.startDrag = function(event) {
		//this.isScrolling = true;
		console.log("scrollTop in startDrag: "+document.querySelector(".app>#container").scrollTop);
		//console.log("startDrag event:");
		//console.log(event);
		//clearInterval(this.interval);
		this.lastY = event.pageY;
		this.startDragScrollTop = document.querySelector(".app>#container").scrollTop;
		this.dragStartTime = new Date().getTime();
	}

	this.endDrag = function(event) {
		//console.log("endDrag event:");
		//console.dir(event);
		//console.log("this.interval in endDrag: "+this.interval);
		
		/*if(!this.intervalEnded) {
			return;
		}*/
		var mult = new Date().getTime() - this.dragStartTime;
		console.log("mult: "+mult);

		//this.timeout = setTimeout(function() {
		console.log("scrollTop in endDrag: "+document.querySelector(".app>#container").scrollTop);

		let currentY = event.pageY;

		if(document.querySelector(".app>#container").scrollTop > 0 && currentY < this.lastY) { // DOWN
			console.log("DOWN");
			console.log("starting scroll top in endDrag: "+document.querySelector(".app>#container").scrollTop);
			setTimedInterval(function() {
				document.querySelector(".app>#container").scrollBy(0,10*(200/mult));
				console.log("scrolls until: "+document.querySelector(".app>#container").scrollTop);
			}, 5, 300);
		}
		else if(currentY > this.lastY) { // UP
			console.log("UP");
			setTimedInterval(function() {
				document.querySelector(".app>#container").scrollBy(0,-10*(200/mult));
			}, 5, 300);
		}

		this.lastY = currentY;
		this.lastScrollTop = document.querySelector(".app>#container").scrollTop;
		//}, 301);
	}

	this.dragging = function(event) {
		//console.log("dragingEvent:");
		//console.dir(event);

		//clearInterval(this.interval);
		let currentY = event.touches[0].pageY;
		/*if(currentY < this.lastY) { // DOWN
			//document.querySelector(".app>#container").scrollBy(0,10);
		}
		else if(currentY > this.lastY) { // UP
			//document.querySelector(".app>#container").scrollBy(0,-10);
		}*/
		this.lastY = currentY;
	}

	this.loadMore = function(event) {
		let currentScroll = window.scroll();

		if(this.lastScroll == currentScroll) {
			this.isScrolling = false;
		}

		this.lastScroll = currentScroll;

		if(this.debounce_timer) {
      window.clearTimeout(this.debounce_timer);
    }

    this.debounce_timer = window.setTimeout(function() {
      // run your actual function here
      var forConsole = document.querySelector(".app>#container");
			//console.log("scrollTop: " + forConsole.scrollTop + " clientHeight: " + forConsole.clientHeight + " scrollHeight: " + forConsole.scrollHeight);
			(forConsole.scrollTop + forConsole.clientHeight >= forConsole.scrollHeight - window.innerHeight + 64) ? window.pool.createBoxes(true) : null;
    }, 66); //MAYBE THIS IS HAPPENI
	}

	this.populate = function() {		
		this.createBoxes(false).then(function() {
			var targetContainer = document.querySelector(".app");
			targetContainer.innerHTML = "";
    	targetContainer.appendChild(document.importNode(document.querySelector("#pool>#container"), true));
		});
	};
}
