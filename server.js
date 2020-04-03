const app = require('express')();
const serveStatic = require('serve-static');
const PORT = process.env.PORT || 5000;

app.use(serveStatic(__dirname + "/dist"));
app.listen(PORT);

console.log('server started '+ PORT);
