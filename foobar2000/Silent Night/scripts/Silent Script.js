// Global Button Script
// Code by T.P Wang and tedGo

var ButtonStates = {normal: 0, hover: 1, down: 2, hide: 3};
var Buttons = {};
var g_down = false;

// ----- CREATE BUTTON OBJECT --------------------------------------
var g_tooltip;

function Button(x, y, w, h, img_src, func, tiptext) {
	this.left = x;
	this.top = y;
	this.w = w;
	this.h = h;
	this.right = x + w;
	this.bottom = y + h;
	this.func = func;
	this.tiptext = tiptext;
	this.state = ButtonStates.normal;
	this.img_normal = img_src && img_src.normal ? gdi.Image(img_src.normal) : null;
	this.img_hover = img_src && img_src.hover ? gdi.Image(img_src.hover) : this.img_normal;
	this.img_down = img_src && img_src.down ? gdi.Image(img_src.down) : this.img_hover;
	this.img = this.img_normal;

	this.alterImage = function(img_src) {
		this.img_normal = img_src && img_src.normal ? gdi.Image(img_src.normal) : null;
		this.img_hover = img_src && img_src.hover ? gdi.Image(img_src.hover) : this.img_normal;
		this.img_down = img_src && img_src.down ? gdi.Image(img_src.down) : this.img_hover;
		this.changeState(this.state);
	}

	this.traceMouse = function(x, y) {
		if (this.state == ButtonStates.hide) return false;

		var b = (this.left < x) && (x < this.right) && (this.top < y) && (y < this.bottom);

		if (b)
			g_down ? this.changeState(ButtonStates.down) : this.changeState(ButtonStates.hover);
		else
			this.changeState(ButtonStates.normal);
		return b;
	}

	this.changeState = function(newstate) {
		newstate != this.state && window.RepaintRect(this.left, this.top, this.w, this.h);
		this.state = newstate;
		switch (this.state) {
			case ButtonStates.normal:
				this.img = this.img_normal;
				break;

			case ButtonStates.hover:
				this.img = this.img_hover;
				break;

			case ButtonStates.down:
				this.img = this.img_down;
				break;

			default:
				this.img = null;
		}
	}

	this.changePos = function(x, y, w, h) {
		this.left = x;
		this.top = y;
		this.w = w;
		this.h = h;
		this.right = x + w;
		this.bottom = y + h;
	}

	this.draw = function(gr) {
		this.img && gr.DrawImage(this.img, this.left, this.top, this.w, this.h, 0, 0, this.w, this.h);
	}

	this.repaint = function() {
		window.RepaintRect(this.left, this.top, this.w, this.h);
	}

	this.onClick = function() {
		this.func && this.func();
	}

	this.onMouseIn = function() {
		g_tooltip = window.CreateTooltip();
		g_tooltip.Text = this.tiptext;
		g_tooltip.Activate();
	}

	this.onMouseOut = function() {
		g_tooltip.Deactivate();
		g_tooltip.Dispose();
	}
}

function buttonsDraw(gr) {
	for (var i in Buttons) {
		Buttons[i].draw(gr);
	}
}

function buttonsTraceMouse(x, y) {
	var btn = null;
	for (var i in Buttons) {
		if (Buttons[i].traceMouse(x, y) && !btn)
			btn = Buttons[i];
	}
	return btn;
}

// ----- MOUSE ACTIONS ---------------------------------------------
var cur_btn = null;
var btn_down;

function on_mouse_move(x, y) {
	var btn = buttonsTraceMouse(x, y);

	if (btn != cur_btn) {
		cur_btn && cur_btn.onMouseOut();
		btn && btn.onMouseIn();
	}

	cur_btn = btn;
}

function on_mouse_lbtn_down(x, y) {
	g_down = true;
	(btn_down = cur_btn) && cur_btn.changeState(ButtonStates.down);
}

function on_mouse_lbtn_up(x, y) {
	if (cur_btn) {
		cur_btn.changeState(ButtonStates.hover);
		btn_down == cur_btn && cur_btn.onClick(x, y);
	}

	g_down = false;
}

function on_mouse_leave() {
	cur_btn && cur_btn.changeState(ButtonStates.normal);
}