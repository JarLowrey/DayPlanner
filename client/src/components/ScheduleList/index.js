import React, { Component } from "react";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ActivityRow from "../ActivityRow";

export default class ScheduleList extends Component {
	static MaxEndingMinute = 2359;

	render() {
		let rows = this.props.rows.map(x=>{
            return (<ListItem key={x.id}>
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
