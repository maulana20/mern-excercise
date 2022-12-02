import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
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
import Notifications from './components/notifications/Notifications';
import NotFound from './components/layout/NotFound';
import PrivateRoute from './components/routing/PrivateRoute';
import { setAlert } from './actions/alert';
import { ADD_NOTIFICATION } from './actions/types';

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
    socket.on("notification", (notification) => {
      notification = JSON.parse(notification);
      if (notification.content) {
        store.dispatch(setAlert(notification.content, "success"));
        store.dispatch({ type: ADD_NOTIFICATION, payload: notification });
      } else {
        apiDecrypt(notification);
      }
    });
  }, []);
  
  const apiDecrypt = async (data) => {
    if (!data.message) return false;
    await axios.post(
      `https://challenges.aqi.co.id/api/microservices/decrypt/${data.key}`,
      { message: data.message },
      { headers : { Authorization: `Bearer ${window.__RUNTIME_CONFIG__.AQI_TOKEN}` } }
    ).then(response => {
      var notification = {};
      if (response.data.result) {
        notification = response.data.result;
        store.dispatch(setAlert(response.data.result.content, "success"));
      }
      store.dispatch({ type: ADD_NOTIFICATION, payload: notification });
    });
  }

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
          <Route path="notifications" element={<Notifications />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
