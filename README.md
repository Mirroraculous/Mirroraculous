# Mirroraculous

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Writing Frontend code Dos and Don'ts
Do: use ng g c/s for *every* file that you want to add as a story. This will include values within the app.module.ts file as imports and create default testing, css, .ts, and .html files as well as a folder for these files.
Do not: Manually add files to a directory without adding import statments to the app.module.ts file

Do: Write tests as you go, not as you complete them. 
Do not: Forget to write tests

Do: use class level and tag level css
Do not: use #id or !important tags for more than a very few css rules. In most cases running into these specificity issues can be resolved through other methods. Think of this as hitting a mouse with a jackhammer.

Do: constantly check your current code by running both the backend server and frontend server(in two seperate cmd windows).
Do not: check after long periods of time. The longer you wait, the bigger potential bugs have to compound and become indeterminable.

Do: Look for solutions to problems that will not create problems down the line
Do not: implement solutions that are simple for the moment and will cause complications down the line.

Do: Test. Whether its a automated test or a UI test, please test before you attempt a PR
Do not: assume your code works because it makes sense. At *least* test your code through the UI, its not as robust as actual unit testing but it will get the job done.

Do: Pull the latest changes from master into your branch every time it is updated. If you wait, you will run into merge conflicts that will potentially become increasingly complex.
Do not: Work on your own branch never pulling or merging from other branches until the end of the sprint, *then* pull in the branches. Doing this will create a lot more work for yourself and others and could result in duplicated/conflicting code.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module` short hand for the important angular generators is ng g c (angular generate component) and ng g s (ng generate service).

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build. Only build if you're testing for errors as this takes much longer than ng serve which for all intents and purposes is easier to run ng serve. The built prod files will be relatively useless for you as they are static upon each build and should only be done for the operating server to send to users.

## Running unit tests
To learn about unit testing check out the documentation at [Jasmine Getting Started](https://jasmine.github.io/tutorials/your_first_suite)

important to note: Each spec.ts file is its own little thing therefore it needs every dependency for the component you are testing. Anything that the component you are trying to import uses must be included in the spec.ts test bed.


Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Backend

### Installing dependancies

The backend is written in Go which follows a specific pathing convention for its packages. After installing Go, run the following commands to install the required packages: 
- `go get -t -v ./...`

**Alternatively, you can install them all individually with the following commands:**
- `go get github.com/rs/xid` 
- `go get github.com/gin-gonic/gin`
- `go get -u google.golang.org/api/calendar/v3`
- `go get -u golang.org/x/oauth2/google`
- `go get github.com/dgrijalva/jwt-go`
- `go get github.com/gin-contrib/cors`
- `go get go.mongodb.org/mongo-driver`

### Pathing for the project

Once this is done, navigate to Go's github package directory (typically: `<home>/go/src/github.com/`). Once in there, make a new folder `mirroraculous` and clone the repo into that new directory. 

### Running the server

When all set up, you can run the server with `go run main.go` when in the root directory of the project. 

### Running tests

To run the tests in go, run `go test ./...` to test all files. Flags can be added such as `-v` for verbose and `-cover` for package coverage. The command `go test -v -cover ./...` will show the verbose coverage report and is recomended. 

## Mirraculous Style Guides

## Prettier Code Formatter (version 1.18.2)

Prettier supports Java, Angular, CSS and many more platforms. Please see the [Prettier Homepage] (https://prettier.io/) for more information. 

## TSLint (version 5.19.0)

TSLint is an extensible static analysis tool that checks TypeScript code for readability, maintainability, and functionality errors. Please see [TSLint Homepage] (https://palantir.github.io/tslint/) for more information.



