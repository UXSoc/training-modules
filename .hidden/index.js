console.log("Scripts loaded");

// Inject UI

// Needs to check each script tag because I can't a tag throught the Webpack injector
$('script').each(function (index, current) {
   if ($(current).attr('src') == 'script.js') {
       $.get( "./.hidden/public/ui.html", function(data) {
           $(data).insertAfter(current);

           // See colors at https://coolors.co/fcdde0-d7e3eb-f1ffeb-dcfff1-fbdaff
           $('#injected').css('background-color', 'red');
       });
   }
});

