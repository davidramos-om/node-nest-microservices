
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

# delete, clear and run
rm -rf dist && clear && npm run start:dev

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
```
 Add entities in app.modules :

 TypeOrmModule.forRoot({
  entities: [UserEntity, PostEntity],
 })
```
## Generate key and cert
```bash
  openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
  openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt

  # Allows requests to localhost over HTTPS
  chrome://flags/#allow-insecure-localhost 
```