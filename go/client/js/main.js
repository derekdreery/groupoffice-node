var $ = require('jquery');

var tpls = {
	test: require('../jade/test.jade')
};

$('body').html(tpls.test());
