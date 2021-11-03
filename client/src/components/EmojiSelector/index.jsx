import React, { Component } from "react";

import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

export default class EmojiSelector extends Component {
    emotions =  ['😩','🙁','😐,','🙂','😀'];
    sizes =     ['🐁','🐈','🐕','🦏','🐘'];

	render() {
        let emojiArr = this.props.isSize ? this.sizes : this.emotions;
        emojiArr = emojiArr.map((x,i)=> <MenuItem value={i}>{x}</MenuItem> );
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
                            {emojiArr}
                        </Select>						
                        }
						label={this.props.title}
						labelPlacement="top"
						/>
            </FormControl>
		);
	}
}