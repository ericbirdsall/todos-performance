## Todos Performance
This is the Meteor Todos example forked from https://github.com/meteor/todos. The
application has been changed to be less performant. Run `Performance.checker()` in the
Meteor shell to test problem solutions.

### Running the app

```bash
meteor npm install
meteor
```
then visit localhost:3000

Be sure to wait until the fixtures have finished loading before attempting to work on each problem.

### File Structure
The main files you will be working with are in `/imports/api`. There is a folder for each collection (todos and lists) containing Meteor methods (methods.js) and schema definitions (todos.js/lists.js). In the `server` folder for each collection you can find `publications.js` containing collection publications.

#### Problem 1: Todo Completion Time
Marking All Todos Complete (checkbox in the top right) is pretty slow. Use the [qualialabs:profile](https://github.com/qualialabs/profile) package to take a server-side profile and determine what is causing the slowness.

#### Problem 2: Polling Observes
The application contains a polling observe. Use the [qualialabs:analyze-observes](https://github.com/qualialabs/analyze-observes) package found in the Meteor shell at `Performance.Analyze` to identify the polling observe and remove it.

#### Problem 3: Overpublishing
A large unused field is being published to the client. Use the [Meteor DevTools chrome extension](https://github.com/bakery/meteor-devtools) to identify what is being published and omit it from the list of published fields.

#### Problem 4: Database Indices
The application contains no indices on the Todos collection, and queries on Todos require a full collection scan. Add an index on the Todos collection to avoid paging the entire collection into memory when running queries.

### Helpful Commands and Tools in the Meteor Shell
`Performance.checker()`: Runs a test suite for each problem.

`Performance.Analyze`: the [qualialabs:analyze-observes](https://github.com/qualialabs/analyze-observes) package

`Performance.Profiler`: the [qualialabs:profile](https://github.com/qualialabs/profile) package
