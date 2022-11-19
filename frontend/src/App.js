import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import cryptoJS from 'crypto-js';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import ProfileForm from './components/profile-forms/ProfileForm';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
import NotFound from './components/layout/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';
import { setAlert } from './actions/alert';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';

import './App.css';

const App = () => {
  const socket = io(`http://localhost:${window.__RUNTIME_CONFIG__.WEBSOCKET_PORT}`);
  useEffect(() => {
    // will get a 401 response from our API
    store.dispatch(loadUser());
    socket.on("notification", (response) => {
      console.log('- Received', response);
      const bytes = cryptoJS.AES.decrypt(response, window.__RUNTIME_CONFIG__.CRYPTO_KEY);
      const result = JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
      console.log('- Decrypt', result);
      store.dispatch(setAlert(result.message, "success"));
    });
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Alert />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="profiles" element={<Profiles />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route
            path="dashboard"
            element={<PrivateRoute component={Dashboard} />}
          />
          <Route
            path="create-profile"
            element={<PrivateRoute component={ProfileForm} />}
          />
          <Route
            path="edit-profile"
            element={<PrivateRoute component={ProfileForm} />}
          />
          <Route
            path="add-experience"
            element={<PrivateRoute component={AddExperience} />}
          />
          <Route
            path="add-education"
            element={<PrivateRoute component={AddEducation} />}
          />
          <Route path="posts" element={<PrivateRoute component={Posts} />} />
          <Route path="posts/:id" element={<PrivateRoute component={Post} />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
