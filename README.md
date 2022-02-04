# woa-front
The front-end of the website TourDO, made using Next.js and MUI.


## starting

### production
You need to first build the frontend using 
```
npm run build
```
Then you can start the server using 
```
npm run start
```
The front-end server will listen on port 3000.

### dev
Use this command while developing (reloads the page when you make modifications)
```
npm run dev 
```


## env variable

BACKEND_URL : url to access the backend

## api

The bodies sent to and recieved from the api is using snake_case naming to keep compatiblity with the database


## possible improvements

-   use Skeleton when loading
-   improve tournament preview
-   handle newlines in description
