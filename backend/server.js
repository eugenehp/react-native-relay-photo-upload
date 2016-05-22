var express = require('express');
var graphqlHttp = require('express-graphql');
var schema = require('./schema/schema');

import multer           from 'multer'

// The server is just a simple Express app
var app = express()

// const storage = multer.memoryStorage();
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/')
  },
  filename: function (req, file, cb) {
    // file
    /*{ 
      fieldname: 'file',
      originalname: 'photo.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg' 
    }*/
    var ext = file.mimetype.split('/')[1];
    cb(null, file.fieldname + '-' + Date.now() + '.' + ext)
  }
})

app.use('/graphql', multer({ storage: storage }).single('file'));

app.use('/graphql', graphqlHttp(request => ({
  schema: schema,
  formatError: (error) => {
    console.log('formatError',error);
    return error;
  },
  context: {
    rootValue: { request: request  }
  },
  graphiql: true,
  pretty: true,
})));


var PORT = process.env.PORT || 8080;
app.listen(PORT, function() { console.log('Listening on '+PORT+'...') })
