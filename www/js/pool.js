function Pool() {
	this.fake_data = [{name: "Hammer", pic: cordova.file.applicationDirectory + "www/assets/images/one.png", available: true}, {name: "Screwdriver", pic: cordova.file.applicationDirectory + "www/assets/images/five.png", available: true},
									 {name: "Iron", pic: cordova.file.applicationDirectory + "www/assets/images/two.png", available: true}, {name: "Pot", pic: cordova.file.applicationDirectory + "www/assets/images/two.png", available: true},
									 {name: "Stapler", pic: cordova.file.applicationDirectory + "www/assets/images/three.png", available: true}, {name: "Frying pan", pic: cordova.file.applicationDirectory + "www/assets/images/four.png", available: true},
									 {name: "Sugar", pic: cordova.file.applicationDirectory + "www/assets/images/four.png", available: true}, {name: "Tape", pic: cordova.file.applicationDirectory + "www/assets/images/one.png", available: true}];
	this.total_rows = 1;
	this.total_boxes = 0;
	this.debounce_timer = null;
	this.lastY = 0;
	this.interval = null;
	this.dragStartTime = null;
	this.startScrollTopHold = 0;
	this.absValue = 1;
	this.mult = 1;

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
		container.setAttribute("onscroll", "window.pool.loadMore()");

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

				if(initial_mult < 200 && Math.abs(document.querySelector(".app>#container").scrollTop - self.startScrollTopHold) > 15) {
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

				if(initial_mult < 200 && Math.abs(document.querySelector(".app>#container").scrollTop - self.startScrollTopHold) > 15) {
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

		if(this.debounce_timer) {
      window.clearTimeout(this.debounce_timer);
    }

    this.debounce_timer = window.setTimeout(function() {
			(forConsole.scrollTop + forConsole.clientHeight >= forConsole.scrollHeight - window.innerHeight + 64) ? window.pool.createBoxes(true) : null;
    }, 66);
	}

	this.populate = function() {		
		this.createBoxes(false).then(function() {
			var targetContainer = document.querySelector(".app");
			targetContainer.innerHTML = "";
    	targetContainer.appendChild(document.importNode(document.querySelector("#pool>#container"), true));
		});
	};
}
