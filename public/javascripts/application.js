App = {
  start: function() {
    new App.SearchRouter()
  }
}

App.SearchResult = Backbone.Model.extend({})
App.SearchResultList = Backbone.Collection.extend({
  model: App.SearchResult
})
App.searchResults = new App.SearchResultList()

App.SearchController = {
  search: function(term) {
    App.searchResults.add({term : term}) 
  }
}

App.SearchResultsView = Backbone.View.extend({
  el: '#search-results',

  initialize: function() {
    App.searchResults.bind('add', this.renderItem, this)
  },

  renderItem: function(model) {
    $(this.el).show()

    var view = new App.SearchResultView({model : model})
    this.$('ul').append(view.el)
  }  
})

App.SearchResultView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click a' : 'addFavorite'
  },

  initialize: function() {
    this.template = _.template($('#imageTemplate').html())
    this.render()
  },

  render: function() {
    var html = this.template({model : this.model.toJSON()}) 
    $(this.el).append(html)
  },

  addFavorite: function() {
    App.favorites.add(this.model)
  }
})

App.Favorite = Backbone.Model.extend({})
App.FavoriteList = Backbone.Collection.extend({
  model: App.Favorite
})
App.favorites = new App.FavoriteList()

App.FavoritesView = Backbone.View.extend({
  el: '#favorites',
  
  initialize: function() {
    App.favorites.bind('add', this.renderItem, this)
    App.favorites.bind('add', this.removeEmptyMessage, this)
  },

  renderItem: function(model) {
    var view = new App.FavoriteView({model : model})
    this.$('ul').append(view.el)

    this.$('ul li').show()
  },

  removeEmptyMessage: function() {
    this.$('p').hide()
  }
})

App.FavoriteView = Backbone.View.extend({
  tagName: 'li',
  
  initialize: function() {
    this.template = _.template($('#imageTemplate').html())
    this.render()
  },

  render: function() {
    var html = this.template({model : this.model.toJSON()})
    $(this.el).append(html)
  }
})

App.SearchRouter = Backbone.Router.extend({
  routes: {
    'search/:term' : 'search'
  },

  initialize: function() {
    new App.SearchView({router : this})
    new App.SearchResultsView()
    new App.FavoritesView()
  },

  search: function(term) {
    App.SearchController.search(term)
  }
})

App.SearchView = Backbone.View.extend({
  el: '#search',
  events: {
    'keypress' : 'handleEnter'
  },

  initialize: function() {
    this.router = this.options.router
    $(this.el).focus()
  },

  handleEnter: function(e) {
    if (e.keyCode == 13) {
      this.router.navigate('search/' + $(this.el).val(), true)
    }
  }
})
