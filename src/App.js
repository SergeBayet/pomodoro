import React from "react";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <PomodoroTimer />
        <Footer />
      </div>
    );
  }
}

class PomodoroTimer extends React.Component {
  render() {
    return (
      <div className="pomodoro-timer">
        <div className="time-length-control">
          <TimerLengthControl
            id="break-label"
            title="Break length"
            decrement="break-decrement"
            increment="break-increment"
            length="break-length"
          />
          <TimerLengthControl
            id="session-label"
            title="Session length"
            decrement="session-decrement"
            increment="session-increment"
            length="session-length"
          />
        </div>
      </div>
    );
  }
}

class TimerLengthControl extends React.Component {
  render() {
    return (
      <div id={this.props.id}>
        <h2>{this.props.title}</h2>
        <div className="controls">
          <span id={this.props.decrement}>
            <i className="fa fa-arrow-down"></i>
          </span>
          <span id={this.props.length}>05:00</span>
          <span id={this.props.increment}>
            <i className="fa fa-arrow-up"></i>
          </span>
        </div>
      </div>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <header>
        <div className="title">
          <h1>Pomodoro Timer</h1>
        </div>
        <div className="society">
          <h1>BeCode</h1>
        </div>
      </header>
    );
  }
}

class Footer extends React.Component {
  render() {
    return (
      <footer>
        <div className="copyright">Copyright 2019. Serge Bayet</div>
      </footer>
    );
  }
}

export default App;
