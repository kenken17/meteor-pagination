MPagination = function MPagination(options) {
	var opts = {
			templateName: '',
			templateInstance: undefined,
			perPageCount: 50,
			currentPage: 1,
			resultCount: 0,
			sort: {},
			query: {},
			onBeforeClicks: undefined,
			onBeforePreviousClicks: undefined,
			onBeforeNextClicks: undefined,
			onBeforePageClicks: undefined
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

	Template.MPaginationControl = new Blaze.Template('Template.MPaginationControl', function() {
		return Template._MPaginationControl;
	});

	var paginationHelpers = {
		'class': function() {
			if (Template.instance().data) {
				return Template.instance().data.class;
			}
		},

		'prevClass': function() {
			if (Template.instance().data) {
				return Template.instance().data.prevClass || 'prev';
			}
		},

		'pageClass': function() {
			if (Template.instance().data) {
				return Template.instance().data.pageClass || 'page';
			}
		},

		'nextClass': function() {
			if (Template.instance().data) {
				return Template.instance().data.nextClass || 'next';
			}
		},

		'searchResultCount': function() {
			var count = templateInstance.resultCount.get();

			return templateInstance.resultCount.get() + (count === 1 ? ' item' : ' items');
		},

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
	};

	var paginationEvents = {
		'click .prev a': function(e) {
			e.preventDefault();

			var currentPage = templateInstance.currentPage.get();

			currentPage--;

			if (currentPage >= 1) {
				opts.onBeforeClicks && opts.onBeforeClicks();
				opts.onBeforePreviousClicks && opts.onBeforePreviousClicks();

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
				opts.onBeforeClicks && opts.onBeforeClicks();
				opts.onBeforeNextClicks && opts.onBeforeNextClicks();

				templateInstance.currentPage.set(currentPage);
			}
		},

		'click .page a': function(e) {
			e.preventDefault();

			opts.onBeforeClicks && opts.onBeforeClicks();
			opts.onBeforePageClicks && opts.onBeforePageClicks();

			templateInstance.currentPage.set(this.pageNumber);
		}
	};

	template.helpers(paginationHelpers);
	Template._MPaginationControl.helpers(paginationHelpers);

	template.events(paginationEvents);
	Template._MPaginationControl.events(paginationEvents);
};