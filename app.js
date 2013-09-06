/**
 * App Dependencies.
 */

require('strong-agent').profile();

var control = require('strong-cluster-control');
var options = control.loadOptions();

// If configured as a cluster master, just start controller
if (options.clustered && options.isMaster) {
  return control.start(options);
}

var loopback = require('loopback')
  , app = module.exports = loopback()
  , fs = require('fs')
  , path = require('path')
  , request = require('request')
  , TaskEmitter = require('strong-task-emitter');

// Set up the HTTP port
app.set('port', process.env.PORT || 3000);

// Expose a rest api
app.use(loopback.rest());

// Add static files
app.use(loopback.static(path.join(__dirname, 'public')));

// Require models
fs
  .readdirSync(path.join(__dirname, './models'))
  .filter(function(m) {
    return path.extname(m) === '.js';
  })
  .forEach(function(m) {
    // expose model over rest
    app.model(require('./models/' + m));
  });

// Enable docs
app.docs({basePath: 'http://127.0.0.1:' + app.get('port')});

// Start the server
app.listen(app.get('port'), function() {
  console.log('StrongLoop Suite sample is now ready at http://127.0.0.1:' + app.get('port'));
});
