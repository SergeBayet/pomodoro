import React from "react";
import "./App.css";
import accurateInterval from "accurate-interval";


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
	constructor(props) {
		super(props);
		this.state = {
			breakLength: 5,
			sessionLength: 25,
			timerType: 'Session',
			timerState: 'stopped',
			timer: 1500,
			intervalID: '',
			alarmColor: { color: 'white' }
		}
	}
	setBreakLength = (e) => {
		this.lengthControl('breakLength', e.currentTarget.value, this.state.breakLength, 'Break');
	}
	setSessionLength = (e) => {
		this.lengthControl('sessionLength', e.currentTarget.value, this.state.sessionLength, 'Session');
	}
	lengthControl = (stateToChange, sign, currentLength, timerType) => {
		if (this.state.timerState === 'running') return;
		if (this.state.timerType !== timerType) {
			if (sign === "-" && currentLength !== 1) {
				this.setState({ [stateToChange]: currentLength - 1 });
			} else if (sign === "+" && currentLength !== 60) {
				this.setState({ [stateToChange]: currentLength + 1 });
			}
		} else {
			if (sign === "-" && currentLength !== 1) {
				this.setState({
					[stateToChange]: currentLength - 1,
					timer: currentLength * 60 - 60
				});
			} else if (sign === "+" && currentLength !== 60) {
				this.setState({
					[stateToChange]: currentLength + 1,
					timer: currentLength * 60 + 60
				});
			}
		}
	}
	timerControl = () => {
		if (this.state.timerState === 'stopped') {
			this.beginCountDown();
			this.setState({ timerState: 'running' });
		}
		else {
			this.setState({ timerState: 'stopped' });
			this.state.intervalID && this.state.intervalID.clear();
		}

	}
	beginCountDown = () => {
		this.setState({
			intervalID: accurateInterval(() => {
				this.decrementTimer();
				this.phaseControl();
			}, 1000)
		})
	}
	decrementTimer = () => {
		this.setState({
			timer: this.state.timer - 1
		})
	}
	phaseControl = () => {
		let timer = this.state.timer;
		this.warning(timer);
		this.buzzer(timer);
		if (timer < 0) {
			if (this.state.timerType === 'Session') {
				this.state.intervalID && this.state.intervalID.clear();
				this.beginCountDown();
				this.switchTimer(this.state.breakLength * 60, 'Break');
			} else {
				this.state.intervalID && this.state.intervalID.clear();
				this.beginCountDown();
				this.switchTimer(this.state.sessionLength * 60, 'Session');
			}
		}
	}
	warning = (timer) => {
		if (timer < 61) {
			this.setState({
				alarmColor: { color: 'red' }
			})
		}
		else {
			this.setState({
				alarmColor: { color: 'white' }
			})
		}
	}
	buzzer = (timer) => {
		if (timer === 0) {
			this.audioBeep.play();
		}
	}
	switchTimer = (num, str) => {
		this.setState({
			timer: num,
			timerType: str,
			alarmColor: { color: 'white' }
		})
	}
	reset = () => {
		this.setState({
			breakLength: 5,
			sessionLength: 25,
			timerState: 'stopped',
			timerType: 'Session',
			timer: 1500,
			intervalID: '',
			alarmColor: { color: 'white' }
		});
		this.state.intervalID && this.state.intervalID.clear();
		this.audioBeep.pause();
		this.audioBeep.currentTime = 0;
	}
	clockify = () => {
		let minutes = Math.floor(this.state.timer / 60);
		let seconds = this.state.timer - minutes * 60;
		seconds = seconds < 10 ? '0' + seconds : seconds;
		minutes = minutes < 10 ? '0' + minutes : minutes;
		return minutes + ':' + seconds;
	}
	render() {
		return (
			<div>
				<div className="pomodoro-timer">
					<div className="time-length-control">
						<TimerLengthControl
							id="break-label"
							title="Break length"
							decrementId="break-decrement"
							incrementId="break-increment"
							lengthId="break-length"
							length={this.state.breakLength}
							onClick={this.setBreakLength}
						/>
						<TimerLengthControl
							id="session-label"
							title="Session length"
							decrementId="session-decrement"
							incrementId="session-increment"
							lengthId="session-length"
							length={this.state.sessionLength}
							onClick={this.setSessionLength}
						/>
					</div>

				</div>
				<div className="timer" style={this.state.alarmColor}>
					<div className="timer-wrapper">
						<div id='timer-label'>
							{this.state.timerType}
						</div>
						<div id='time-left'>
							{this.clockify()}
						</div>
					</div>
				</div>
				<div className="timer-control">
					<button id="start_stop" onClick={this.timerControl}>
						<i className="fa fa-play fa-2x" />
						<i className="fa fa-pause fa-2x" />
					</button>
					<button id="reset" onClick={this.reset}>
						<i className="fa fa-refresh fa-2x" />
					</button>
				</div>
				<audio id="beep" preload="auto"
					src="https://goo.gl/65cBl1"
					ref={(audio) => { this.audioBeep = audio; }} />
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
					<button className="btn-level" value="-" id={this.props.decrementId} onClick={this.props.onClick}>
						<i className="fa fa-arrow-down"></i>
					</button>
					<span id={this.props.lengthId}>{this.props.length}</span>
					<button className="btn-level" value="+" id={this.props.incrementId} onClick={this.props.onClick}>
						<i className="fa fa-arrow-up"></i>
					</button>
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
