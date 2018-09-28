console.log("Scripts loaded");

// Inject UI

// Needs to check each script tag because I can't a tag throught the Webpack injector
$('script').each(function (index, current) {
   if ($(current).attr('src') == 'script.js') {
       $.get( "./.hidden/public/ui.html", function(data) {
           $(data).insertAfter(current);

           // See colors at https://coolors.co/ffafb6-ffcf98-e1eaff-ffffa2-b2ffa2
           $.get( "/color", function(color_data) {
               $('#injected').css('background-color', color_data.color);
               $('#emoji').text(color_data.emoji);
           })
      });
   }
});
