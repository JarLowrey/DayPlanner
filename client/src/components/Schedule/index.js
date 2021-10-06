import React, { Component } from "react";

import DatePicker from 'react-date-picker'
import ScheduleList from "../ScheduleList";

import IconButton from '@mui/material/IconButton';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import addDays from 'date-fns/addDays';
import CircularProgress from '@mui/material/CircularProgress';

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
			  console.log(result)
			  fetch(process.env.REACT_APP_API_BASE_URL + "graphql",{
					method: 'POST',
					credentials: 'include',
					headers: {
					'Content-Type': 'application/json',
					},
					body: JSON.stringify({


			// id
			// startingTime: new Date(),
			// endingTime: new Date(),
			// descr: 'asdasd',
			// completedWith: 'asd',
			// satisfaction: 0,
			// isRetrospective: false,
			// purpose:'aaa'

					query: `query { getSchedulesFromDate (date: "${ this.state.date.toISOString() }" ) { items { id,startingTime, endingTime, descr, completedWith, satisfaction, isRetrospective } } } `,
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
					this.setState({activities: activities, isLoading:false});
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
				completedWith:"",
				purpose: false,
				isRetrospective: false,
		};

		let startHr = parseInt(defaultAwake.split(":"));
		let endHr = parseInt(defaultAsleep.split(":"));
		let activities = [];
		for(let i=startHr;i<endHr;i++){
			activities.push(Object.assign({ id:i+"1", startingTime: i+":00:00", endingTime: i+":30:00" }, defaultActivities))
			activities.push(Object.assign({ id:i+"2", startingTime: i+":30:00", endingTime: (i+1)+":00:00" }, defaultActivities))
		}
		console.log(activities)
		return activities;
	}

	render() {
		let body = !this.isLoading ? <ScheduleList  rows={this.state.activities} /> : (<div style={{margin:"auto", width:"55px"}}> <CircularProgress /> </div>);
		return (
            <div>
                <div style={{ margin:"auto", width:"250px"}}>
                    <IconButton
                        color="inherit"
                        aria-label="Move back one day"
                        onClick={this.moveBackOneDay}
                    >
                        <ChevronLeft />
                    </IconButton>

                    <DatePicker 
						clearIcon={null}
						calendarIcon={null}
                        onChange={this.userChangedDay}
                        value={this.state.date}
                        // maxDate={endOfTomorrow()}
                        // minDate={new Date(2021,1,10)}
                      />

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
