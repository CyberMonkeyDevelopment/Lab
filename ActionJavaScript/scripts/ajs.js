if(window.ajs)
	throw new Error("An instance of ajs is already defined. Check your file imports and make sure ajs.js is only imported one time.");
window.ajs = 
{
	log_verbosity: 4, // Determins what types of messages will be writte to console by WFA.Charts.log.
	log: function(_msg, _type)
	{
		let types = [
			"none", // 0
			"error", // 1
			"warn", // 2
			"error-warn", // 3
			"all" // 4
		];
		let type = (typeof _type === "string") ? types.indexOf(_type.toLowerCase()) : types.length-1;
		let msg = (Array.isArray(_msg)) ? _msg.join("\n") : String(_msg);
		if(ajs.log_verbosity >= type)
		{
			switch(type)
			{
				case 1:
					throw new Error("ajs :: " + msg);
				case 2:
				case 3:
					if(console.warn)
						console.warn("ajs :: " + msg);
					else
						console.log("ajs :: " + msg);
					return true;
				case 4:
					console.log("ajs :: " + msg);
					return true;
			}
		}
	},
	event:
	{
		ENTER_FRAME: "enterFrame",
		enterFrame: new CustomEvent("enterFrame", {bubbles: false, cancelable: true}),
		HIT: "hit",
		hit: new CustomEvent("hit", {bubbles: false, cancelable: true}),
		LOADED: "loaded",
		loaded: new Event("loaded", {bubbles: false, cancelable: false}),
		LOADING: "loading",
		loading: new Event("loading", {bubbles: false, cancelable: false})
	},
	hitTest: function(obj1, obj2)
	{
		let bcr1, bcr2;
		if(obj1.display)
			bcr1 = obj1.display.getBoundingClientRect();
		else if(obj1 instanceof HTMLElment)
			bcr1 = obj1.getBoundingClientRect();
		if(obj2.display)
			bcr2 = obj2.display.getBoundingClientRect();
		else if(obj2 instanceof HTMLElment)
			bcr2 = obj2.getBoundingClientRect();
		if(obj1.hit_area)
		{
			bcr1.x += obj1.hit_area.x;
			bcr1.y += obj1.hit_area.y;
			bcr1.width = obj1.hit_area.width;
			bcr1.height = obj1.hit_area.height;
		}
		if(obj2.hit_area)
		{
			bcr2.x += obj2.hit_area.x;
			bcr2.y += obj2.hit_area.y;
			bcr2.width = obj2.hit_area.width;
			bcr2.height = obj2.hit_area.height;
		}
		let x_range1 = {
			min: bcr1.x,
			max: bcr1.x + bcr1.width
		}
		let y_range1 = {
			min: bcr1.y,
			max: bcr1.y + bcr1.height
		}
		let x_range2 = {
			min: bcr2.x,
			max: bcr2.x + bcr2.width
		}
		let y_range2 = {
			min: bcr2.y,
			max: bcr2.y + bcr2.height
		}
		/*
		if((x_range1.max > x_range2.min) && (x_range1.min < x_range2.max) && (y_range1.max > y_range2.min) && (y_range1.min < y_range2.max)) // obj1 is top left to obj2
			console.log("A - obj1 is top left to obj2");
		if((x_range1.max > x_range2.min) && (x_range1.min < x_range2.max) && (y_range1.max > y_range2.min) && (y_range1.min < y_range2.max)) // obj1 is top right to obj2
			console.log("B - obj1 is top right to obj2");
		if((x_range1.min > x_range2.min) && (x_range1.min < x_range2.max) && (y_range1.min > y_range2.min) && (y_range1.min < y_range2.max)) // obj1 is bottom right to obj2
			console.log("C - obj1 is bottom right to obj2");
		if((x_range1.max > x_range2.min) && (x_range1.min < x_range2.max) && (y_range1.min > y_range2.min) && (y_range1.min < y_range2.max)) // obj1 is bottom left to obj2
			console.log("D - obj1 is bottom left to obj2");
		*/
		if(((x_range1.max > x_range2.min) && (x_range1.min < x_range2.max) && (y_range1.max > y_range2.min) && (y_range1.min < y_range2.max)) || // obj1 is top left to obj2
			((x_range1.max > x_range2.min) && (x_range1.min < x_range2.max) && (y_range1.max > y_range2.min) && (y_range1.min < y_range2.max)) || // obj1 is top right to obj2
			((x_range1.min > x_range2.min) && (x_range1.min < x_range2.max) && (y_range1.min > y_range2.min) && (y_range1.min < y_range2.max)) || // obj1 is bottom right to obj2
			((x_range1.max > x_range2.min) && (x_range1.min < x_range2.max) && (y_range1.min > y_range2.min) && (y_range1.min < y_range2.max))) // || // obj1 is bottom left to obj2
		{
			
			if(obj1.display)
				obj1.display.dispatchEvent(ajs.event.hit);
			if(obj2.display)
				obj2.display.dispatchEvent(ajs.event.hit);
			return true;
		}
		return false;
	}
};
export default ajs;