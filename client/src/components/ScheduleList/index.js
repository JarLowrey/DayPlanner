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
