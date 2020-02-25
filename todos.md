## Storyteller
Need to remove code duplication and move away `runSaga`, so:
* Audit code
* Review DDD principles (references between packages)
* Rename (braic?)
* Examples
* Readme
* Open-source github repo
* Make features backlog. Put to it at least
    * Algebraic effects
    * Articles: basic, algebraic effects

## Typing:
* Install typescript to all projects
* All config items should be strongly typed
    * The same applies for "plugins" interfaces
* Storage model should be strongly typed; queries should return failure on mapping
* All the stuff around "domain" model should be strongly typed
* All public interfaces (can be determined from `intergration-sls` project) should be strongly typed

## Federation & overall refactoring:
* Copy `integration-sls` -> `integration-test-suite`
* Move `integration-test-suite` to use `@apollo/federation` package together with soyuz
* Move storage to save sdl during registration
    * Don't forget about unit testing
* Replace runSaga with `storyteller`
* __TBD__: Headers, etc?



To open source:
* Rename `soyuz*` -> `graphql-unite*` (should rename anyway, concrete titles TBD)
* CLI
* Rename `integration-sls` to `intergation-tests-fixture`. Refactor it to not to use sls
* Make an ability to not to use sls on local
* Remove extension-references
    * Remove storage
* Make TS interfaces for core entities, implement them with periphery packages (*.d.ts will be enough for zero-approach)
