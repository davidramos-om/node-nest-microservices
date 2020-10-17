
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Adding a module : SOLID principles
```
  nest g module your-modulo-name
```

## Adding a service
```
  nest g service your-service-name
```

## Adding a controller
```
  nest g controller your-controler-name
```

# Errors :
* Cannot find module './app.controller' Require stack:
```
  rm -rf dist/
```

* In order to use "defaultStrategy", please, ensure to import PassportModule in each place where AuthGuard() is being used.
 ```
  just change  @UseGuards(AuthGuard('jwt')) 
```

* Nest can't resolve dependencies of the UserEntityRepository (?). Please make sure that the argument Connection at index [0] is available in the TypeOrmModule context.