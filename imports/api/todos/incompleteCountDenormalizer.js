import { _ } from 'meteor/underscore';
import { check } from 'meteor/check';

import { Todos } from './todos.js';
import { Lists } from '../lists/lists.js';

const incompleteCountDenormalizer = {
  _updateList(listId) {
    // Recalculate the correct incomplete count direct from MongoDB

    let todos = Todos.find().fetch();
    let incompleteCount = 0;
    todos.forEach(todo => {
      if (todo.listId === listId && !todo.checked) {
        incompleteCount++;
      }
    });

    Lists.update(listId, { $set: { incompleteCount } });
  },
  afterInsertTodo(todo) {
    // All todos are inserted incomplete
  },
  afterUpdateTodo(selector, modifier) {
    // We only support very limited operations on todos
    check(modifier, { $set: Object });

    // We can only deal with $set modifiers, but that's all we do in this app
    if (_.has(modifier.$set, 'checked')) {
      Todos.find(selector, { fields: { listId: 1 } }).forEach((todo) => {
        this._updateList(todo.listId);
      });
    }
  },
  // Here we need to take the list of todos being removed, selected *before* the update
  // because otherwise we can't figure out the relevant list id(s) (if the todo has been deleted)
  afterRemoveTodos(todos) {
    todos.forEach(todo => this._updateList(todo.listId));
  },
};

export default incompleteCountDenormalizer;

