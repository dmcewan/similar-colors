
// Fucking global
var keyTimeout = undefined;
var similarId = undefined;


function getBackgroundHexColor(selector) {
    var rgb = selector.css("background-color");
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function newColors() {
    var color1 = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    var color2 = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    $("#color1").css("background-color", color1).css("color", color1);
    $("#color2").css("background-color", color2).css("color", color2);
}

function yes() {
    var url = "/yes?" + "color1=" + getBackgroundHexColor($("#color1")) + "&color2=" + getBackgroundHexColor($("#color2")) + "&similarId=" + similarId;
    $.ajax({
        url: url,
        cache: false
    });
}

function no() {
    var url = "/no?" + "color1=" + getBackgroundHexColor($("#color1")) + "&color2=" + getBackgroundHexColor($("#color2")) + "&similarId=" + similarId;
    $.ajax({
        url: url,
        cache: false
    });
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}



// TODO: Execute callback
function upOrDown(selector, callback) {
    if (keyTimeout != undefined) {
        clearTimeout(keyTimeout);
        keyTimeout = undefined;
        $(".buttons span").removeClass("hovered");
    }
    selector.toggleClass("hovered");
    keyTimeout = setTimeout(function() {
        newColors();
        if (callback) {
	        callback();
        }
        selector.toggleClass("hovered");
        keyTimeout = undefined;
    }, 500);
}
$(function() {
    // On page load get two new colors
    newColors();

    // Session info
    similarId = getCookie('similarId');
    if (!similarId) {
        similarId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        console.log("New id = " + similarId);
        document.cookie = "similarId=" + similarId;
    } else {
        console.log(similarId);
    }

    // On button click get two new colors
    $("#yes span").click(function() {
        yes();
        newColors();
    });
    $("#no span").click(function() {
        no();
        newColors();
    });

	var defaultHelp = "You can use the up arrow for Yes, and the down arrow for No";
	$("#help").text(defaultHelp);
    // Change header text on hover
    $("#yes span").hover(function() {
            $("#help").text("Yes, these colors are Similar.");
        },
        function() {
            $("#help").text(defaultHelp);
        });
    $("#no span").hover(function() {
            $("#help").text("No, these colors are significantly different.");
        },
        function() {
            $("#help").text(defaultHelp);
        });

    $(document).keydown(function(e) {
        e.preventDefault();
        console.log(e.keyCode);
        if (e.keyCode == 38) {
            upOrDown($("#yes span"), yes);
        } else if (e.keyCode == 40) {
            upOrDown($("#no span"), no);
        }

    });



});