var TestModel = Backbone.Model.extend({
		defaults: {
			name: 'defaultName'
		},
		urlRoot: '/rest/test'
	}),

	TestCollection = Backbone.Collection.extend({
		model: TestModel,
		urlRoot: '/testme'
	}),

	TestCollectionWithQ = Backbone.Collection.extend({
		model: TestModel,
		urlRoot: '/testme?hello=1&world=2',
		modelUrlRoot: '/testme'
	});

Backbone.actAs.Paginatable.init(TestCollection, TestModel);
Backbone.actAs.Paginatable.init(TestCollectionWithQ, TestModel);

$.mockjax({
	url: '/testme*',
	dataType: 'json',
	responseTime: 0,
	response: function(settings) {
		var mockData = [],
			maxResults = 94,
			urlString = $('a').attr('href',settings.url).get(0).search.substr(1),
			urlData = {
				'page': 1,
				'itemsPerPage': 20
			};

		$.each( urlString.split('&'), function(i, data){
			urlData[data.split('=')[0]] = data.split('=')[1];
		} );
		for(var i=0; i< maxResults; i++ ){
			mockData.push({name: i, id: i});
		}

		this.headers['X-Pagination-Total-Results'] = maxResults;
		this.headers['X-Pagination-Current-Page'] = urlData['page'];
		this.headers['X-Pagination-Items-Per-Page'] = urlData['itemsPerPage'];

		var start = (urlData['page']-1)*urlData['itemsPerPage'];

		this.responseText = mockData.slice( start , start+parseInt(urlData['itemsPerPage']) );

	}
});