describe('MCounters', function() {
	it('should export the MCounter module.', function() {
		expect(MCounters).to.be.an('object');
	});

	it('show getNextSequence is a function', function() {
		expect(MCounters.getNextSequence).to.be.a('function');
	});

	describe('getNextSequence - Client', function() {
		if (Meteor.isClient) {
			it('should get the seq no. 1 when first call', function(done) {
				Meteor.apply('MCounters.methodGetNextSequence', ['myCollection'], function(err, result) {
					expect(result).equal(1);

					done();
				});
			});

			it('should get the seq no. 2 when second call', function(done) {
				Meteor.apply('MCounters.methodGetNextSequence', ['myCollection'], function(err, result) {
					expect(result).equal(2);

					done();
				});
			});
		}
	});

	describe('getNextSequence - Server', function() {
		if (Meteor.isServer) {
			it('should get the seq no. 1 when first call', function(done) {
				var seq = Meteor.call('MCounters.methodGetNextSequence', 'myCollection');

				expect(seq).equal(1);

				done();
			});

			it('should get the seq no. 2 when second call', function(done) {
				var seq = Meteor.call('MCounters.methodGetNextSequence', 'myCollection');

				expect(seq).equal(2);

				done();
			});

			// tear down
			Meteor.Counters.remove({});
		}
	});

	it('show setSequence is a function', function() {
		expect(MCounters.setSequence).to.be.a('function');
	});

	describe('setSequence - Client', function() {
		if (Meteor.isClient) {
			it('should set the seq no. 100 and get back 100', function(done) {
				Meteor.apply('MCounters.methodSetSequence', ['myCollection', 100], function(err, result) {
					expect(result).equal(100);

					done();
				});
			});
		}
	});

	describe('setSequence - Server', function() {
		if (Meteor.isServer) {
			it('should set the seq no. 100 and get back 100', function(done) {
				var seq = Meteor.call('MCounters.methodSetSequence', 'myCollection', 100);

				expect(seq).equal(100);

				done();
			});
		}
	});
});