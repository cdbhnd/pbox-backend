# pbox-backend

## Install typescript and typings globally  
`npm install typescript -g`  

`npm install typings -g` 

## Clone the repo
Navigate to your preferred projects folder  
`cd my_projects_folder`  

Clone the repo  
`https://github.com/cdbhnd/pbox-backend.git`  
  
## Install dependencies  

Navigate to the repo and run npm install  
`cd pbox-backend`  

`npm install`  

Run typings  
`typings install`

## Run gulp  
`gulp`  

## Install nodemon

Nodemon will restart app when dist/ files are changed, super handy for development

`npm install -g nodemon`

then run (from project root):
`nodemon dist/index.js`

Since nodemon will restart on every file changed in dist folder, number of restarts can get big. To solve the issue, e.g. to delay the restart from the moment that first file change is detected, start the nodemon like so:

`nodemon --delay 1000ms dist/index.js`

Number of miliseconds should be fine-tuned to the speed of gulp build on your system. Maybe somewhere down the road we can automate this restart with gulp?.