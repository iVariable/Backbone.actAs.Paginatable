# About Backbone.actAs.Paginatable
==========================

Paginatable backbone collections for large model sets. Request your collections piece by piece.

# Getting started

No special requirements for frontend. Tested on Backbone v0.9.2

As for the backend you need to pass special "X-Pagination-Total-Results" header
with total number of models in your set if you want to use paginationInfo() method.

If you just want next page, and you don't need knowledge about how mush pages left (like twitter posts strip)
you can skip "X-Pagination-Total-Results" implemetation.

## Setup plugin

Call Backbone.actAsPaginatable.init( collection, model ) on your collections and models and they'll become paginatable.

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

### Custom parameters in collections url

If you need to use parametrized url for fetching your collections (/rest/2012/news?onlyactive=1&author=iv),
then you should set special modelUrlRoot parameter to your collection, to get correct url for models.

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
		urlRoot: '/rest/news?year=2012&month=11',
		modelUrlRoot: '/rest/news', # Our special parameter for model url
		model: NewsModel
	});

/**
 * Define them as paginatable
 */
Backbone.actAs.Paginatable.init(NewsCollection, NewsModel);
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
4. nextPage(force) - method for fetching next page of results. Returns $.Deferred.
"force" allows you to request next page from server even if next is undefined (you don't know total number of results).
It's just requesting "currentPage()+1" page
5. previousPage() - method for fetching previous page of results. Returns $.Deferred
6. loadPage( page ) - method for fetching custom page of results. Returns $.Deferred

# ChangeLog

## v0.2
- Added modelUrlRoot parameter
- Ready for usage

## v0.1a
 - Alpha release. Just proof of concept :)