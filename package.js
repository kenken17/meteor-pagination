Package.describe({
	name: 'kenken:meteor-pagination',
	summary: 'A naive way to implement pagination just to reduce boiler plate code.',
	version: '1.2.2',
	git: 'https://github.com/kenken17/meteor-pagination'
});

Package.onUse(function(api) {
	api.versionsFrom('1.0');

	// Meteor dependencies
	api.use('templating');
	api.use('underscore');
	api.use('reactive-var');

	api.addFiles('client/pagination_client.js', 'client');
	api.addFiles('client/pagination_control.html', 'client');
	//api.addFiles('client/pagination_control.js', 'client');

	if (api.export) {
		api.export('MPagination');
	}
});

Package.onTest(function(api) {
	api.use(['mike:mocha-package@0.5.6', "practicalmeteor:chai"]);
	api.use('kenken:meteor-pagination');

	api.addFiles('tests/pagination-tests.js', ['server', 'client']);
});
