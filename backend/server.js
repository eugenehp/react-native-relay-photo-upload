var express = require('express')
var graphqlHttp = require('express-graphql')
var schema = require('./schema/schema')

// The server is just a simple Express app
var app = express()

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
