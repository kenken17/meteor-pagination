meteor-counters
================

A naive way to implement pagination just to reduce boiler plate code.

## Installation

```bash
$ meteor add kenken:meteor-pagination
```

##Idea
The idea behind the package is to extract all boilerplate code for making a basic pagination from a collection. Example will be provided soon...

##Usage
/server/publications.js

```javascript
Meteor.publish('items', function(opts) {
	var query =  opts && opts.query ? opts.query : {},
		modifier = {};

	// we are using tmeasday:publish-counts here to publish the item counts
	Counts.publish(this, 'itemsCount', Items.find(query), {noReady: true});

	if (opts) {
		if (opts.sort) modifier = _.extend(modifier, {sort: opts.sort});
		if (opts.limit) modifier = _.extend(modifier, {limit: opts.limit});
		if (opts.skip) modifier = _.extend(modifier, {skip: opts.skip});
	}

	return Items.find(query, modifier);
});
```

/client/itemsListing.js

```javascript
Template.itemsListing.onCreated(function() {
	var self = this;

	self.pagination = new MPagination({
		templateName: 'itemsListing',
		templateInstance: self,
		perPageCount: 25,
		currentPage: 1,
		resultCount: 0,
		onBeforeClicks: function () {},
		onBeforePreviousClicks: function () {},
		onBeforeNextClicks: function () {},
		onBeforePageClicks: function () {}
	});

	self.autorun(function() {
		if (self.resultCount) {
			// we are using tmeasday:publish-counts here to get the item counts
			// you can use anyway to get the total count, as long as resultCount is set
			self.resultCount.set(Counts.get('itemsCount'));
		}

		self.subscribe('items', {
			query: self.query.get(),
			sort: self.sort.get(),
			limit: self.perPageCount.get(),
			skip: (self.currentPage.get() - 1) * self.perPageCount.get()
		});
	});
});

```

###Events

There are three events bound to the template instance:

- `click .prev a`: an `<a>` link within the class `.prev`.
- `click .next a`: an `<a>` link within the class `.next`.
- `click .page a`: an `<a>` link within the class `.page`.


###Hooks
There are four hooks for the clicks:

- `onBeforeClicks`: call before all click events above.
- `onBeforePreviousClicks`: call before `previous` link is clicked.
- `onBeforeNextClicks`: call before `next` link is clicked.
- `onBeforePageClicks`: call before `page` link(s) is clicked.

---

/client/itemsListing.html

**options 1:** *making use of manual helpers*

```html
	{{#each searchResult}}
	<tr>
		<td>{{propery1}}</td>
		<td>{{propery2}}</td>
	</tr>
	{{else}}
	<tr>
		<td colspan="2">No item found.</td>
	</tr>
	{{/each}}

	<ul class="pagination">
		<li class="prev {{isPrevDisabled}}">
			<a href="#" title="Prev"><i class="fa fa-angle-left"></i></a>
		</li>
		{{#each pages}}
		<li class="page {{isActive}}">
			<a href="#">{{pageNumber}}</a>
		</li>
		{{/each}}
		<li class="next {{isNextDisabled}}">
			<a href="#" title="Next"><i class="fa fa-angle-right"></i></a>
		</li>
	</ul>
```

- `{{searchResult}}`: returns result of the collection.
- `{{isPrevDisabled}}`: returns `true`, where there is no more *previous* page.
- `{{pages}}`: All the pages, which consists of the `{{pageNumber}}`.
- `{{isActive}}`: returns a string `active` when the current page is in view.
- `{{isNextDisabled}}`: returns `true`, where there is no more *next* page.

---

**options 2:** *making use of ready template*

```html
	{{#each searchResult}}
	<tr>
		<td>{{propery1}}</td>
		<td>{{propery2}}</td>
	</tr>
	{{else}}
	<tr>
		<td colspan="2">No item found.</td>
	</tr>
	{{/each}}

	{{> MPaginationControl class="customClass" prevClass="prevClass" nextClass="nextClass" pageClass="pageClass"}}
```

- `{{> MPaginationControl}}`: returns similar to `options 1` html markup. But it can  take in attributes.
- `class`: the class for the root element of the control, i.e. `<ul>`
- `prevClass`: the class for `previous` link
- `nextClass`: the class for `next` link
- `pageClass`: the class for `page` link(s)




