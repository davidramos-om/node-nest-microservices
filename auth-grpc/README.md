
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

*  Nest can't resolve dependencies of the UserService (?). Please make sure that the argument UserEntityRepository at index [0] is available in the AppModule context.
```
  Remove UserService from (imports, providers, etc.) at app.module
```
## Generate key and cert
```bash
  openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
  openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt

  # Allows requests to localhost over HTTPS
  chrome://flags/#allow-insecure-localhost 
```

## Docker file

### Create docker image

```bash
  # Create docker image
  docker build -t nestjs_auth .

  # Search images
  docker images

```

### Run container

4012:4010 = (port 4010 according to our code, but running in a container, so, go out by 4012 port to our o.s) 

```bash
    # Run default
    docker run nestjs_auth
      
    # Interactive mode 
    docker run -it -p 4012:4010 nestjs_auth

    # Detached mode 
    docker run -d -p 4012:4010 nestjs_auth
```
  
  This generate an id : E.g. "9533abc13667265f97fcecede862d5173aa7f840e1eb9ec7e7a85306cb8b66f3"  

  ```
    docker ps
  ```

  ```
    docker stop container_id
    docker stop 9533abc13667
  ```



  ### Push to Docker Hub
  ```bash

  # template  
  docker build -t <username>/<image-name> .
  docker tag <username>/<image-name>:<tagname> <username>/<image-name>:<tagname> 
  docker push <username>/<image-name>:<tagname>
  
  # command
  docker build -t daviddramos015/nestjs_auth_repo .
  docker run -it -p 4012:4010 daviddramos015/nestjs_auth_repo
  docker tag daviddramos015/nestjs_auth_repo:latest  daviddramos015/nestjs_auth_repo:latest
  docker push daviddramos015/nestjs_auth_repo:latest
```