mkdir nodeApiOIA
npm init
npm i express

npm i nodemon


npm i mongoose
npm i dotenv

to use nodemon put these in scripts
    "dev": "nodemon api/index.js",
    "start": "node api/index.js",
    "build": "npm install && npm install --prefix client && npm run build --prefix client"


npm i bcryptjs
npm i jsonwebtoken

```log
MongooseError: The `uri` parameter to `openUri()` must be a string, got "undefined". Make sure the first parameter to `mongoose.connect()` or `mongoose.createConnection()` is a string.
```
Solved:    moved .env to root of the project directory, since undefined so it's not finding the file itself

