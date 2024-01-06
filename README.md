# ToDoApp

Task organizer written using MERN Stack.

[Live Demo](https://euphonious-stardust-4452c0.netlify.app)

![](client/src/images/preview.png)

## Features
* Log in / registration system
* Editing account
* Adding and editing projects - list of tasks
* Adding and editing tasks
* Drag&Drop

## Tech Stack
* React.js
* react-beautiful-dnd
* AntDesign
* Bootstrap Icons
* Node.js
* Express.js
* MongoDB

## How to run locally

```bash
git clone https://github.com/jakubd255/ToDoApp.git
```

1. Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

2. Create a MongoDB database
3. Set up environmental variables

Create a **.env** inside the **server** drirectory and configure it with the necessary environmental variables

```
PORT = 8000
MONGO_URI = URI_TO_YOUR_MONGO_DATABASE
ACCESS_TOKEN = RANDOM_STRING
```

4. Run the application

```bash
# In the server directory
npm start

# In the client directory
npm run dev
```