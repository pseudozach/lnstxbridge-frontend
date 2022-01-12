# lnstxbridge-frontend

* Frontend for [lnstxbridge](https://github.com/pseudozach/lnstxbridge)

## install
* clone the repo and install requirements  
`git clone https://github.com/pseudozach/lnstxbridge-frontend.git`  
`cd lnstxbridge-frontend && npm i`

* make required changes as per your environment to `.env` file

* start the app  
`npm run start`

## use
* visit `http://localhost:3001`

## docker
`docker buildx build --platform linux/amd64 -t pseudozach/lnstxbridge-frontend:latest .`
