import React, { Component } from "react";

// import { MenuIcon, ListItem, Drawer, List, IconButton } from '@mui/material';
import TimePicker from 'react-time-picker';
import TextField from '@mui/material/TextField';

export default class ActivityRow extends Component {
	static MaxEndingMinute = 2359;

	constructor(props) {
		super(props);
		this.state = {
		  startingTime: this.props.startingTime,
		  endingTime: this.props.endingTime,
		  descr: this.props.descr,
		  completedWith: this.props.completedWith,
		  satisfaction: this.props.satisfaction,
		  isRetrospective: this.props.isRetrospective,
		  purpose:this.props.purpose
		};
		this.startingTimeChanged = this.startingTimeChanged.bind(this);
		this.endingTimeChanged = this.endingTimeChanged.bind(this);
		this.purposeChanged = this.purposeChanged.bind(this);
		this.isRetroChanged = this.isRetroChanged.bind(this);
		this.completedWithChanged = this.completedWithChanged.bind(this);
		this.descrChanged = this.descrChanged.bind(this);
	  }

	startingTimeChanged(newVal){ 	this.setState({ startingTime: newVal });  }
	endingTimeChanged(newVal){ 		this.setState({ endingTime: newVal });  }
	purposeChanged(event){ 			this.setState({ purpose: event.target.value });  }
	isRetroChanged(event){ 			this.setState({ isRetrospective: event.target.value });  }
	satisfactionChanged(event){  	this.setState({ satisfaction: event.target.value });  }
	completedWithChanged(event){  	this.setState({ completedWith: event.target.value });  }
	descrChanged(event){  			this.setState({ descr: event.target.value });  }

	render() {
		return (
			<div>
				<TimePicker
					onChange={this.startingTimeChanged}
					value={this.state.startingTime}
					disableClock={true}
					clearIcon={null}
				/>
				<TimePicker
					onChange={this.endingTimeChanged}
					value={this.state.endingTime}
					disableClock={true}
					clearIcon={null}
				/>

                <TextField onChange={this.descrChanged} value={this.state.descr} label="Description" variant="standard" />
                <TextField onChange={this.purposeChanged} value={this.state.purpose} label="Purpose" variant="standard" />
                <TextField onChange={this.completedWithChanged} value={this.state.completedWith} label="Completed With" variant="standard" />
                <TextField onChange={this.satisfactionChanged} value={this.state.satisfaction} type='number' inputProps={{ max: 100 }}
				 label="Satisfaction Expected" variant="standard" />

			</div>
		);
	}
}
