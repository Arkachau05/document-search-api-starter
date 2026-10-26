const app = require('./app');
const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Document Search API listening on port ${port}`));
