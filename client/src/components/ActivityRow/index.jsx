import React, { Component } from "react";

// import { MenuIcon, ListItem, Drawer, List, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import EmojiSelector from "../EmojiSelector";
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

import { max as dateMax, min as dateMin} from 'date-fns';

import TimePicker from '@mui/lab/TimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { callServerDebounced,getTimeFromDate } from "../../utils/util";

export default class ActivityRow extends Component {
	static MaxEndingMinute = 2359;

	constructor(props) {
		super(props);
		this.state = {
		  startingTime: new Date("2014-08-18T"+this.props.startingTime),
		  endingTime:  new Date("2014-08-18T"+this.props.endingTime),
		  descr: this.props.descr,
		  completedWithGroup: this.props.completedWithGroup,
		  satisfaction: this.props.satisfaction,
		  difficulty: this.props.difficulty,
		  isRetrospective: this.props.isRetrospective,
		  purpose:this.props.purpose
		};
		this.startingTimeChanged = this.startingTimeChanged.bind(this);
		this.endingTimeChanged = this.endingTimeChanged.bind(this);
		this.purposeChanged = this.purposeChanged.bind(this);
		this.isRetroChanged = this.isRetroChanged.bind(this);
		this.satisfactionChanged = this.satisfactionChanged.bind(this);
		this.difficultyChanged = this.difficultyChanged.bind(this);
		this.completedWithGroupChanged = this.completedWithGroupChanged.bind(this);
		this.descrChanged = this.descrChanged.bind(this);
		this.updateActivity = this.updateActivity.bind(this);
	}

	startingTimeChanged(newVal){ 		this.setState({ startingTime: newVal }, this.updateActivity);  }
	endingTimeChanged(newVal){ 			this.setState({ endingTime: newVal }, this.updateActivity);  }
	purposeChanged(event){ 				this.setState({ purpose: event.target.value }, this.updateActivity);  }
	isRetroChanged(event){ 				this.setState({ isRetrospective: event.target.value }, this.updateActivity);  }
	satisfactionChanged(event){  		this.setState({ satisfaction: event.target.value }, this.updateActivity);  }
	difficultyChanged(event){  			this.setState({ difficulty: event.target.value }, this.updateActivity);  }
	completedWithGroupChanged(event){	this.setState({ completedWithGroup: event.target.value }, this.updateActivity);  }
	descrChanged(event){  				this.setState({ descr: event.target.value }, this.updateActivity);  }

	static valueLabelFormat(value) {	
		return `${value}% Pleasure, ${100-value}% Mastery`;
	}
	
	async updateActivity(){
		let stateCopy = Object.assign({},this.state);
		stateCopy.startingTime = getTimeFromDate(stateCopy.startingTime);
		stateCopy.endingTime = getTimeFromDate(stateCopy.endingTime);
		let q = `mutation { updateActivity (existingObjId: "${this.props.id}", obj: {
			startingTime: "${stateCopy.startingTime}",
			endingTime: "${stateCopy.endingTime}",
			descr: "${stateCopy.descr}",
			completedWithGroup: ${stateCopy.completedWithGroup},
			satisfaction: ${stateCopy.satisfaction},
			difficulty: ${stateCopy.difficulty},
			isRetrospective: ${stateCopy.isRetrospective},
			purpose: ${stateCopy.purpose},
		}) {id}}`;
		await callServerDebounced(q);
		await this.props.reloadActivities();
	}
	
	render() {
		const showMinInterface = false;
		let additionalInputs = (showMinInterface) ? null : (
			<div>
				<EmojiSelector onChange={this.satisfactionChanged} value={this.state.satisfaction} title="Pride 🥇" />
				<EmojiSelector isSize onChange={this.difficultyChanged} value={this.state.difficulty} title="Labor ⚙️" />

				<FormControl style={{padding:"0 40px"}}>
					<FormControlLabel
						value="Purpose"
						control={
							<Box width={110}>
							<Slider 
								sx={{'.MuiSlider-rail':{opacity:1}, '.MuiSlider-track':{height:"2px"}, '.MuiSlider-markLabel': {color:"rgba(0, 0, 0, 0.87)"}}} 
								defaultValue={50} aria-label="Default" 
								onChange={this.purposeChanged}
								value={this.state.purpose}
								valueLabelDisplay="auto" valueLabelFormat={ActivityRow.valueLabelFormat} 
								marks={[{value:0, label:"Pleasure"}, {value:100, label:"Mastery"}]}
								step={5}
								/>
						</Box>
						}
						label="Purpose"
						labelPlacement="top"
						/>
				</FormControl>
				
				<FormControl>
					<FormControlLabel
					value="Completed With Group"
					control={<Switch color="primary" onChange={this.completedWithGroupChanged} value={this.state.completedWithGroup}/>}
					label="With Group"
					labelPlacement="top"
					/>
				</FormControl>
			</div>
		);


		return (
			<div style={{margin:"10px auto"}}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<TimePicker
						label="Start 🏁"
						value={this.state.startingTime}
						ampm={false}
						onChange={this.startingTimeChanged}
						minTime={new Date("2014-08-18T"+this.props.minStart)}
						maxTime={new Date("2014-08-18T"+this.state.endingTime)}
						renderInput={(params) => <TextField style={{width:"120px"}} {...params} />}
					/>

					<TimePicker
						label="Stop 🛑"
						ampm={false}
						value={this.state.endingTime}
						onChange={this.endingTimeChanged}
						minTime={new Date("2014-08-18T"+this.state.startingTime)}
						maxTime={new Date("2014-08-18T"+this.props.maxEnd)}
						renderInput={(params) => <TextField style={{width:"120px"}} {...params} />}
					/>
				</LocalizationProvider>

                <TextField onChange={this.descrChanged} value={this.state.descr} label="Description 🖊️" />
				
				{ additionalInputs }
			</div>
		);
	}
}