import React, { Component } from "react";

import ScheduleList from "../ScheduleList";

import IconButton from '@mui/material/IconButton';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import addDays from 'date-fns/addDays';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';

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
		this.dayChanged=this.dayChanged.bind(this);
		this.userChangedDay=this.userChangedDay.bind(this);
	  }
	
	componentDidMount(){
		this.dayChanged();
	}
    moveBackOneDay(){
        this.setState({ date: addDays(this.state.date, -1) });
		this.dayChanged();
    }
    moveForwardOneDay(){
        this.setState({ date: addDays(this.state.date, 1) });
		this.dayChanged();
    }
	dayChanged(){
		this.setState({isLoading:true});

		fetch(process.env.REACT_APP_API_BASE_URL + "graphql",{
			method: 'POST',
			credentials: 'include',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			  query: `mutation { login(email:"test@example.com",password:"helloBUDDY1@") }`,
			}),
		})
		.then(res => res.json())
		.then(
		  (result) => {
			  let query =  `query { getSchedulesFromDate (date: "${ this.state.date.toISOString() }" ) { items { id,startingTime, endingTime, descr, completedWithGroup, satisfaction, difficulty, isRetrospective } } } `;
			 console.log(query); 
			  fetch(process.env.REACT_APP_API_BASE_URL + "graphql",{
						method: 'POST',
						credentials: 'include',
						headers: {
						'Content-Type': 'application/json',
						},
						body: JSON.stringify({
						query: query,
					}),
				})
				.then(res => res.json())
				.then(
				(result) => {
					let activities = [];
					if(result.data.getSchedulesFromDate.length > 0){
						activities = result.data.getSchedulesFromDate[0].items;
					}else{
						activities = Schedule.getNewSchedule();
					}
					let date = '01/01/2021 ';
					activities.sort((x,y)=>new Date(date+x.startingTime) - new Date(date+y.startingTime));
					this.setState({activities: activities, isLoading:false});
					console.log(activities);
				},
				(error) => {
					console.log(error);
				}
				)
		  },
		  (error) => {
			  console.log(error);
		  }
		) 
	}
	userChangedDay(d){
		this.setState({ date: d });
		this.dayChanged();
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
		let body = !this.isLoading ? <ScheduleList  rows={this.state.activities} /> : (<div style={{margin:"auto", width:"55px"}}> <CircularProgress /> </div>);
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
