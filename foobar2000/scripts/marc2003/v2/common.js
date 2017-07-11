DT_TOP = 0x00000000;
DT_LEFT = 0x00000000;
DT_CENTER = 0x00000001;
DT_RIGHT = 0x00000002;
DT_VCENTER = 0x00000004;
DT_BOTTOM = 0x00000008;
DT_WORDBREAK = 0x00000010;
DT_CALCRECT = 0x00000400;
DT_NOPREFIX = 0x00000800;
DT_END_ELLIPSIS = 0x00008000;

MF_SEPARATOR = 0x00000800;
MF_ENABLED = 0x00000000;
MF_GRAYED = 0x00000001;
MF_DISABLED = 0x00000002;
MF_UNCHECKED = 0x00000000;
MF_CHECKED = 0x00000008;
MF_STRING = 0x00000000;
MF_POPUP = 0x00000010;

IDC_ARROW = 32512;
IDC_IBEAM = 32513;
IDC_WAIT = 32514;
IDC_CROSS = 32515;
IDC_UPARROW = 32516;
IDC_SIZE = 32640;
IDC_ICON = 32641;
IDC_SIZENWSE = 32642;
IDC_SIZENESW = 32643;
IDC_SIZEWE = 32644;
IDC_SIZENS = 32645;
IDC_SIZEALL = 32646;
IDC_NO = 32648;
IDC_APPSTARTING = 32650;
IDC_HAND = 32649;

ColorTypeCUI = {
	text: 0,
	selection_text: 1,
	inactive_selection_text: 2,
	background: 3,
	selection_background: 4,
	inactive_selection_background: 5,
	active_item_frame: 6
};

FontTypeCUI = {
	items: 0,
	labels: 1
};

ColorTypeDUI = {
	text: 0,
	background: 1,
	highlight: 2,
	selection: 3
};

FontTypeDUI = {
	defaults: 0,
	tabs: 1,
	lists: 2,
	playlists: 3,
	statusbar: 4,
	console: 5
};

StringAlignment = {
	Near: 0,
	Center: 1,
	Far: 2
};

StringTrimming = {
	None: 0,
	Character: 1,
	Word: 2,
	EllipsisCharacter: 3,
	EllipsisWord: 4,
	EllipsisPath: 5
};

function StringFormat(h_align, v_align, trim, flag) {
	return ((h_align << 28) | (v_align << 24) | (trim << 20) | flag);
}

function RGB(r,g,b) {
	return (0xff000000|(r<<16)|(g<<8)|(b)); 
}

function RGBA(r, g, b, a) {
	return ((a << 24) | (r << 16) | (g << 8) | (b));
}

function get_font() {
	if(dui) {
		g_font = window.GetFontDUI(FontTypeDUI.defaults);
	} else {
		g_font = window.GetFontCUI(FontTypeCUI.items);
	}
}

function get_colors() {
	if (dui) {
		g_textcolor = window.GetColorDUI(ColorTypeDUI.text);
		g_textcolor_hl = window.GetColorDUI(ColorTypeDUI.highlight);
		g_backcolor = window.GetColorDUI(ColorTypeDUI.background);
	} else {
		g_textcolor = window.GetColorCUI(ColorTypeCUI.text);
		g_textcolor_hl = window.GetColorCUI(ColorTypeCUI.text);
		g_backcolor = window.GetColorCUI(ColorTypeCUI.background);
	}
}

function on_playlist_switch() {
	on_item_focus_change();
}

function on_colors_changed() {
	get_colors();
	window.Repaint();
}

function on_font_changed() {
	get_font();
	window.Repaint();
}

function on_item_focus_change() {
	if (g_metadb) window.UnwatchMetadb();
	g_metadb = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
	if (g_metadb) {
		try { on_metadb_changed(); } catch(e) {}
		window.WatchMetadb(g_metadb);
	}
}

function text_input_box(title, message, filename) {
	WshShell.Run("\"" + wsf + "\" \"" + title + "\" \"" + message + "\" \"" + filename + "\"", 0, true);
	return read(filename);
}

function read(fn) {
	try {
		var f = fso.OpenTextFile(fn, 1, false, -1);
		var s = f.Readline();
		f.Close()
		return s;
	} catch(e) {
		return '';
	}
}

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function lastfm(qs, user_agent, func) {
	xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	xmlhttp.open("GET", "http://ws.audioscrobbler.com/2.0/?api_key=" + api_key + "&username=" + username + qs + "&s=" + Math.random(), true);
	xmlhttp.setRequestHeader('User-Agent',user_agent);
	xmlhttp.send();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				func();
			} else {
				fb.trace(xmlhttp.responsetext);
			}
		}
	}
}

function decodeXML(value) {
	value = value.replace(/<\/?[^>]+(>|$)/g, "");
	doc = new ActiveXObject("htmlfile");
	doc.open();
	div = doc.createElement("div");
	div.innerHTML = value.replace(/\n/g, "<br>");
	value = div.innerHTML;
	value = value.replace(/<BR>/g,"\n");
	value = value.replace(/&gt;/g,">");
	value = value.replace(/&lt;/g,"<");
	value = value.replace(/&nbsp;/g," ");
	return value.replace(/&amp;/g,"&");
}

function save_xml_file() {
	xmlDoc = xmlhttp.responsetext;
	try {
		ts = fso.OpenTextFile(filename, 2, true, -1);
		ts.WriteLine(xmlDoc);
		ts.close();
	} catch(e) {
	}
	load();
}

function buttons_menu(x,y) {
	var _menu = window.CreatePopupMenu();
	var _child = window.CreatePopupMenu();
	var idx;
	_child.AppendMenuItem(MF_STRING, 101, "None");
	_child.AppendMenuItem(MF_STRING, 102, (dui ? "Default UI " : "Columns UI ") + "default");
	_child.AppendMenuItem(MF_STRING, 103, "Splitter");
	_child.AppendMenuItem(MF_STRING, 104, "Custom ");
	_child.AppendMenuItem(MF_SEPARATOR, 0, 0);
	_child.AppendMenuItem(window.GetProperty("mode") == 104 ? MF_STRING : MF_GRAYED, 105, "Set custom colour...");
	_child.CheckMenuRadioItem(101, 104, window.GetProperty("mode", 101));
	_menu.AppendMenuItem(MF_STRING | MF_POPUP, _child.ID, "Background");
	_menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
	if(utils.IsKeyPressed(0x10)) _menu.AppendMenuItem(MF_STRING, 9, "Properties");
	_menu.AppendMenuItem(MF_STRING, 10, "Configure...");
	idx = _menu.TrackPopupMenu(x, y);
	switch(idx) {
		case 101:
		case 102:
		case 103:
		case 104:
			window.SetProperty("mode", idx);
			window.Repaint();
			break;
		case 105:
			custom_background = text_input_box("Prompt:", "Enter a custom colour for the background. Uses RGB. Example usage:\n\n234-211-74", custom_background_file);
			window.Repaint();
			break;
		case 9:
			window.ShowProperties();
			break;
		case 10:
			window.ShowConfigure();
			break;
	}
	_menu.Dispose();
	_child.Dispose();
}

function buttons_background(gr) {
	switch(window.GetProperty("mode", 102)) {
		case 101:
			col = null;
			break;
		case 102:
			col = g_backcolor;
			break;
		case 103:
			col = utils.GetSysColor(15);
			break;
		case 104:
			temp_col = custom_background.split("-");
			col = RGB(temp_col[0], temp_col[1], temp_col[2]);
			break;
	}
	if(col) gr.FillSolidRect(0, 0, ww, wh, col);
}

function tf(value) {
	value = value.replace(/'/g, "''");
	value = value.replace(/,/g, "','");
	value = value.replace(/\//g, "'/'");
	value = value.replace(/\(/g, "'('");
	value = value.replace(/\)/g, "')'");
	value = value.replace(/\[/g, "'['");
	return (value.replace(/\]/g, "']'"));
}

function read_images() {
	folders = folder.split("|");
	files = new Array();
	for(i = 0; i < folders.length; i++) {
		if(fso.FolderExists(folders[i])) files = files.concat(utils.Glob(folders[i] + "\\*.jpg").toArray(),utils.Glob(folders[i] + "\\*.png").toArray(),utils.Glob(folders[i] + "\\*.gif").toArray());
	}
	return(files);
}

function bl() {
	blacklist_file = folder + "\\blacklist.txt";
	blacklist = read(blacklist_file);
	if(window.GetProperty("bl") == false) return;
	blacklist_array = blacklist.split("|");
	for(i in blacklist_array) {
		if(fso.FileExists(blacklist_array[i])) try { fso.DeleteFile(blacklist_array[i]); } catch(e) {}
	}
}

function download_images() {
	working = true;
	window.Repaint();
	WshShell.Run("\"" + script_path + "art.exe\" \""  + artist + "\" \"" + folder + "\" " + limit, 0, true);
	bl();
	arr = read_images();
	index = 0;
	offset = 0;
	working = false;
	load_image();
}

function scale(gr, img, pos_x, pos_y, width, height, mth) {
	var s = mth == "max" ? Math.max(width / img.width, height / img.height) : Math.min(width / img.width, height / img.height);
	var nw = Math.round(img.width * s);
	var nh = Math.round(img.height * s);
	pos_x += Math.round((width - nw) / 2);
	pos_y += Math.round((height - nh) / 2);
	gr.DrawImage(img, pos_x, pos_y, nw, nh, 0, 0, img.width, img.height);
}

function scale2(gr, img, pos_x, pos_y, width, height, sq) {
	if(sq) {
		var wider = img.width > img.height ? true : false;
		var iw = wider ? img.height : img.width;
		var ih = wider ? img.height : img.width;
		var ix = wider ? Math.round((img.width - img.height) / 2) : 0;
		var iy = wider ? 0 : Math.round((img.height - img.width) / 2);
		var nw = width;
		var nh = height;
		gr.DrawImage(img, pos_x, pos_y, nw, nh, ix, iy, iw, ih);
	} else {
		var s = Math.min(width / img.width, height / img.height);
		var nw = Math.round(img.width * s);
		var nh = Math.round(img.height * s);
		pos_x += Math.round((width - nw) / 2);
		pos_y += Math.round((height - nh) / 2);
		gr.DrawImage(img, pos_x, pos_y, nw, nh, 0, 0, img.width, img.height);
	}
	gr.DrawRect(pos_x - 3, pos_y - 3, nw + 5, nh + 5, 1, RGB(137, 140, 149));
}

String.prototype.count=function(s1) { 
	return (this.length - this.replace(new RegExp(s1,"g"), '').length) / s1.length;
}

var ww = wh = 0;
var g_metadb = fb.GetFocusItem();
var dui = window.InstanceType;
var WshShell = new ActiveXObject("WScript.Shell");
var fso = new ActiveXObject("Scripting.FileSystemObject");
var script_path = fb.FoobarPath + "scripts\\marc2003\\v2\\";
var wsf = script_path + "input.wsf";
var images_path = script_path + "images\\";
var settings_path = fb.ProfilePath + "wsh_settings\\";
var font = WshShell.RegRead("HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\ProductName") == "Microsoft Windows XP" ? "Tahoma" : "Segoe UI";
if(!fso.FolderExists(settings_path)) fso.CreateFolder(settings_path);
var data_folder = fb.ProfilePath + "wsh_lastfm\\";
if(!fso.FolderExists(data_folder)) fso.CreateFolder(data_folder);
get_font();
get_colors();