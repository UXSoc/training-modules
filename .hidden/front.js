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
        console.log(data);
    });
}

// Needs to check each script tag because I can't a tag throught the Webpack injector
$('script').each(function (index, current) {
   if ($(current).attr('src') == 'script.js') {
       $.get('./.hidden/ui.html', function(data) {
           $(current).before("<!-- This html is injected when serving the page to make the UI -->");
           $(current).before("<!-- You can safely ignore everything past here -->");
           $(data).insertAfter(current);

           after_inject();

           // See colors at https://coolors.co/ffafb6-ffcf98-e1eaff-ffffa2-b2ffa2
           $.get('/on-load', function(color_data) {
               $('#injected').css('background-color', color_data.color);
               $('#emoji').text(color_data.emoji);
           });
      });
   }
   console.log("waa");
});
