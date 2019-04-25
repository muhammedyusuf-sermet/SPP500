import * as React from 'react';

import 'bulma/css/bulma.css';

import { Input, Select } from '@material-ui/core';

export interface IEnumDropdownProps {
	disabled?: boolean,
	name: string,
	selected?: string,
	options: string[]
	onChange: (name: string, selectOption?: string) => void
}

export interface IEnumDropdownState {
	selected: string
}

export class EnumDropdown extends React.Component<IEnumDropdownProps, IEnumDropdownState> {
	constructor(props: IEnumDropdownProps) {
		super(props);
		this.state = {
			selected: props.selected ? props.selected : 'Default'
		};
	}

	componentWillReceiveProps(nextProps: IEnumDropdownProps) {
		if (this.state.selected != nextProps.selected)
			this.setState({
				selected: nextProps.selected ? nextProps.selected : 'Default'
			});
	}

	handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		this.setState({selected: event.target.value});
		this.props.onChange(this.props.name, event.target.value);
	}

	render() {
		return (
			<Select
				native={true}
				id={this.props.name}
				disabled={this.props.disabled}
				onChange={this.handleChange}
				value={this.state.selected}
				input={<Input name={this.props.name} id={this.props.name} />} >
				<option
					id={this.props.name+'.'+'Default'}
					value='' >
					Default
				</option>
				{this.props.options.map(option =>
					<option
						key={this.props.name+'.'+option}
						id={this.props.name+'.'+option}
						value={option}>
						{option.replace(/([A-Z])/g, ' $1').trim()}
					</option>
				)}
			</Select>
		);
	}
}