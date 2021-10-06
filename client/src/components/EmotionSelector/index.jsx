import React, { Component } from "react";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

export default class EmotionSelector extends Component {
	render() {
		return (
            <FormControl style={{minWidth:"95px"}}>
                <InputLabel>{this.props.title}</InputLabel>
                <Select
                    labelId="emotion-selector"
                    value={this.props.value}
                    label={this.props.title}
                    onChange={this.props.onChange}
                >
                    <MenuItem value={0}>☹️</MenuItem>
                    <MenuItem value={1}>🙁</MenuItem>
                    <MenuItem value={2}>😐</MenuItem>
                    <MenuItem value={3}>🙂</MenuItem>
                    <MenuItem value={4}>😀</MenuItem>
                </Select>
            </FormControl>
		);
	}
}