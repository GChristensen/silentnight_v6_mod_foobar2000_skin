// ==PREPROCESSOR==
// @name "UI Hacks automation demo"
// @version "1.0"
// ==/PREPROCESSOR==

// --- UIHacks BEGIN

MainMenuState = {
    Show: 0,
    Hide: 1,
    Auto: 2
}

CaptionStyle = {
    Normal: 0,
    Small: 1,
    Hidden: 2
}

MoveStyle = {
    Default: 0,
    Middle: 1,
    Left: 2,
    Both: 3
}

AeroEffect = {
    Default: 0,
    Disabled: 1,
    GlassFrame: 2,
    SheetOfGlass: 3
}

UIHacks = new ActiveXObject("UIHacks");

$buttons = {
    FullScreen: new SimpleButton(5, 5, 100, 26, "FullScreen", function () {
        UIHacks.FullScreen=!UIHacks.FullScreen;
    }),
    StatusBarState: new SimpleButton(5, 40, 100, 26, "StatusBarState", function () {
        UIHacks.StatusBarState=!UIHacks.StatusBarState;
    }),
    HideMainMenu: new SimpleButton(5, 75, 100, 26, "HideMainMenu", function () {
        UIHacks.MainMenuState=MainMenuState.Hide;
    }),
    ShowMainMenu: new SimpleButton(115, 75, 100, 26, "ShowMainMenu", function () {
        UIHacks.MainMenuState=MainMenuState.Show;
    }),
    AutoMainMenu: new SimpleButton(225, 75, 100, 26, "AutoMainMenu", function () {
        UIHacks.MainMenuState=MainMenuState.Auto;
    }),
    NormalCaption: new SimpleButton(5, 110, 100, 26, "NormalCaption", function () {
        UIHacks.CaptionStyle=CaptionStyle.Normal;
        UIHacks.MoveStyle=MoveStyle.Default;
    }),
    SmallCaption: new SimpleButton(115, 110, 100, 26, "SmallCaption", function () {
        UIHacks.CaptionStyle=CaptionStyle.Small;
        UIHacks.MoveStyle=MoveStyle.Default;
    }),
    HiddenCaption: new SimpleButton(225, 110, 100, 26, "HiddenCaption", function () {
        UIHacks.CaptionStyle=CaptionStyle.Hidden;
        UIHacks.MoveStyle=MoveStyle.Both;
    }),
    DisableSizing: new SimpleButton(5, 145, 100, 26, "DisableSizing", function () {
        UIHacks.DisableSizing=!UIHacks.DisableSizing;
    }),
    BlockMaximize: new SimpleButton(5, 180, 100, 26, "BlockMaximize", function () {
        UIHacks.BlockMaximize=!UIHacks.BlockMaximize;
    }),
    EnableMinSize: new SimpleButton(5, 215, 100, 26, "EnableMinSize", function () {
        UIHacks.MinSize.Width=800;
        UIHacks.MinSize.Height=600;
        UIHacks.MinSize=true;
    }),
    DisableMinSize: new SimpleButton(115, 215, 100, 26, "DisableMinSize", function () {
        UIHacks.MinSize=false;
    }),
    EnableMaxSize: new SimpleButton(5, 250, 100, 26, "EnableMaxSize", function () {
        UIHacks.MaxSize.Width=1200;
        UIHacks.MaxSize.Height=800;
        UIHacks.MaxSize=true;
    }),
    DisableMaxSize: new SimpleButton(115, 250, 100, 26, "DisableMaxSize", function () {
        UIHacks.MaxSize=false;
    }),
    
    Default: new SimpleButton(5, 285, 100, 26, "Default", function () {
        UIHacks.Aero.Effect=AeroEffect.Default;
    }),
    GlassFrame: new SimpleButton(115, 285, 100, 26, "GlassFrame", function () {
        UIHacks.Aero.Left=25;
        UIHacks.Aero.Right=35;
        UIHacks.Aero.Top=45;
        UIHacks.Aero.Bottom=55;
        UIHacks.Aero.Effect=AeroEffect.GlassFrame;
    }),
    SheetOfGlass: new SimpleButton(225, 285, 100, 26, "SheetOfGlass", function () {
        UIHacks.Aero.Effect=AeroEffect.SheetOfGlass;
    }),
    Transparency: new SimpleButton(335, 285, 100, 26, "Transparency", function () {
        UIHacks.Aero.Transparency=!UIHacks.Aero.Transparency;
    })
}

// --- UIHacks END

function RGBA(r, g, b, a) {
    return ((a << 24) | (r << 16) | (g << 8) | (b));
}

function RGB(r, g, b) {
    return (0xff000000 | (r << 16) | (g << 8) | (b));
}

var DT_TOP = 0x00000000;
var DT_CENTER = 0x00000001;
var DT_VCENTER = 0x00000004;
var DT_WORDBREAK = 0x00000010;
var DT_CALCRECT = 0x00000400;
var DT_NOPREFIX = 0x00000800;

var g_font = gdi.Font("Tahoma", 12);

function SimpleButton(x, y, w, h, text, fonClick) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.fonClick = fonClick;
    
    this.containXY = function (x, y) {
        return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
    }
    
    this.draw = function (gr) {
        gr.FillGradRect( this.x, this.y, this.w, this.h, 90, RGBA(151, 180, 202, 128), RGBA(0, 0, 0, 128));
        gr.GdiDrawText(this.text, g_font, RGB(0,0,0), this.x, this.y, this.w, this.h, DT_CENTER| DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);
    }

    this.onClick = function () {
        this.fonClick && this.fonClick();
    }
}

function drawAllButtons(gr) {
    for (var i in $buttons) {
        $buttons[i].draw(gr);
    }
}

function chooseButton(x, y) {
    for (var i in $buttons) {
        if ($buttons[i].containXY(x, y)) return $buttons[i];
    }

    return null;
}

var cur_btn = null;

// --- APPLICATION START

function on_paint(gr) {
    drawAllButtons(gr);
}

function on_mouse_lbtn_down(x, y) {
    cur_btn = chooseButton(x, y);
}

function on_mouse_lbtn_up(x, y) {
    if (cur_btn && cur_btn == chooseButton(x, y)) {
        cur_btn.onClick();
    }
}

// --- APPLICATION END
