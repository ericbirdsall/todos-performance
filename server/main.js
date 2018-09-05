import '/imports/startup/server';
import '/imports/startup/both';
import { Analyze } from 'meteor/qualia:analyze-observes';
import { Lists } from '/imports/api/lists/lists.js';
import { Todos } from '/imports/api/todos/todos.js';
import { _ } from 'meteor/underscore';
import Profiler from "meteor/qualia:profile";

// Add some latency to cursors
// Please don't change this :)
Todos._find = Todos.find;
Todos.find = function() {
  let cursor = Todos._find.apply(this, arguments);
  let docCount = cursor.count();
  Meteor._sleepForMs(docCount);
  return cursor;
};

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
    let aTodo = Todos.findOne({checked: false});
    Todos.update(aTodo._id, {
      $set: {
        checked: true,
      }
    });
    let toc = new Date();
    return toc - tic;
  };

  // Warm it up
  let times = _.range(5).map(() => updateATodo());
  let time = _.last(times);

  if (time > 100) {
    return {
      success: false,
      message: `todo completion is taking a while (${time} ms)`,
    };
  } else {
    return {
      success: true,
      message: 'Todo completion time looks good!',
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
  logToConsole('Polling Observes', checkPollingObserves());
  logToConsole('Todo Completion Time', checkTodoCompletionTime());
  logToConsole('Overpublishing', checkPublishedFields());
  logToConsole('Check Indices', await checkIndices());
};

Performance.Analyze = Analyze;
Performance.Profiler = Profiler;
Performance.Todos = Todos;

// Check
let interval = Meteor.setInterval(() => {
  const TOTAL_TODOS = 800;
  let count = Todos.find().count();
  if (count < TOTAL_TODOS) {
    console.log(`${(count / TOTAL_TODOS * 100).toFixed(2)}% finished.`);
  } else {
    console.log('Fixtures Loaded');
    Meteor.clearInterval(interval);
  }
}, 2 * 1000);

