# Overview

I created this demo project to showcase something similar to a project I worked on at [Titan](https://titan.com). It is a JSON powered form component. The form iterates through an array of steps that can be defined in your app or on a server, and it validates form values using a JSON document structured according to the [JSON Schema standard](https://json-schema.org). This implementation separates the form's business logic from client-side rendering logic, which allows developers to quickly create new forms or edit existing ones, without needing to modify the front-end code; simply add a new step to your array, or update the validation logic in your JSON document. Similarly, new form components can be created, or existing ones edited, without breaking existing functionality. 

Some possible use cases for this might be:
- Creating multiple different forms for different customer needs, with minimal modifications to client-side code.
- Seamlessly A/B test form copy, questions, question order, etc.
- Easily create many different "paths" within a single form by utilizing custom branching logic that is supported by JSON schema - `if`, `then`, `else`, `allOf`, `anyOf`, and more.

Check out `src/data/mock-onboarding-form.ts` to see how the form steps and schema are set up.

## Demo
Play around with the form to test different paths. First check out the Pharmacy Technician path, and then the Medical Assistant one, to see how the form varies when different options are selected. 

On each page, use the buttons on the right to check out some of the JSON that is powering the form.

Once you get to the Enter Address part of the form, press the "Add a form step" button at the right, to add a conditional step that will only show if you choose your state of residency to be `Washington` or `South Carolina`. In practice, this is how easy it would be for a developer (or anyone) to add a new step to the form.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
