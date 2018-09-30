# Welcome To Where the **Magic** Happens

This directory contains all the files needed to make everything happen behind the scenes including:
- Module data
- UI data
- Front and back end javascript
- Helping scripts

## Commands

- `npm run new [folder name]` create a new module
- `npm run delete [module number]` delete a module, this is by number
-  `npm run mods` print out all modules
- `npm run reset` resets the config file which is useful for testing

## Layout

The main runner is *webpack.config.js* in the root folder, it runs the dev server.

- */config.js* basically the database
- */backjs* contains *interact.js* which runs custom server code for webpack, and *helper.js* which runs the npm commands
- */frontjs* which only has *front.js*, that is used to inject the UI into the *index.html* being server
- */html* which has *home.html*, the homepage which is loaded by default, and *ui.html* which is injected into the module
- */public* has files dumped into it when testing

### */modules*

Contains *index.html*, *save.html*, and *template.json* to be used as templates for a new module

Also has all the individual modules in their respective folders.
