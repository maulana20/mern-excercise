import React from 'react';
import { connect } from 'react-redux';

const Notifications = ({ notification: { notifications } }) => {
  const showNotification = (notification) => {
    if (notification.content) {
      return (
        <li className="list-group-item">
          <span className="badge badge-primary badge-pill">{notification.author}</span>
          {notification.content}
        </li>
      );
    } else {
      return (<li className="list-group-item">-- no message --</li>);
    }
  };
  
  return (
    <section className="container">
      <p className="lead">
        Notifications
      </p>
      <div className="notifications">
        <ul className="list-group" style={{ fontSize: "12px" }}>
          {notifications.map((notification) => showNotification(notification))}
        </ul>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  notification: state.notification
});

export default connect(mapStateToProps, {})(Notifications);
