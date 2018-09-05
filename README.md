## Todos Performance
This is the Meteor Todos example forked from https://github.com/meteor/todos. The
application has been changed to be less performant.

### Running the app

```bash
meteor npm install
meteor
```

### Performance
After starting the application, visit localhost:3000 and start a meteor shell (with `meteor shell`). You can then run `Performance.checker()` in the Meteor shell to see performance benchmarks to
get started on. The following packages below, Analyze & Profiler, will be very helpful for discovering issues.

### Helpful Commands and Tools in the Meteor Shell
`Performance.checker()`: Runs a test suite to identify performance issues.

`Performance.Analyze`: The qualia:analyze-observes package from https://github.com/qualialabs/analyze-observes

`Performance.Profiler`: The qualia:profiler package from https://github.com/qualialabs/profile