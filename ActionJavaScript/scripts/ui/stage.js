/*
	Public Class Stage
	Description : A Stage is the primary class for displaying asj objects and controls the frame rate of all objects.
	@parent <string | HTMLElement> : The HTMLElement the will contain the Stage.display. If a string it should match the id of an element in the document body.
	@frame_rate <number> : The number of frames per second that will display.
	@id <string> : The id of the Stage object. It will also set the id of the Stage.display.
*/
class Stage
{
	constructor(_params)
	{
		let params = (typeof _params === "undefined") ? {} : _params;
		this.id = null;
		this.width = (typeof params.width === "number") ? params.width : 1000;
		this.height = (typeof params.height === "number") ? params.height : 600;
		this.color = (typeof params.color === "string") ? params.color : "#fff";
		this.display = null;
		this.events = null;
		this.parent = null;
		this.frame_rate = 60;
		this.frame_interval = null;
		this.current_frame = 0;
		this.frames_played = 0;
		this.elements = [];
		this.style = {
			display: "block",
			position: "relative",
			"background": this.color,
			width: this.width + "px",
			height: this.height + "px",
			overflow: "hidden"
		};
		if(!(this.display instanceof HTMLElement))
			this.display = document.createElement("div");
		if(!(this.events instanceof HTMLElement))
			this.events = document.createElement("events");
		if(typeof params.frame_rate === "number")
			this.frame_rate = params.frame_rate;
		if(typeof params.parent === "string")
			this.parent = document.getElementById(params.parent);
		else if(params.parent instanceof HTMLElement)
			this.parent = params.parent;
		if(typeof params.id === "string")
			this.id = params.id;
		else
			this.id = "ajs_stage_" + Object(new Date()).getMilliseconds();
		
		console.log(this.parent);
		
		this.display.setAttribute("id", this.id);
		this.display.setAttribute("data-ajs-type", "Stage");
		this.display.instance = this;
		let a = "", style_str = "";
		for( a in this.style)
		{
			style_str += a+": "+this.style[a] + "; ";
		}
		console.log(style_str);
		this.display.setAttribute("style", style_str);
		
		if(this.parent != null)
			this.parent.appendChild(this.display);
		this.fps = this.frame_rate;
		
	}
	set fps(fr)
	{
		if(typeof fr != "number")
		{
			ajs.log("Stage : frame_rate : Incorrect data type [" + fr + "]", "warn");
			return false;
		}
		this.frame_rate = fr;
		this.frame_interval = setInterval((function(self)
		{
			return function()
			{
				self.display.dispatchEvent(ajs.event.enterFrame);
				self.current_frame++;
				self.frames_played++;
				let a = 0, b = self.elements.length;
				for( a; a < b; a++)
				{
					let elm = self.elements[a];
					if(!elm)
						continue;
					if(typeof elm.enterFrame === "function")
						self.elements[a].enterFrame();
				}
			};
		}(this)), (1000 / this.frame_rate));
	}
	add(_elm)
	{
		try
		{
			let elm;
			if(_elm.display)
				elm = _elm.display;
			if(_elm instanceof HTMLElement)
				elm = _elm;
			this.elements.push(_elm);
			this.display.appendChild(elm);
		}catch(e)
		{
			ajs.log("Stage : add : Cannot add [" + _elm +"]. " + e, "warn");
		}
	}
	remove(_elm)
	{
		try
		{
			let elm;
			if(_elm.display)
				elm = _elm.display;
			if(_elm instanceof HTMLElement)
				elm = _elm;
			let elm_idx = this.elements.indexOf(_elm);
			if(elm_idx > -1)
				this.elements.splice(elm_idx, 1);
			this.display.removeChild(elm);
		}catch(e)
		{
			ajs.log("Stage : add : Cannot remove [" + _elm +"]. " + e, "warn");
		}
	}
	empty()
	{
		
	}
	destroy()
	{
		try
		{
			this.elements = [];
			this.current_frame = 0;
			this.frames_played = 0;
			while(this.display.firstChild)
				this.display.removeChild(this.display.firstChild);
			this.parent.removeChild(this.display);
		}catch(e)
		{
			ajs.log("Stage : destroy : " + e, "warn");
		}		
	}
	addEventListener(ev, f)
	{
		try
		{
			this.display.addEventListener(ev, f);
		}catch(e)
		{
			ajs.log("Stage : addEventListener : " + e, "warn");
		}
	}
	removeEventListener(ev)
	{
		try
		{
			this.display.removeEventListener(ev);
		}catch(e)
		{
			ajs.log("Stage : removeEventListener : " + e, "warn");
		}
	}
}
export { Stage };