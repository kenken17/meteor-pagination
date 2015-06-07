MPagination = function MPagination(options) {
	var opts = {
			templateName: '',
			templateInstance: this,
			perPageCount: 50,
			currentPage: 1,
			resultCount: 0,
			sort: {},
			query: {}
		};

	// extend with the new options
	_.extend(opts, options);

	if (!opts.templateName) throw new Error('Missing option: templateName');
	if (!opts.templateInstance) throw new Error('Missing option: templateInstance');

	var template = Template[opts.templateName],
		templateInstance = opts.templateInstance;

	templateInstance.perPageCount = new ReactiveVar(opts.perPageCount);
	templateInstance.currentPage = new ReactiveVar(opts.currentPage);
	templateInstance.resultCount = new ReactiveVar(opts.resultCount);
	templateInstance.sort = new ReactiveVar(opts.sort);
	templateInstance.query = new ReactiveVar(opts.query);

	template.events({
		'click .prev a': function(e) {
			e.preventDefault();

			var currentPage = templateInstance.currentPage.get();

			currentPage--;

			if (currentPage >= 1) {
				templateInstance.currentPage.set(currentPage);
			}
		},

		'click .next a': function(e) {
			e.preventDefault();

			var currentPage = templateInstance.currentPage.get(),
				perPageCount = templateInstance.perPageCount.get(),
				resultCount = templateInstance.resultCount.get(),
				pagesCount = Math.ceil(resultCount / perPageCount);

			currentPage++;

			if (currentPage <= pagesCount) {
				templateInstance.currentPage.set(currentPage);
			}
		},

		'click .page a': function(e, tpl) {
			e.preventDefault();

			templateInstance.currentPage.set(this.pageNumber);
		}
	});

	template.helpers({
		'isPrevDisabled': function() {
			return templateInstance.currentPage.get() === 1 ? 'disabled' : '';
		},

		'isNextDisabled': function() {
			var perPageCount = templateInstance.perPageCount.get(),
				resultCount = templateInstance.resultCount.get(),
				pagesCount = Math.ceil(resultCount / perPageCount);

			return templateInstance.currentPage.get() >= pagesCount ? 'disabled' : '';
		},

		'isActive': function() {
			return templateInstance.currentPage.get() === this.pageNumber ? 'active' : '';
		},

		'searchResultCount': function() {
			var count = templateInstance.resultCount.get();

			return templateInstance.resultCount.get() + (count === 1 ? ' item' : ' items');
		},

		'pages': function() {
			var perPageCount = templateInstance.perPageCount.get(),
				resultCount = templateInstance.resultCount.get(),
				pagesCount = Math.ceil(resultCount / perPageCount),
				pagesArray = [];

			for (var x = 1; x <= pagesCount; x++) {
				pagesArray.push({
					pageNumber: x
				});
			}

			return pagesArray;
		}
	});
};