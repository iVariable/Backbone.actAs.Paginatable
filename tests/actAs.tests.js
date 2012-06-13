module('Backbone.actAs.Paginatable');

//Initialization
_.extend( Backbone.Collection.prototype, Backbone.actAs.Paginatable );

test('Simple getters',function(){

	var collection = new TestCollection();

	equal( collection.itemsPerPage(), 20, 'itemsPerPage() getter' );
	equal( collection.itemsPerPage(30), 30, 'itemsPerPage() setter' );

	equal( collection.currentPage(), 1, 'currentPage() getter' );
	equal( collection.currentPage(3), 3, 'currentPage() setter' );

	equal( collection.actAs_Paginatable_currentPage_attr, 'page' );
	equal( collection.actAs_Paginatable_itemsPerPage_attr, 'itemsPerPage' );

});

test('URL construction', function(){

	var collection		= new TestCollection(),
		collectionWithQ = new TestCollectionWithQ();

	collection.currentPage(2);
	collection.itemsPerPage(48);

	equal( collection.url(), '/testme?page=2&itemsPerPage=48', 'url() with default attributes naming' );

	collectionWithQ.currentPage(2);
	collectionWithQ.itemsPerPage(48);
	collectionWithQ.actAs_Paginatable_currentPage_attr = 'currentpage';
	collectionWithQ.actAs_Paginatable_itemsPerPage_attr = 'ipp';

	equal( collectionWithQ.url(), '/testme?hello=1&world=2&currentpage=2&ipp=48', 'url() with custom attributes and naming' );

});

test('Fetching collection, paginationInfo()', 3, function(){

	var collection = new TestCollection(),
		itemsPerPage = 7,
		paginationInfo = {
			totalItems: "94",
			totalPages: 14,

			itemsPerPage: 7,

			currentPage: 1,
			previousPage: false,
			nextPage: 2
		};

	collection.itemsPerPage(itemsPerPage);
	stop();
	collection.fetch({
		success: function(newCollection, response){
			start();
			equal(newCollection.at(1).get('name'), '1', 'Correct models retrieved');
			equal(newCollection.length, itemsPerPage, 'All needed results retrieved');
			deepEqual(newCollection.paginationInfo(), paginationInfo, 'paginationInfo()');
		},
		error: function(newCollection, response){
			start();
			throw Error('Error while retrieveng collection');
		}
	});

});

test('Paginating thru collection', 14, function(){
	var collection = new TestCollection(),
		checkCollection = function(size, currentPage, prevPage, nextPage){

				equal(collection.length, size, 'Size check');
				equal(collection.paginationInfo().currentPage, currentPage, 'Current page');
				equal(collection.paginationInfo().previousPage, prevPage, 'Previous page');
				equal(collection.paginationInfo().nextPage, nextPage, 'Next page');
		};

	collection.itemsPerPage(40);
	stop(4);

	collection.fetch().always(function(){

		collection.previousPage().done(function(){
			throw Error('Oops! No previous page must be found!');
		}).fail(function(){
			start();
			ok('Previous page check passed');

			checkCollection(40, 1, false, 2);

			collection.nextPage().always(function(){
				start();
				checkCollection(40, 2, 1, 3);

				collection.nextPage().always(function(){
					start();
					checkCollection(14, 3, 2, false);

					collection.nextPage().done(function(){
						throw Error('Oops! No next page must be found!');
					}).fail(function(){
						start();
						ok(true, 'Next page check passed');
					})

				});
			});

		});


	});
});

test('Model url test', function(){
	var collection = new TestCollection(),
		collectionWithQ = new TestCollectionWithQ();

	stop(2);

	collection.fetch().always(function(){
		start();
		var model = collection.at(0),
			newModel = collection.create();
		equal( model.url(), '/testme/0', 'Existing model url' );
		equal( newModel.url(), '/testme', 'New model url' )
	});

	collectionWithQ.fetch().always(function(){
		start();
		var model = collectionWithQ.at(0),
			newModel = collectionWithQ.create();
		equal( model.url(), '/testme/0', 'Existing model url' );
		equal( newModel.url(), '/testme', 'New model url' )
	});
});

test('Additional URL params', 7, function(){
	var collection = new TestCollection(),
		params = {
			first: 1,
			second: 'ololo'
		},
		paramsWithThird = {
			first: 1,
			second: 'ololo',
			third: 'test'
		};

	deepEqual( collection.getUrlParams(), {}, 'No params by default' );


	deepEqual( collection.setUrlParams(params), params, 'Setter return current value');
	deepEqual( collection.getUrlParams(), params, 'Params set');

	var gettedParams = collection.getUrlParams();
	gettedParams.first = 2;
	gettedParams['third'] = 'Piupiu';
	deepEqual( collection.getUrlParams(), params, 'getUrlParams returning cloned param versions');

	collection.setUrlParam('third', paramsWithThird.third);
	deepEqual( collection.getUrlParams(), paramsWithThird, 'setUrlParam');

	collection.removeUrlParam('third');
	deepEqual( collection.getUrlParams(), params, 'removeUrlParam');

	equal( collection.url(), '/testme?first=1&second=ololo&page=1&itemsPerPage=20', 'Url constructed with additional params' );

});

test( 'receive', 6, function(){
	var collection = new TestCollection(),
		testId = 21,
		existingTestId = 2;
	stop();
	collection.fetch().done(function(){
		start();
		var existingObject = collection.get(existingTestId);
		ok( existingObject, 'There is 2d object in collection' );
		ok( !collection.get(testId), 'There is no 21st object on the first page of results' );
		stop(2);
		collection.receive(existingTestId).done(function(object){
			start();
			equal( object.id, existingTestId, 'Object receieved from collection' );
			equal( existingObject, object, 'really an object from collection' );
		});
		collection.receive(testId).done(function(object){
			start();
			equal( object.id, testId, 'Object receieved from server' );
			equal( object.get('name'), testId, 'Right name' );
		});
	});
} );