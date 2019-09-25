# Mirroraculous

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

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



