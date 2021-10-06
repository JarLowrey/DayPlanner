import React, { Component } from "react";

import Stack from '@mui/material/Stack';
import ActivityRow from "../ActivityRow";

export default class ScheduleList extends Component {
	static MaxEndingMinute = 2359;

	render() {
		let rows = [];
		
		let acts = this.props.rows;
		acts.forEach((x,i) => {
			let len = acts.length;
			let minTime = (i === len-1 && len > 1) ? acts[len - 2].startingTime : "00:00:00";
			let maxEnd = (i === 0 && len > 1) ? acts[1].startingTime : "23:59:00";
			if(i > 0 && i < len-1){
				minTime = acts[i-1].endingTime;
				maxEnd = acts[i+1].startingTime;
			}
			let row = (
				<ActivityRow key={x.id} minStart={minTime} maxEnd={maxEnd} {...x}></ActivityRow>
			);
			rows.push(row);
		});

		return (
			<Stack spacing={5}>
				{rows}
			</Stack>
		);
	}
}
