import React, { Component } from "react";

import DatePicker from 'react-date-picker'
import ScheduleList from "../ScheduleList";

import IconButton from '@mui/material/IconButton';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import addDays from 'date-fns/addDays';

export default class Schedule extends Component {

	constructor(props) {
		super(props);
		this.state = {
            date: new Date()
		}; 
		this.moveBackOneDay=this.moveBackOneDay.bind(this);
		this.moveForwardOneDay=this.moveForwardOneDay.bind(this);
		this.dayChanged=this.dayChanged.bind(this);
		this.userChangedDay=this.userChangedDay.bind(this);
	  }
	
	componentDidMount(){

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
					query: `query { getAllActivity { descr } } `,
					}),
				})
				.then(res => res.json())
				.then(
				(result) => {
					console.log(result);
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

	render() {
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
                <ScheduleList/>
            </div>
		);
	}
}
