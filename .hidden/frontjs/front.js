console.log("Scripts loaded");

// Inject UI

//Only gets the url when the id is clicked, (not data)
// because a reload should be triggered anyway for the request itself
function click_call(id, request) {
    $(id).click(function() {
        $.get(request);
    });
}

function after_inject() {
    click_call('#next', '/next');
    click_call('#back', '/back');
    click_call('#wipe', '/wipe');
    
    $.get('/current', function (data) {

    });
}

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
               $('#injected').attr('style','background-color: #'+ onload_data.color);
               $('#emoji').text(onload_data.emoji);
           });
      });
   }
});
