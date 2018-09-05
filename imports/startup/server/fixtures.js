import { Meteor } from 'meteor/meteor';
import { Lists } from '../../api/lists/lists.js';
import { Todos } from '../../api/todos/todos.js';
import { _ } from 'meteor/underscore';
import faker from 'faker';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  let listCount = Lists.find().count();
  if (listCount < 50) {
    const data = _.range(50 - listCount).map(listNumber => {
      return {
        name: `List ${listNumber}`,
        items() {
          return _.range(80).map(todoIndex => `Todo ${listNumber}-${todoIndex}`)
        }
      }
    });

    let timestamp = (new Date()).getTime();

    data.forEach((list) => {
      const listId = Lists.insert({
        name: list.name,
        incompleteCount: list.items().length,
      });

      let secondaryText = faker.lorem.paragraphs(1000);
      list.items().forEach((text) => {
        Todos.insert({
          listId,
          text,
          secondary_text: secondaryText,
          createdAt: new Date(timestamp),
        });

        timestamp += 1; // ensure unique timestamp.
      });
    });
  }
});
