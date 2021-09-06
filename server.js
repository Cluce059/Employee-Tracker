const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

//express middleware
app.use(express.urlencoded({ extened: false}));
app.use(express.json());

//use api routes
app.use('/api', apiRoutes);

////default: handles unsupported user reqs must be below other req routes
app.use((req, res) => {
    res.status(404).end();
});

//start server after DB connection is established
db.connect(err => {
  if(err) throw err;
  console.log('Database connected');
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});