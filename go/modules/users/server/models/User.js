/*
 * 
 */
var mongoose = require('mongoose');
var Future = require('fibers/future');

var userSchema = mongoose.Schema({
	username: String,
	password: String
});

// model-level methods
// ===================
userSchema.methods.sayHello = function() {
	return 'Hello ' + this.username;
};

// collection-level methods
// ========================
userSchema.statics.login = function(username, password) {
	Future.wrap(this.find)({username: username, password:password}, cb);
};

module.exports = mongoose.model('User', userSchema);