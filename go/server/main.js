var groupoffice = require('./app.js'),
    app = groupoffice({debug: true});

app.listen(process.env.port || 3002);

