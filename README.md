<pre><details>
<summary>Folder structure, click here</summary>
src/
├─ api/
│  ├─ controllers/
│  │  ├── authController.ts
│  │  ├── carController.ts
│  │  ├── reservationController.ts
│  │  └── userController.ts
│  ├─ helpers/
│  │  ├── errorHandler.ts
│  │  └── validateID.ts
│  ├─ repositories/
│  │  ├── carRepository.ts
│  │  ├── reservationRepository.ts
│  │  └── userRepository.ts
│  ├─ schemas/
│  │  ├── ICar.ts
│  │  ├── IReserve.ts
│  │  └── IUser.ts
│  ├─ services/
│  │  ├── carService.ts
│  │  ├── reservationService.ts
│  │  └── userService.ts
│  └─ routes/
│     ├── carRoutes.ts
│     ├── reservationRoutes.ts
│     └── userRoutes.ts
├─ app.ts
├─ swagger.json
├─ server.ts
├─ .editorconfig
├─ .eslintconfig.js
├─ .gitignore
├─ .prettierrc
├─ config.env
├─ package.json
├─ README.md
└─ tsconfig.json
</details>
</pre>

After cloning this repository, in you terminal type 
``` npm install ``` to install all of the project's dependencies

All files are in typescript, hence, we need to use ```tws -w``` this will generate the dist folder



Afiter tws -w we need to start the server, navigate to third-challenge/dist and then type ```nodemon server.js```



We'll be using postman to accessing the routes, and mongoDB to data persistency
[Here is the link to postman documentation fo the api](https://documenter.getpostman.com/view/25704905/2s93XsXkcn), a config.env will be avaliable for the evaluation of this callenge, but it will be removed later after it.


## User routes

This routes manages all the users related operations

<details>
<summary><strong></strong><em>Click here to expand the user endpoints</em></summary>
<br>
<h3>User endpoints</h3>

- `POST /users `- creates a new user
- `PUT /users/:id `- updates an existing user with the specified `id`
- `DELETE /users/:id `- removes an existing user with the specified `id`
- `GET /users/:id `- retrieves the details of an existing user with the specified `id`
- `GET /users `- lists all existing users
</details>
The validateID('user') middleware is used to validate the id parameter of the endpoints that require it.

<br><hr>
## Car routes

This routes manages all the cars related operations 


<details>
<summary><strong></strong><em>Click here to expand the car endpoints</em></summary>
<br>
<h3>Car endpoints</h3>

- `POST /car` - creates a new car
- `PUT /car/:id` - updates an existing car with the specified `id`
- `DELETE /car/:id` - removes an existing car with the specified `id`
- `GET /car/:id` - retrieves the details of an existing car with the specified `id`
- `GET /car` - lists all existing cars
- `PUT /car/:carId/accessories/:accessoryId` - updates an accessory for an existing car with the specified `carId` and `accessoryId`
</details>

<br><hr>

## Reservation routes

This endpoints manage the reservation, to create a reservation the user **must** me logged in
<details>
<summary><strong></strong><em>Click here to expand the reservation endpoints</em></summary>
<br>
<h3>Reservation endpoints</h3>
 
- `POST /authenticate` - authenticates a user and generates a JWT token
- `POST /reserve` - creates a new reservation
- `PUT /reserve/:id` - updates an existing reservation with the specified id
- `DELETE /reserve/:id` - removes an existing reservation with the specified id
- `GET /reserve/:id` - retrieves the details of an existing reservation with the specified id
- `GET /reserve` - lists all existing reservations
</details>

The authController.passToken middleware is used to pass the JWT token for authenticated endpoints, and the validateID('reservation') middleware is used to validate the id parameter of the endpoints that require it.


<h2>Known issues:</h2>

<ul>
  <li>When updating a reservation, there are inconsistencies in the value calculation. If the user reduces the number of days of the reservation, the values may be incorrect. Additionally, changes in the start and end dates can also cause inconsistencies.</li>
  <li>During development, I had a problem with IUser, userService, and userController. I did not correctly export the user interface, which did not immediately cause issues but was noticed in the last hours of the challenge. I had to refactor all the code that needed the user interface types, which may have left the code inconsistent.</li>
  <li>Due to changes in the code, the reservation registration may be inconsistent.</li>
  <li>The updateAccessoryController, located in carController.ts
<pre>src/
├─ api/
│  ├─ controllers/
│  │  
   └──── carController.ts     << here line 103</pre>

, was not divided into repository and service, causing inconsistencies in the design pattern of the code.</li>
</ul>
Next steps:

<ul>
  <li>Continue the development of the application, refactoring the code to make it cleaner and more organized, using classes and their instances correctly, and applying the Controller-Service-Repository pattern consistently.</li>
  <li>Implement tests to ensure code quality.</li>
  <li>Pay more attention during commits, to commit small and with quality.</li>
  <li>After testing and being free of errors, deploy the application. 
  An untested application can be unstable and unpredictable, which generates costs and wastes valuable application time.</li>
</ul>