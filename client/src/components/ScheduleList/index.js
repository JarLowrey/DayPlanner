import React, { Component } from "react";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ActivityRow from "../ActivityRow";

export default class ScheduleList extends Component {
	static MaxEndingMinute = 2359;

	constructor(props) {
		super(props);
		this.state = {
            
		}; 
	  }
	
	componentDidMount(){

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

	render() {
        let rows = [{
			key:1,
		  startingTime: new Date(),
		  endingTime: new Date(),
		  descr: 'asdasd',
		  completedWith: 'asd',
		  satisfaction: 0,
		  isRetrospective: false,
		  purpose:'aaa'
        }].map(x=>{
            return (<ListItem key={x.key}>
				<ActivityRow {...x}></ActivityRow>
			</ListItem>);
        });
		return (
			<List>
				{rows}
			</List>
		);
	}
}
