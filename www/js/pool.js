function Pool() {
	this.fake_data = [{name: "Hammer", pic: cordova.file.applicationDirectory + "www/assets/images/one.png", available: true}, {name: "Screwdriver", pic: cordova.file.applicationDirectory + "www/assets/images/five.png", available: true},
									 {name: "Iron", pic: cordova.file.applicationDirectory + "www/assets/images/two.png", available: true}, {name: "Pot", pic: cordova.file.applicationDirectory + "www/assets/images/two.png", available: true},
									 {name: "Stapler", pic: cordova.file.applicationDirectory + "www/assets/images/three.png", available: true}, {name: "Frying pan", pic: cordova.file.applicationDirectory + "www/assets/images/four.png", available: true},
									 {name: "Sugar", pic: cordova.file.applicationDirectory + "www/assets/images/four.png", available: true}, {name: "Tape", pic: cordova.file.applicationDirectory + "www/assets/images/one.png", available: true}];

	this.createBoxes = async function(pool) {
		var row_counter = 0;
		for (var i = 1; i < this.fake_data.length + 1; i++) {

			var item_box = document.createElement("div");
			item_box.style.flex = "1 0 50%";
			item_box.style.display = "flex";
			item_box.style.flexDirection = "column";
			item_box.style.justifyContent = "flex-end";
			item_box.style.borderBottom="2px solid #9a9a9a";
			item_box.style.background = "no-repeat center/100% url("+this.fake_data[i - 1].pic+")";
			item_box.id = "item_box_"+i;

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
			item_name.id = "item_name_"+i;
			
			item_box.appendChild(item_name);

			this_row = document.getElementsByClassName("row")[row_counter];
			this_row.appendChild(item_box);

			if(i % 2 == 0 && i != this.fake_data.length) {				
				var inner_row = document.createElement("div");
				inner_row.style.display = "flex";
				inner_row.style.flexDirection = "row";
				inner_row.style.flex = "1 0 200px";
				inner_row.style.backgroundColor = "green";
				inner_row.className = "row";

				pool.appendChild(inner_row);

				row_counter++;
			}
			else if(i == this.fake_data.length) {
				return pool;
			}
		}
	}

	this.populate = function() {
		var pool = document.getElementById("pool");

		var container = document.createElement("div");
		container.style.flex = "1";
		container.style.backgroundColor = "blue";
		container.style.display = "flex";
		container.style.flexDirection = "column";
		container.id = "container";

		var row = document.createElement("div");
		row.style.display = "flex";
		row.style.flexDirection = "row";
		row.style.flex = "1 0 200px";
		row.style.backgroundColor = "green";
		row.className = "row";

		container.appendChild(row);
		pool.appendChild(container);

		this.createBoxes(container).then(function(container) {
			var targetContainer = document.querySelector(".app");
    	targetContainer.appendChild(document.importNode(container, true));
		});
	};
}
