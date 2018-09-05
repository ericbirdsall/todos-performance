import '/imports/startup/server';
import '/imports/startup/both';
import { Analyze } from 'meteor/qualia:analyze-observes';
import { Lists } from '/imports/api/lists/lists.js';
import { Todos } from '/imports/api/todos/todos.js';
import { _ } from 'meteor/underscore';
import Profiler from "meteor/qualia:profile";


Performance = {};

let checkPollingObserves = function () {
  let results = Analyze.go()
  if (_.size(results) < 4) {
    return {
      success: false,
      message: 'Click around the app to start some observes',
    }
  }
  if (_.values(results).some(observe => _.size(observe.oplogBlockers))) {
    return {
      success: false,
      message: 'Application contains a polling observe',
    }
  }
  else {
    return {
      success: true,
      message: 'Application contains no polling observes',
    }
  }
}

let logToConsole = (header, logObj) => {
  console.log(header)
  console.log(`${logObj.success ? `  \x1b[32m✓\x1b[0m ` : `  \x1b[31m✗\x1b[0m `} ${logObj.message}`);
};

checkTodoCompletionTime = function () {
  let updateATodo = () => {
    let tic = new Date();
    let todo = Todos.findOne({checked: false});
    Todos.update(todo._id, {$set: {
      checked: true,
    }});
    let toc = new Date();
    return toc - tic;
  }
  let times = _.range(5).map(updateATodo);
  let totalTime = times.reduce((a, b) => a + b, 0)
  console.log(`time: ${totalTime}`);
  if (totalTime > 120) {
    return {
      success: false,
      message: `Todo Completion time takes a while`,
    };
  } else {
    return {
      success: true,
      message: `Todo Completion time looks good.`
    }
  }
  let selector = todoObserve.selector;
  if (selector && selector.listId.$exists && _.size(selector.listId) === 1) {
    return {
      success: false,
      message: `List switching time is probably taking a while`,
    };
  } else {
    return {
      success: true,
      message: 'List switching time looks better!',
    }
  }
};

let checkIndices = async () => {
  let info = await Todos._collection.rawCollection().indexInformation()
  if (_.size(info) > 1) {
    return {
      success: true,
      message: 'Index added to Todos collection',
    }
  } else {
    return {
      success: false,
      message: 'Todos collection only has default index',
    }
  }
}

let checkPublishedFields = () => {
  return _.size(Todos.publicFields) < 5 ? {
    success: true,
    message: 'Unnecessary data not published to client',
  } : {
    success: false,
    message: 'Client receiving unnecessary data',
  }
}

Performance.checker = async function () {
  logToConsole('Todo Completion Time', checkTodoCompletionTime());
  logToConsole('Polling Observes', checkPollingObserves());
  logToConsole('Overpublishing', checkPublishedFields());
  logToConsole('Check Indices', await checkIndices());
};

Performance.Analyze = Analyze;
Performance.Profiler = Profiler;
Performance.Todos = Todos;

// Check fixtures
console.log('Loading Fixtures');
let interval = Meteor.setInterval(() => {
  const TOTAL_TODOS = 400;
  let count = Todos.find().count();
  if (count < TOTAL_TODOS) {
    console.log(`${(count / TOTAL_TODOS * 100).toFixed(2)}% finished.`);
  } else {
    console.log('Fixtures Loaded');
    Meteor.clearInterval(interval);
  }
}, 2 * 1000);

