import React, { Component } from "react";

import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

export default class EmotionSelector extends Component {
	render() {
		return (
            <FormControl style={{minWidth:"95px"}}>
					<FormControlLabel
						value={this.props.title}
						control={
                            <Select
                            labelId="emotion-selector"
                            value={this.props.value}
                            label={this.props.title}
                            onChange={this.props.onChange}
                        >
                            <MenuItem value={0}>😩</MenuItem>
                            <MenuItem value={1}>🙁</MenuItem>
                            <MenuItem value={2}>😐</MenuItem>
                            <MenuItem value={3}>🙂</MenuItem>
                            <MenuItem value={4}>😀</MenuItem>
                        </Select>						}
						label={this.props.title}
						labelPlacement="top"
						/>
            </FormControl>
		);
	}
}