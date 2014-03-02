var groupoffice = require('./app.js'),
    app = groupoffice();

app.listen(process.env.port || 3002);

