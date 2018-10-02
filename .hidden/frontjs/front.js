console.log("Scripts loaded");

// Inject UI

//Only gets the url when the id is clicked, (not data)
// because a reload should be triggered anyway for the request itself
function click_call(id, request) {
    $(id).click(function() {
        $.get(request);
        console.log(request);
    });
}

function after_inject() {
    click_call('#next-IV7', '/next');
    click_call('#back-IV7', '/back');
    click_call('#wipe-IV7', '/wipe');
}

function toggle() {
    var signage = $('#emoji-IV7').text();

    if (signage.charAt(0) === "+") {
        $('#collapse-IV7').show();
    } else {
        $('#collapse-IV7').hide();
    }
}

function add_toggle() {
    $('#emoji-IV7').click( function () {
        var signage = $('#emoji-IV7').text();

        var result = "";

        if (signage.charAt(0) === "+") {
            result += "–";
        } else {
            result += '+'
        }

        result += signage.slice(1);

        $('#emoji-IV7').text(result);


        toggle();
    });
}

$(document).ready(function() {
    // Needs to check each script tag because I can't a tag throught the Webpack injector
    $('script').each(function (index, current) {
        if ($(current).attr('src') == 'script.js') {
            if (!$('body').length) {
                $('head').after($(current));
            }

            $.get('./.hidden/html/ui.html', function(data) {
                $(current).before("<!-- This html is injected when serving the page to make the UI -->");
                $(current).before("<!-- You can safely ignore everything past here -->");
                $(data).insertAfter(current);

                after_inject();

                // See colors at https://coolors.co/ffafb6-ffcf98-e1eaff-ffffa2-b2ffa2
                $.get('/on-load', function(onload_data) {
                    // work-around because .css wasn't working for some reason
                    $('#injected-IV7').attr('style','background-color: #'+ onload_data.color);
                    $('#title-IV7').text(onload_data.title);
                    $('#number-IV7').text(onload_data.number);
                    $('#emoji-IV7').text(onload_data.emoji);

                    add_toggle();
                    toggle();
                });
            });
        }
    });
});


