/*
	

*/
class MovieClip
{
	constructor(_params)
	{
		let params = (typeof _params === "object") ? _params : {};
		this.display = null;
		this.frame = 0;
		this.frames = [];
		this.current_frame = 1;
		this.is_running = true;
		this.repeat = true;
		this._width = (typeof params.width === "number") ? params.width : 100;
		this._height = (typeof params.height === "number") ? params.height : 100;
		this._x = (typeof params.x === "number") ? params.x : 0;
		this._y = (typeof params.y === "number") ? params.y : 0;
		this._z = (typeof params.z === "number") ? params.z : 0;
		this._rotation = (typeof params.rotation === "number") ? params.rotation : 0;
		this.hit_area = {
			x: (typeof Object(params.hit_area).x != "undefined") ? params.hit_area.x : 0,
			y: (typeof Object(params.hit_area).y != "undefined") ? params.hit_area.y : 0,
			width: (typeof Object(params.hit_area).width != "undefined") ? params.hit_area.width : this._width,
			height: (typeof Object(params.hit_area).height != "undefined") ? params.hit_area.height : this._height
		};
		this.registration_point = {x: 0, y: 0}; // Where to orient this on the stage
		this.auto_scale = true; // When content is added automatically adjust the this.width and this.height
		this.display = document.createElement("div");
		this.events = document.createElement("events");
		
		this.style = {
			display: "block",
			position: "absolute",
			top: this._y + "px",
			left: this._x + "px",
			width: this._width + "px",
			height: this._height + "px",
			"z-index": this._z,
			"user-select": "none"
		};	
		
		//this.onEnterFrame = null;
		//this.goTo(this.current_frame);
	
		this.display.setAttribute("data-ajs-type", "MovieClip");
		this.display.instance = this;
		this.updateStyle();
		//console.log(window.stage);
		//if(this.parentNode.getAttribute("data-ajs-type") == "Stage")
		//	this.display.addEventListener(ajs.event.ENTER_FRAME, this.enterFrame);
	
	}
	enterFrame()
	{
		if(this.is_running)
		{
			let nxt_frame = this.current_frame + 1;
			if((typeof this.frames[nxt_frame] === "undefined") && (this.repeat))
				this.goTo(1);
			else if(typeof this.frames[nxt_frame] != "undefined")
				this.goTo(++this.current_frame);
		}
		this.display.dispatchEvent(ajs.event.enterFrame);
	}
	addFrame(f)
	{
		let frame = (f instanceof Frame) ? f : new Frame({index: (this.frames.length + 1)});
		if(frame.index === null)
			frame.index = this.frames.length + 1;
		this.frames.push(frame);
	}
	goTo(fidx, act)
	{
		let frame;
		if(typeof fidx === "string")
			frame = this.frames.find((f) => f.label === fidx);
		else if(typeof fidx === "number")
			frame = this.frames[Number(fidx - 1)];
		if(!(frame instanceof Frame))
		{
			ajs.log("MovieClip : goTo : Could not find frame [" + fidx + "]", "warn");
			return false;
		}
		this.empty();
		this.display.appendChild(frame.display);
		if(this.auto_scale)
		{
			var bcr = this.display.getBoundingClientRect();
			this._width = bcr.width;
			this.style.width = this._width + "px";
			this._height = bcr.height;
			this.style.height = this._height + "px";
			this.updateStyle();
		}
		this.current_frame = frame.index;
		if(String(act).toLowerCase() == "stop")
			this.is_running = false;
		else if(String(act).toLowerCase() == "play")
			this.is_running = true;
		else if(typeof act != "undefined")
			ajs.log("MovieClip : goTo : Unsupported parameter for act [" + act + "]", "warn");
	}
	empty()
	{
		while(this.display.firstChild)
			this.display.removeChild(this.display.firstChild);
	}
	updateStyle()
	{
		let a = "", style_str = "";
		for( a in this.style)
			style_str += a + ": " + this.style[a] + "; ";
		this.display.setAttribute("style", style_str);
	}
	set x(_x)
	{
		if(typeof _x != "number")
		{
			ajs.log("MovieClip : SET x() requires a number. Invalid value [" + _x + "] found.", "warn");
			return false;
		}
		this._x = _x;
		this.style.left = this._x + "px";
		this.updateStyle();
	}
	get x()
	{
		return this._x;
	}
	set y(_y)
	{
		if(typeof _y != "number")
		{
			ajs.log("MovieClip : SET y() requires a number. Invalid value [" + _y + "] found.", "warn");
			return false;
		}
		this._y = _y;
		this.style.top = this._y + "px";
		this.updateStyle();
	}
	get y()
	{
		return this._y;
	}
	set width(_w)
	{
		if(typeof _w != "number")
		{
			ajs.log("MovieClip : SET width() requires a number. Invalid value [" + _w + "] found.", "warn");
			return false;
		}
		this._width = _w;
		this.style.width = this._width + "px";
		this.updateStyle();
	}
	get width()
	{
		return this._width;
	}
	set height(_h)
	{
		if(typeof _h != "number")
		{
			ajs.log("MovieClip : SET height() requires a number. Invalid value [" + _h + "] found.", "warn");
			return false;
		}
		this._height = _h;
		this.style.height = this._height + "px";
		this.updateStyle();
	}
	get height()
	{
		return this._height;
	}
	addEventListener(ev, f)
	{
		try
		{
			this.display.addEventListener(ev, f);
		}catch(e)
		{
			ajs.log("MovieClip : addEventListener : " + e, "warn");
		}
	}
	removeEventListener(ev, f)
	{
		try
		{
			this.display.removeEventListener(ev, f);
		}catch(e)
		{
			ajs.log("MovieClip : removeEventListener : " + e, "warn");
		}
	}
}
class Frame
{
	constructor(_data)
	{
		let data = (typeof _data === "object") ? _data : {};
		this.index = (typeof data.index === "number") ? data.index : null;
		this.label = (typeof data.label === "string") ? data.label : "";
		this.display = document.createElement("div");
		this.display.setAttribute("data-ajs-type", "Frame");
		this.display.instance = this;
	}
	add(elm)
	{
		try
		{
			if(elm.display)
				this.display.appendChild(elm.display);
			if(elm instanceof HTMLElement)
				this.display.appendChild(elm);		
		}catch(e)
		{
			ajs.log("Frame : add : " + e, "warn");
		}
	}
}
export { MovieClip, Frame };