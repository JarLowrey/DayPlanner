import React, { Component } from "react";

// import { MenuIcon, ListItem, Drawer, List, IconButton } from '@mui/material';
import TimePicker from 'react-time-picker';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import EmotionSelector from "../EmotionSelector";
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

export default class ActivityRow extends Component {
	static MaxEndingMinute = 2359;

	constructor(props) {
		super(props);
		this.state = {
		  startingTime: this.props.startingTime,
		  endingTime:  this.props.endingTime,
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
		this.satisfactionChanged = this.satisfactionChanged.bind(this);
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


	static valueLabelFormat(value) {	
		return `${value}% Pleasure, ${100-value}% Mastery`;
	}
	
	render() {
		return (
			<div>
				<FormControl >
					<FormLabel>Start</FormLabel>
					<TimePicker
						onChange={this.startingTimeChanged}
						value={this.state.startingTime}
						disableClock={true}
						clearIcon={null}
						nativeInputAriaLabel="Start"
					/>
				</FormControl>	
				<FormControl >
					<FormLabel>End</FormLabel>
					<TimePicker
						onChange={this.endingTimeChanged}
						value={this.state.endingTime}
						disableClock={true}
						clearIcon={null}
						nativeInputAriaLabel="End"
					/>
				</FormControl>
				<EmotionSelector onChange={this.satisfactionChanged} value={this.state.satisfaction} title="Pride 🥇" />
				<EmotionSelector onChange={this.satisfactionChanged} value={this.state.satisfaction} title="Labor ⚙️" />
                <TextField onChange={this.descrChanged} value={this.state.descr} label="Description" variant="standard" />
				<FormControl style={{padding:"0 40px"}}>
					<FormLabel>Purpose</FormLabel>
					<Box width={150}>
						<Slider 
							sx={{'.MuiSlider-rail':{opacity:1}, '.MuiSlider-track':{height:"2px"}, '.MuiSlider-markLabel': {color:"rgba(0, 0, 0, 0.87)"}}} 
							defaultValue={50} aria-label="Default" 
							valueLabelDisplay="auto" valueLabelFormat={ActivityRow.valueLabelFormat} 
							marks={[{value:0, label:"Pleasure"}, {value:100, label:"Mastery"}]}
							step={5}
							/>
					</Box>
				</FormControl>
                <TextField onChange={this.completedWithChanged} value={this.state.completedWith} label="Completed With" variant="standard" />

			</div>
		);
	}
}