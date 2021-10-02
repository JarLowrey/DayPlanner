import React, { Component } from "react";
import Schedule from "../components/Schedule";

class MyComponent extends Component {
	render() {
		// const titleSize = this.props.isMobileSize ? "h2" : "h1";
		return (
			<div>
				<Schedule></Schedule>
            </div>
		);
	}
}

export default MyComponent;
