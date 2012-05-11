# About Backbone.actAs.Paginatable
==========================

Paginatable backbone collections for large model sets.

# Getting started

No special requirements for frontend.
As for the backend you need to pass special "X-Pagination-Total-Results" header with total number of models in your set.

## Setup plugin

There are two ways of using this actAs-plugin:

1.	*Globally.* You can simply mix it to Backbone.Collection.prototype (like Backbone.Events) and all your collections automatically become Mementoable.
```javascript
_.extend( Backbone.Collection.prototype, Backbone.actAs.Paginatable.Collection );
_.extend( Backbone.Model.prototype, Backbone.actAs.Paginatable.Model );
```
This method is _not_ recommended yet, because fallback to non-paginatable collections is not ready yet.

2.	*Locally.* Like the first way, but mix Backbone.actAs.Paginatable to your own collection and model prototypes, not to Backbone.

Also you can use Backbone.actAsPaginatable.init( collectionPrototype, modelPrototype ) - helper.

Without parameters it's equal to the first way (Global)

## Usage examples

### Simple Usage
```javascript

/**
 * Declaring our models and collections
 */
var NewsModel = Backbone.Model.extend({}),
	NewsCollection = Backbone.Collection.extend({
		/**
		 * Special root option.
		 * MUST be set for all paginatable collections.
		 */
		urlRoot: '/rest/news',
		model: NewsModel
	});

/**
 * Define them as paginatable
 */
Backbone.actAs.Paginatable.init(NewsCollection, NewsModel);

var ThisYearNewsCollection = new NewsCollection();

ThisYearNewsCollection.urlRoot = '/rest/2012/news'; //redefining URL root

ThisYearNewsCollection.currentPage(2); // We want to get the second page...
ThisYearNewsCollection.itemsPerPage(7); // ...with 7 results on page

/**
 * Fetching the second page of results
 */
ThisYearNewsCollection.fetch().done(function(){ // request to server: /rest/2012/news?page=2&itemsPerPage=7
	console.log( ThisYearNewsCollection.at(0).attributes ); //Let's look inside

	ThisYearNewsCollection.nextPage().done(function(){
		console.log('Now we are on the third page!');
		console.log(ThisYearNewsCollection.paginationInfo()); //get some info
	});
});
```

### Custom page parameters

If you are not satisfied with predefined parameter names for backend (page, itemsPerPage) you can set your own.

```javascript
ThisYearNewsCollection.actAs_Paginatable_currentPage_attr = 'p';
ThisYearNewsCollection.actAs_Paginatable_itemsPerPage_attr = 'ipp';

ThisYearNewsCollection.currentPage(2); // We want second page...
ThisYearNewsCollection.itemsPerPage(7); // ...with 7 results on page

ThisYearNewsCollection.fetch(); // request to server: /rest/2012/news?p=2&ipp=7
```

For more detailed usage examples look into tests/ directory.

# API

This plugin provides you (and your collections) special methods:

1. paginationInfo() - returns a hash with pagination information
```javascript
{
	totalItems: false,
	totalPages: false,

	itemsPerPage: this.itemsPerPage(),

	currentPage: this.currentPage(),
	previousPage: false,
	nextPage: false
}
```
2. itemsPerPage( items ) - setter/getter for limiting items per page
3. currentPage() - setter/getter for current page
4. nextPage() - method for fetching next page of results. Returns $.Deferred
5. previousPage() - method for fetching previous page of results. Returns $.Deferred
6. loadPage( page ) - method for fetching custom page of results. Returns $.Deferred

# ChangeLog

## v0.1a - Alpha release. Just proof of concept :)