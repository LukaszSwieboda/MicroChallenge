Micro Challenge App
Micro Challenge is an app for creating and managing mini-challenges. Users can add their own challenges, randomly select them, and track which ones they've already completed. The app is designed to help users achieve small goals and challenges in their daily lives.

Features
Add challenges: Users can add their own challenges to the list.
Randomly select challenges: Ability to randomly pick one challenge for the day.
Track completed challenges: Users can mark challenges as completed and track how many they have accomplished.
Edit existing challenges: Users can edit the challenges they have already added.
Delete challenges: Users can delete challenges that are no longer needed.

Technologies
React – for building the user interface.
React Router – for navigation between pages.
React Hooks – for managing the app’s state.
GitHub Pages – for hosting the app.

Planned Development
The app will be developed further using the following technologies:
Zustand – for advanced state management.
React Query – for data management, such as synchronizing state with a server and handling API requests.

Installation
Clone the repository

To get started, clone the repository:
git clone https://github.com/LukaszSwieboda/MicroChallenge.git

Install dependencies

In the project’s root folder, run:
npm install

Run the app locally
After installing the dependencies, run the app on your local machine:
npm start
The app will be available at: http://localhost:3000/.

Deploy to GitHub Pages
To publish the app to GitHub Pages, follow these steps:

Install the gh-pages dependency:
npm install gh-pages --save-dev

Add the following scripts to your package.json:
In the scripts section, add:
"homepage": "https://YourUsername.github.io/MicroChallenge",
"scripts": {
"predeploy": "npm run build",
"deploy": "gh-pages -d build",
"start": "react-scripts start",
"build": "react-scripts build",
"test": "react-scripts test",
"eject": "react-scripts eject"
}
Run the following command to deploy the app:
npm run deploy
Your app will be available at: https://YourUsername.github.io/MicroChallenge.

How the app works?
On the homepage (/), users can add new challenges to the list.
On the Draw Challenge page (/draw), users can randomly select one challenge for the day.
In the Completed Challenges section (/completed), users can see all the challenges they have already completed.
The app allows editing existing challenges and deleting challenges.

Future Extensions
Expand the challenge addition feature to include thematic categories.
Add a reward system for completed challenges.
Time for challenge completion – the ability to set a time limit for each challenge.
