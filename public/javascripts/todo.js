Todo = {
  start: function() {
    new Todo.Router()
  }
}

Todo.ListView = Backbone.View.extend({
  el: '#todo',
  initialize: function() {
    _.bindAll(this, 'render')
    Todo.todos.bind('add', this.render)
  },

  render: function(model) {
    var view = new Todo.ItemView({model : model})
    $(view.el).appendTo($(this.el))
  }
})

Todo.ItemView = Backbone.View.extend({
  tagName: 'li',
  initialize: function() {
    this.template = _.template($('#todoTemplate').html())
    this.render()
  },

  render: function() {
    $(this.el).html(this.template({model : this.model.toJSON()}))
    this.$('a').popover({placement : 'left'})
  }
})

Todo.List = Backbone.Collection.extend({
  model: Todo.TodoItem
})
Todo.todos = new Todo.List()

Todo.Item = Backbone.Model.extend({
  defaults: {
    'state' : 'failure'
  },

  initialize: function() {
  },

  run: function() {
    try {
      if (this.get('run')()) {
        this.set({'state' : 'success'})
        return;
      }
    } catch(e) {
      console.log('Todo : ' + this.get('title') + ' : ' + e)
    }

    this.set({'state' : 'failure'})
  }
})

Todo.Catalog = {
  all: function() {
    var bootstrap = new Todo.Item({ title : 'Create Application Scope', 
                                    description : 'Create an application scope to hold the objects and as an entry point.',
                                    run : function() { return typeof App != 'undefined' && typeof App.start != 'undefined' } })

    var router = new Todo.Item({ title : 'Create Router', 
                                 description : 'Create a router for handling navigation and coordination of communication between objects.',
                                 run : function() { return typeof App.SearchRouter != 'undefined' } })

    var rootRoute = new Todo.Item({ title : 'Define A Root Route', 
                                 description : 'Define a root route to used as a default when first navigating to the page.',
                                 run : function() { return new App.SearchRouter().routes[''] == 'root' } })

    var searchView = new Todo.Item({ title : 'Create A Search View', 
                                 description : 'Create a view manage the search box.',
                                 run : function() { return typeof App.SearchView != 'undefined' } })

    var searchFocus = new Todo.Item({ title : 'Give Search Box Focus', 
                                 description : 'Ensure the search box has focus when the page loads.',
                                 run : function() { return $('#search').is(':focus') } })

    var searchForImages = new Todo.Item({ title : 'Search For Images', 
                                 description : 'Add support for searching for a list of images by keyword.',
                                 run : function() { 
                                   $('#search').val('golf')
                                   pressEnter = jQuery.Event('keypress')
                                   pressEnter.keyCode = 13
                                   $('#search').trigger(pressEnter) 
                                   return false
                                 } })

    return [bootstrap, router, rootRoute, searchView, searchFocus, searchForImages]
  }
}

Todo.Router = Backbone.Router.extend({
  routes: {
    '' : 'root'
  },

  initialize: function() {
    this.listView = new Todo.ListView()
  },

  root: function() {
    var todos = Todo.Catalog.all()
    _.each(todos, function(todo) { todo.run() })
    Todo.todos.add(todos)
  }
})
