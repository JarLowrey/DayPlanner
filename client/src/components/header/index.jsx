import React, { Component } from "react";

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';


import { styled } from '@mui/styles';

import { Link } from "react-router-dom";

import HamburgerMenu from "../hamburger";
import WithWindowSize from "../withWindowSize";

const FlexToolbar = styled(Toolbar)`
	display: flex;
	justify-content: space-between;
	text-align: center;
`;

class MyComponent extends Component {
	render() {
		return (
			<div>
				<AppBar position="static">
					<FlexToolbar>
						{/* left  */}
						<div>
							<Button component={Link} to="/" style={{ color: "white" }}>
								{window.globalAppData.appName}
							</Button>
						</div>

						{/* mid  */}
						<div>
							{!this.props.isMobileSize &&
								this.props.appRoutes.map(x => {
									if (x.path === "/" || x.path === "/support") {
										return null;
									}

									return (
										<Button
											component={Link}
											key={x.path}
											to={x.path}
											style={{ color: "white" }}
										>
											{x.txt}
										</Button>
									);
								})}
						</div>

						{/* right  */}
						<div>
							{this.props.isMobileSize && (
								<HamburgerMenu appRoutes={this.props.appRoutes} />
							)}
						</div>
					</FlexToolbar>
				</AppBar>
			</div>
		);
	}
}

export default WithWindowSize(MyComponent);
