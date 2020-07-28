class Button
{
	constructor(_params)
	{
		let params = (typeof _params === "object") ? _params : {};

		this.display = document.createElement("div");
		this.hit_area = document.createElement("div");
		
		this.state = { // References for types of states
			current: (typeof params.state != "undefined") ? params.state : null,
			up: "up",
			over: "over",
			focus: "focus",
			active: "active"
		};
		
		this.states = { // The elements/display of the different states
			up: document.createElement("div"),
			over: document.createElement("div"),
			focus: document.createElement("div"),
			active: document.createElement("div")
		};
		let state_styles = "width: 100%; height: 100%; user-select: none;";
		for(let s in this.states)
			this.states[s].setAttribute("style", state_styles);
		
		this.hit_area.setAttribute("style", state_styles);
		
		if(typeof params.states === "object")
		{
			if(typeof params.states.up != "undefined")
				this.add(params.states.up, this.state.up);
			if(typeof params.states.over != "undefined")
				this.add(params.states.over, this.state.over);
			if(typeof params.states.focus != "undefined")
				this.add(params.states.focus, this.state.focus);
			if(typeof params.states.active != "undefined")
				this.add(params.states.active, this.state.active);
		}
		
		this.listeners = []; // Keep track of all of the listeners set on the instance. Does not include listeners set on instantiation 
		console.log(this.states);
		
		this.display.instance = this;
		
		this._width = (typeof params.width === "number") ? params.width : 100;
		this._height = (typeof params.height === "number") ? params.height : 35;
		this._x = (typeof params.x === "number") ? params.x : 0;
		this._y = (typeof params.y === "number") ? params.y : 0;
		this._z = (typeof params.z === "number") ? params.z : 0;
		this._rotation = (typeof params.rotation === "number") ? params.rotation : 0;
		
		this.is_down = false;
		this.in_focus = false;
		this.disabled = false;
		
		this.style = {
			display: "block",
			position: "absolute",
			top: this._y + "px",
			left: this._x + "px",
			width: this._width + "px",
			height: this._height + "px",
			cursor: "pointer",
			"z-index": this._z,
			"user-select": "all"
		};
		
		
		this.display.setAttribute("data-ajs-type", "Button");
		this.display.setAttribute("role", "button");
		
		this.state.current = this.state.up;
		//this.display.appendChild(this.states[this.state.current]); // Show up state by default
		
		this.addEventListener("mousedown", this.mouseDownHandler);
		this.addEventListener("mouseover", this.mouseOverHandler);
		this.addEventListener("mouseout", this.mouseOutHandler);
		this.addEventListener("mouseup", this.mouseUpHandler);
		this.addEventListener("focus", this.focusHandler);
		this.addEventListener("blur", this.unfocusHandler);
		
	//	this.addEventListener("mousedown", function(){ console.log("internal click track"); });
		
		if(this.states.up.children.length === 0)
		{
			this.add("<span style='color: #33c; font-size: 24px;'>Button</span>", this.state.up);
		}
		if(this.states.over.children.length === 0)
		{
			if(typeof Object(params.states).up != "undefined")
				this.states.over = this.states.up.cloneNode(true);
			else
				this.add("<span style='color: #c33; font-size: 24px;'>Button</span>", this.state.over);
		}
		if(this.states.focus.children.length === 0)
		{
			this.states.focus = this.states.over.cloneNode(true);
		}
		if(this.states.active.children.length === 0)
		{
			this.states.active = this.states.over.cloneNode(true);
		}
		
		this.setState(this.state.up);
		
		//this.display.appendChild(this.hit_area);
		
		this.updateStyle();
	}
	updateStyle()
	{
		let a = "", style_str = "";
		for( a in this.style)
			style_str += a + ": " + this.style[a] + "; ";
		this.display.setAttribute("style", style_str);
	}
	addEventListener(ev, f)
	{
		try
		{
			this.display.addEventListener(ev, f);
			this.listeners.push({event: ev, "function": f});
		}catch(e)
		{
			ajs.log("Button : addEventListener : " + e, "warn");
		}
	}
	removeEventListener(ev, f)
	{
		try
		{
			this.display.removeEventListener(ev, f);
		}catch(e)
		{
			ajs.log("Button : removeEventListener : " + e, "warn");
		}
	}
	// Called from this.display
	mouseDownHandler(ev)
	{
		this.instance.is_down = true;
		if((this.instance.state.current != this.instance.state.focus) ||
			(this.instance.state.current != this.instance.state.active))
		{
			this.instance.setState(this.instance.state.active);
		}
	}
	// Called from this.display
	mouseUpHandler(ev)
	{
		if((this.instance.state.current != this.instance.state.over) ||
			(this.instance.state.current != this.instance.state.focus) ||
			(this.instance.state.current != this.instance.state.active))
		{
			this.instance.setState(this.instance.state.up);
		}		
		if(this.instance.is_down)
			this.instance.display.dispatchEvent(new Event("click"));
		
		this.instance.is_down = false;
	}
	// Called from this.display
	mouseOverHandler(ev)
	{
		if((this.instance.state.current != this.instance.state.over) ||
			(this.instance.state.current != this.instance.state.focus) ||
			(this.instance.state.current != this.instance.state.active))
		{
			this.instance.setState(this.instance.state.focus);
		}
	}
	// Called from this.display
	mouseOutHandler(ev)
	{
		//console.log("mouse out", this.instance.state.current, ev);
		if((this.instance.state.current != this.instance.state.focus) ||
			(this.instance.state.current != this.instance.state.active))
		{
			this.instance.setState(this.instance.state.up);
		}
	}
	// Called from this.display
	focusHandler(ev)
	{
		this.instance.in_focus = true;
		if((this.instance.state.current != this.instance.state.focus) ||
			(this.instance.state.current != this.instance.state.active))
		{
			this.instance.setState(this.instance.state.up);
		}
	}
	setState(_state)
	{
		let state = (typeof this.state[_state] != "undefined") ? this.state[_state] : this.state.up;
		switch(state)
		{
			case this.state.up :
				this.empty();
				this.state.current = this.state.up;
				this.display.appendChild(this.states.up);
				break;
			case this.state.down :
				this.empty();
				this.state.current = this.state.down;
				this.display.appendChild(this.states.down);
				break;
			case this.state.focus :
				this.empty();
				this.state.current = this.state.focus;
				this.display.appendChild(this.states.focus);
				break;
			case this.state.active :
				this.empty();
				this.state.current = this.state.active;
				this.display.appendChild(this.states.active);
				break;
		}
	}
	// Called from this.display
	unfocusHandler(ev)
	{
		this.instance.in_focus = false;
		if((!this.instance.state.current != this.instance.state.over) ||
			(!this.instance.state.current != this.instance.state.active))
		{
		//	this.instance.empty();
			this.instance.state.current = this.instance.state.up;
			this.instance.display.appendChild(this.instance.states.up);
		}
	}
	/*
		Added an HTMLElement or HTML string to a target button state. If no state or an invalid state is given the state.up is used by default.
	*/
	add(elm, state)
	{
		try
		{
			let trg = this.states[state] || this.states.up;
			if(elm.display)
				trg.appendChild(elm.display);
			else if(elm instanceof HTMLElement)
				trg.appendChild(elm);
			else if(typeof elm === "string")
				trg.innerHTML = elm;
		}catch(e)
		{
			ajs.log("Button : add : " + e, "warn");
		}
	}
	empty()
	{
		//console.log("empty", this);
		/*
		let a = 0, b = this.display.children.length;
		for( a; a < b; a++)
		{
			let nxt_kid = this.display.childNodes[a];
			if(nxt_kid instanceof HTMLElement)
				this.display.removeChild(nxt_kid);
		}
		*/
		while(this.display.firstChild)
			this.display.removeChild(this.display.firstChild);
	}
	emptyStates()
	{
		while(this.states.up.firstChild)
			this.states.up.removeChild(this.states.up.firstChild);
		
		while(this.states.down.firstChild)
			this.states.over.removeChild(this.states.over.firstChild);
		
		while(this.states.focus.firstChild)
			this.states.focus.removeChild(this.states.focus.firstChild);
		
		while(this.states.active.firstChild)
			this.states.active.removeChild(this.states.active.firstChild);
	}
}
export { Button };