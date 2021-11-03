import React, { Component } from "react";

import IconButton from '@mui/material/IconButton';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import addDays from 'date-fns/addDays';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Stack from "@mui/material/Stack";

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

import ActivityRow from "../ActivityRow";
import { callServer } from "../../utils/util";

export default class Schedule extends Component {

	constructor(props) {
		super(props);
		this.state = {
            date: new Date(),
			activities:[],
			isLoading:false
		}; 
		this.moveBackOneDay=this.moveBackOneDay.bind(this);
		this.moveForwardOneDay=this.moveForwardOneDay.bind(this);
		this.dayChanged=this.reloadActivities.bind(this);
		this.userChangedDay=this.userChangedDay.bind(this);
		this.reloadActivities=this.reloadActivities.bind(this);
	  }
	
	componentDidMount(){
		this.reloadActivities();
	}
    moveBackOneDay(){
        this.setState({ date: addDays(this.state.date, -1) });
		this.reloadActivities();
    }
    moveForwardOneDay(){
        this.setState({ date: addDays(this.state.date, 1) });
		this.reloadActivities();
    }
	async reloadActivities(){
		this.setState({isLoading:true});

		await callServer(`mutation { login(email:"test@example.com",password:"helloBUDDY1@") }`);
		let actsResult = await callServer(`query { getSchedulesFromDate (date: "${ this.state.date.toISOString() }" ) { items { id,startingTime, endingTime, descr, completedWithGroup, satisfaction, difficulty, isRetrospective, purpose} } } `);


		let activities = [];
		if(actsResult.data.getSchedulesFromDate.length > 0){
			activities = actsResult.data.getSchedulesFromDate[0].items;
		}else{
			activities = Schedule.getNewSchedule();
		}
		let date = '01/01/2021 ';
		activities.sort((x,y)=>new Date(date+x.startingTime) - new Date(date+y.startingTime));
		this.setState({activities: activities, isLoading:false});
		console.log(activities);
	}
	userChangedDay(d){
		this.setState({ date: d });
		this.reloadActivities();
	}

	static getNewSchedule(){
		let defaultAwake = "07:00:00";
		let defaultAsleep = "22:00:00";

		let defaultActivities = {
				descr: "",
				completedWithGroup:"",
				purpose: false,
				isRetrospective: false,
		};

		let startHr = parseInt(defaultAwake.split(":"));
		let endHr = parseInt(defaultAsleep.split(":"));
		let activities = [];
		for(let i=startHr;i<endHr;i++){
			activities.push(Object.assign({ id:i+"1", startingTime: i+":00:00", endingTime: (i+1)+":00:00" }, defaultActivities))
			// activities.push(Object.assign({ id:i+"2", startingTime: i+":30:00", endingTime: (i+1)+":00:00" }, defaultActivities))
		}
		return activities;
	}

	render() {

		let rows = [];
		
		let acts = this.state.activities;
		acts.forEach((x,i) => {
			let len = acts.length;
			let minTime = (i === len-1 && len > 1) ? acts[len - 2].startingTime : "00:00:00";
			let maxEnd = (i === 0 && len > 1) ? acts[1].startingTime : "23:59:00";
			if(i > 0 && i < len-1){
				minTime = acts[i-1].endingTime;
				maxEnd = acts[i+1].startingTime;
			}
			let row = (
				<ActivityRow 
					reloadActivities={this.reloadActivities}
					key={x.id}
					minStart={minTime} 
					maxEnd={maxEnd} {...x} />
			);
			rows.push(row);
		});

		let body = !this.isLoading ? (		
		<Stack spacing={5}>
			{rows}
		</Stack> 
		)
			: 
		(
			<div style={{margin:"auto", width:"55px"}}> <CircularProgress /> </div>
		);
		return (
            <div>
                <div style={{ margin:"20px auto", width:"247px"}}>
                    <IconButton
                        color="inherit"
                        aria-label="Move back one day"
                        onClick={this.moveBackOneDay}
                    >
                        <ChevronLeft />
                    </IconButton>


					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							label=""
							value={this.state.date}
							onChange={this.userChangedDay}
							// maxDate={endOfTomorrow()}
                        	// minDate={new Date(2021,1,10)}
							renderInput={(params) => <TextField style={{width:"160px"}} {...params} />}
						/>
					</LocalizationProvider>

                    <IconButton
                        color="inherit"
                        aria-label="Move forward one day"
                        onClick={this.moveForwardOneDay}
                    >
                        <ChevronRight />
                    </IconButton>
                </div>
				{ body }
            </div>
		);
	}
}
