## Why is a dist folder important?
[app-dashboard](https://github.com/y2kfund/app-dashboard) in its [package.json](https://github.com/y2kfund/app-dashboard/blob/main/package.json) when it references [app-summary]( https://github.com/y2kfund/app-dashboard/blob/a8d4e8a70e4d367e8a47bf6ed209cf6f3765bca8/package.json#L22) the code is picked up from [dist](https://github.com/y2kfund/app-summary/tree/main/dist) folder.

## How to create a new dist folder?
```
> npm run build:lib
this will change the dist folder 
if you run > npm run build then it will give an error with entrypoint
> git commit
```
## where to get the supabase key for .env file?
1. go to the dashbaord for the supabase app
2. in top menu click on connect
3. then click on app frameworks
