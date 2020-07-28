class TextField
{
	constructor(_params)
	{
		let params = (typeof _params === "object") ? _params : {};
		this._width = (typeof params.width === "number") ? params.width : 100;
		this._height = (typeof params.height === "number") ? params.height : 30;
		this._x = (typeof params.x === "number") ? params.x : 0;
		this._y = (typeof params.y === "number") ? params.y : 0;
		this._z = (typeof params.z === "number") ? params.z : 0;
		this._rotation = (typeof params.rotation === "number") ? params.rotation : 0;
		
		this.style = {
			display: "block",
			position: "absolute",
			top: this._y + "px",
			left: this._x + "px",
			width: this._width + "px",
			height: this._height + "px",
			"z-index": this._z,
			border: (typeof params.border === "string") ? params.border : "none",
			background: (typeof params.background === "string") ? params.background : "none"
		};
		this.field_style = {
			display: "block",
			position: "absolute",
			width: this._width + "px",
			height: this._height + "px",
			"z-index": this._z,
			"font-size": (typeof params["font-size"] != "undefined") ? params["font-size"] + "px" : "16px",
			"font-weight": (typeof params["font-weight"] != "undefined") ? params["font-weight"] : "400",
			"font-family": (typeof params["font-family"] != "undefined") ? params["font-family"] : "Arial, sans-serif",
			color: (typeof params.color != "undefined") ? params.color : "#000",
			"line-height": (typeof params["font-size"] != "undefined") ? params["font-size"] + "px" : "16px",
			"text-align": (typeof params["text-align"] != "undefined") ? params["text-align"] : "left",
			border: "none",
			background: "none",
			"user-select": "none"
		};
		
		this.display = document.createElement("div");
		//this.field = document.createElement("input");
		this.field = document.createElement("span");
		
		this.display.setAttribute("data-ajs-type", "TextField");
	//	this.field.setAttribute("type", "text");
		this.field.setAttribute("readonly", "readonly");
		if(typeof params.text != "undefined") 
			this.text = params.text;

		this.updateStyle();

		this.display.appendChild(this.field);
	}
	updateStyle()
	{
		try
		{
			let a = "", style_str = "";
			for( a in this.style)
				style_str += a + ": " + this.style[a] + "; ";
			let b = "", fstyle_str = "";
			for( b in this.field_style)
				fstyle_str += b + ": " + this.field_style[b] + "; ";
			this.display.setAttribute("style", style_str);
			this.field.setAttribute("style", fstyle_str);
		}catch(e)
		{
			ajs.log("TextField : updateStyle : " + e, "warn");
		}
	}
	set text(t)
	{
		try
		{
			//this.field.value = t;
			this.field.innerHTML = t;
		}catch(e)
		{
			ajs.log("TextField : SET text(t). Could not set text as [" + t + "]. " + e, "warn");
		}
	}
	get text()
	{
		//return this.field.value;
		return this.field.innerHTML;
	}
}
export { TextField }