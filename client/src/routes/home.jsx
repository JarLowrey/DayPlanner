import React, { Component } from "react";
import ScheduleList from "../components/ScheduleList";

class MyComponent extends Component {
	render() {
		// const titleSize = this.props.isMobileSize ? "h2" : "h1";
		return (
			<div>
				<ScheduleList></ScheduleList>
            </div>
		);
	}
}

export default MyComponent;
