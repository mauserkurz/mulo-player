const app = require('express')();
const serveStatic = require('serve-static');

const PORT = process.env.PORT || 5000;
const distFiles = serveStatic(`${__dirname}/dist`);

app.use('/', distFiles);
app.use('/*', distFiles);
app.listen(PORT);

console.log(`server started ${PORT}`);
