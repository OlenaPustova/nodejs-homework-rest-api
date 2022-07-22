const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const contactsRouter = require('./routers/contactsRouter');
const { errorHandler } = require('./middlewares/catchErrors');
const { authRouter } = require('./routers/authRouter');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/contacts', contactsRouter);
app.use('/api/users', authRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

module.exports = app;
