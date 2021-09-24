import React, { Component } from "react";
import { Link } from "react-router-dom";

// import { MenuIcon, ListItem, Drawer, List, IconButton } from '@mui/material';

import ListItem from '@mui/material/ListItem';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default class Hamburger extends Component {
	state = {
		isOpen: false
	};

	handleDrawerOpen = () => {
		this.setState({ open: true });
	};

	handleDrawerClose = () => {
		this.setState({ open: false });
	};

	render() {
		return (
			<div>
				<IconButton
					color="inherit"
					aria-label="Open drawer"
					onClick={this.handleDrawerOpen}
				>
					<MenuIcon />
				</IconButton>

				<Drawer open={this.state.open} onClose={this.handleDrawerClose}>
					<List>
						{this.props.appRoutes.map(x => {
							return (
								<ListItem button component={Link} to={x.path} key={x.path} onClick={this.handleDrawerClose}>
									{x.txt}
								</ListItem>
							);
						})}
					</List>
				</Drawer>
			</div>
		);
	}
}
