class BitMap
{
	constructor(uri, _params)
	{
		let params = (typeof _params === "object") ? _params : {};
		
		this.loaded = false;
		
		this.display = new Image();
		this.display.src = uri;
		this.display.instance = this;
		
		this._width = (typeof params.width === "number") ? params.width : "auto";
		this._height = (typeof params.height === "number") ? params.height : "auto";
		this._x = (typeof params.x === "number") ? params.x : 0;
		this._y = (typeof params.y === "number") ? params.y : 0;
		this._z = (typeof params.z === "number") ? params.z : 0;
		this._rotation = (typeof params.rotation === "number") ? params.rotation : 0;
		
		this.style = {
			display: "block",
			position: "absolute",
			top: this._y + "px",
			left: this._x + "px",
			width: (this._width != "auto") ? this._width + "px" : this._width,
			height: (this._height != "auto") ? this._height + "px" : this._height,
			"z-index": this._z,
			"user-select": "none"
		}
		
		
		this.display.setAttribute("data-ajs-type", "BitMap");
		
		this.updateStyle();

	}
	updateStyle()
	{
		let a = "", style_str = "";
		for( a in this.style)
			style_str += a + ": " + this.style[a] + "; ";
		this.display.setAttribute("style", style_str);
	}
}
export { BitMap };