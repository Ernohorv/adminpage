import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase';
import '@firebase/firestore';
import { FirestoreProvider } from "react-firestore";

    var config = {
      apiKey: 'AIzaSyDgyEuBEzyqCWfaFQwwx0CwHsyp8AH_Yw8',
      authDomain: 'react-native-test-b5bec.firebaseapp.com',
      databaseURL: 'https://react-native-test-b5bec.firebaseio.com',
      projectId: 'react-native-test-b5bec',
      storageBucket: 'react-native-test-b5bec.appspot.com',
      messagingSenderId: '1059337201276'
    };

firebase.initializeApp(config);

ReactDOM.render(
    <FirestoreProvider firebase={firebase}>
    <App />
  </FirestoreProvider>,
document.getElementById('root'));
registerServiceWorker();
