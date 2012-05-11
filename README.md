# About Backbone.actAs.Paginatable
==========================

Paginatable backbone collections for large model sets.

# Getting started

No special requirements for frontend.
As for the backend you need to pass special "X-Pagination-Total-Results" header with total number of models in yout set.

## Setup plugin

There are two ways of using this actAs-plugin:

1.	*Globally.* You can simply mix it to Backbone.Collection.prototype (like Backbone.Events) and all your collections automatically become Mementoable.
```javascript
_.extend( Backbone.Collection.prototype, Backbone.actAs.Paginatable );
```

2.	*Locally.* Like the first way, but mix Backbone.actAs.Paginatable to your own collection prototype, not to Backbone.

## Usage

TODO