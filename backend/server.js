const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const app = express();

db.connect();
db.open();

app.use(cors());
app.use(express.json());

app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
