const mongoose = require('mongoose');

mongoose.set('strictQuery', true);  // Add this line before connection

//wrap Mongoose around local connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/userThoughtDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
  autoIndex: true,     // Build indexes
  maxPoolSize: 10,     // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000,  // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000,          // Close sockets after 45 seconds of inactivity
})
.then(() => console.log('Successfully connected to MongoDB.'))
.catch(err => console.error('Connection error:', err));

//export the connection
module.exports = mongoose.connection;
