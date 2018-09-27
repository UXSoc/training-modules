console.log("Scripts loaded");

// Inject UI

// Needs to check each script tag because I can't a tag throught the Webpack injector
$('script').each(function () {
   if ($(this).attr('src') == 'script.js') {
       $( "<p>Test</p>" ).insertAfter(this);
   }
});