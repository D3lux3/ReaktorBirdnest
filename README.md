# Birdnest Reaktor Pre-assignment
> "Introducing the 'Bird-Brained Pilots' contact directory: where you can find all the aviator experts who took the saying 'bird in the hand' a little too literally. Never fear, with this handy app, you'll always know how to get in touch with a pilot who's a little too feathers-and-beaks obsessed." - ChatGPT 2022

---

## Description

A web application that display's contact information of pilots, who have flown their drones in 100-meter no-fly-one for 10 minutes. My solution for the pre-assignment is live and the link to it is **[HERE](https://reaktorbirdnest.herokuapp.com/)**.

#### Technologies:
1. Typescript for the backend and polling service.
2. PostgreSQL for the database.
3. React with Typescript for the frontend.
4. Docker and docker-compose for the containers.

## Project structure

- ### Dronepollservice
    - Polls drone locations approximately every time the data snapshot of monitoring equipment updates.
    - Parses and validates polled snapshot XML data into JSON.
    - Calculate all the drones violating the no-fly zone.
    - Sends the violating drones to the backend.

- ### Backend
    - Receive drone location data from the polling service.
    - Gets contact information for the pilots that drones have violated the no-fly zone.
    - Adds all of the pilots and their drones to the database.
    - Streams non-expired pilot and drone information to the frontend in a Server-sent event manner.
    - Remove clutter/expired information from the database every 5th minute.

- ### Frontend
    - Receives necessary data from the backend and displays it.
    - Let's just say that the UI isn't the fanciest, but it works :).

## Installing / Getting started

### Clone the project

Clone the project to your local environment and navigate to the root of the project:

```
git clone git@github.com:D3lux3/ReaktorBirdnest.git
cd ReaktorBirdnest
```


### Docker-compose

The docker-compose file has been set up to be ready to go for local testing with all the ENVs already set up.

Run this command in the project root:

```
docker-compose up
```

### Ready!

Now head to **[localhost:3001](http://localhost:3001/)** to see the project in action.

---
