## Run
- we have two docker composes - one for local development and one for CI
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```
### S3 ui
- open [localhost:9001](http://localhost:9001) in browser

## Important
- should not run npm install outside of docker container!
- can cause differences in package versions and dependencies

## Caveats
- aws supports node14 in lambda


## Entry points
- lambda.ts to run in lambda
- local.ts for local development


## Dependency injection
- we want to have well organized code
- rely on well used practices - MVC
- dependency injection - central place orchestrating dependencies
