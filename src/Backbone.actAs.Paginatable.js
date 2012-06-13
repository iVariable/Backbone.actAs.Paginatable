Backbone.actAs = Backbone.actAs || {};

Backbone.actAs.Paginatable = {
	init: function(collection, model){
		collection	= collection || Backbone.Collection;
		model		= model || Backbone.Model;
		_.extend(collection.prototype, Backbone.actAs.Paginatable.Collection);
		_.extend(model.prototype, Backbone.actAs.Paginatable.Model);
	}
}

Backbone.actAs.Paginatable.Model = (function(){
	return {
		urlRoot: function(){
			if( this.collection && this.collection.modelUrlRoot ){
				return this.collection.modelUrlRoot;
			}
			if( this.collection && this.collection.urlRoot ){
				return this.collection.urlRoot;
			}
			return this.prototype.urlRoot;
		}
	};
})();

Backbone.actAs.Paginatable.Collection = (function(){
	return {

		actAs_Paginatable_totalItems: false,
		actAs_Paginatable_currentPage: 1,
		actAs_Paginatable_itemsPerPage: 20,

		actAs_Paginatable_currentPage_attr: 'page',
		actAs_Paginatable_itemsPerPage_attr: 'itemsPerPage',

		receive: function(id){
			var result = $.Deferred(),
				model = this.get(id);
			if( model ){
				result.resolve(model);
			}else{
				model = new this.model({id: id});
				if( this.modelUrlRoot ){
					model.url = this.modelUrlRoot+'/'+id;
				}else if( this.urlRoot ){
					model.url = this.urlRoot+'/'+id;
				}

				model.fetch().done(function(){
					result.resolve(model);
				})
				.fail(function(){
					result.reject();
				})
			}
			return result.promise();
		},

		itemsPerPage: function( itemsPerPage ){
			if( typeof itemsPerPage != 'undefined' ){
				this.actAs_Paginatable_itemsPerPage = itemsPerPage;
			};
			return this.actAs_Paginatable_itemsPerPage;
		},

		currentPage: function( page ){
			if( typeof page != 'undefined' ){
				this.actAs_Paginatable_currentPage = page;
			};
			return this.actAs_Paginatable_currentPage;
		},

		loadPage: function(page){
			if( page ){
				this.currentPage( page );
				return this.fetch();
			}
			var result = $.Deferred();
			result.reject();
			return result;
		},

		nextPage: function(force){
			var nextPage = force?(this.currentPage()+1):this.paginationInfo().nextPage;
			return this.loadPage(nextPage);
		},

		previousPage: function(){
			return this.loadPage(this.paginationInfo().previousPage);
		},

		paginationInfo: function(){
			var result = {
				totalItems: this.actAs_Paginatable_totalItems,
				totalPages: (this.actAs_Paginatable_totalItems)?(Math.ceil(this.actAs_Paginatable_totalItems/this.itemsPerPage())):false,

				itemsPerPage: this.itemsPerPage(),

				currentPage: this.currentPage(),
				previousPage: false,
				nextPage: false
			};

			if( result.currentPage > 1 ){
				result.previousPage = result.currentPage-1;
			}
			if( ( result.currentPage < result.totalPages ) && ( result.totalPages > 1 ) ){
				result.nextPage = result.currentPage+1;
			}

			return result;
		},

		getUrlParams: function(){
			if( typeof this.urlParams == 'undefined' ) this.urlParams = {};
			return _.clone(this.urlParams);
		},

		setUrlParams: function(params){
			this.urlParams = _.clone(params);
			return this.getUrlParams();
		},

		removeUrlParam: function(param){
			var params = this.getUrlParams();
			delete params[param];
			this.setUrlParams(params);
			return this;
		},

		setUrlParam: function(param, value){
			var params = this.getUrlParams();
			params[param] = value;
			this.setUrlParams(params);
			return this;
		},


		url: function(){
			if( typeof this.urlRoot == 'undefined' ){
				return Backbone.Collection.prototype.url.apply(this, arguments );
			}
			var params = this.getUrlParams();
			params[this.actAs_Paginatable_currentPage_attr] = this.actAs_Paginatable_currentPage;
			params[this.actAs_Paginatable_itemsPerPage_attr] = this.actAs_Paginatable_itemsPerPage;
			return this.urlRoot + ((this.urlRoot.indexOf('?')===-1)?'?':'&') + $.param(params);
		},

		parse: function(resp, result) {
			if( result.getResponseHeader('X-Pagination-Total-Results') ){
				this.actAs_Paginatable_totalItems = result.getResponseHeader('X-Pagination-Total-Results');
			}
			return resp;
		}

	};
})();