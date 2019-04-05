import * as React from 'react';
const Joi = require('joi');
import { ValidationError, ValidationOptions, JoiObject } from 'joi';

import 'bulma/css/bulma.css';
import { Field, Label, Control, Input, TextArea } from 'bloomer';
import { isDeepStrictEqual } from 'util';
//import { IEncounterState } from '../../../../../../encounter';

export interface IEncounterState {
	Id?: number
}
              
export interface ICampaignDetailsProps {
	disabled?: boolean,
	// validation
	PayloadSchema: JoiObject,
	ValidationOptions: ValidationOptions,
	// initial values
	initial: {
        Id?: string;
        Name?: string;
        Summary?: string;
        Notes?: string;
        Encounters?: IEncounterState[];  
    }
}

export interface ICampaignDetailsState {
	// data
	//Id?: string;
	Name?: string;
    Summary?: string;
    Notes?: string;
    Encounters?: IEncounterState[];
	// errors
	NameError?: string;
    SummaryError?: string;
    NotesError?: string;
    EncountersError?: string;
}

export class CampaignDetails extends React.Component<ICampaignDetailsProps, ICampaignDetailsState> {
	constructor(props: ICampaignDetailsProps) {
		super(props);
		this.state = {
            ...props.initial
        };
    }

    componentWillReceiveProps(nextProps: ICampaignDetailsProps) {
		if (isDeepStrictEqual(this.props.initial, nextProps.initial) == false)
			this.setState({
                ...nextProps.initial
			});
    }
    
    stringToNumber = (toConvert : string) => {
		return isNaN(parseInt(toConvert)) ? undefined : parseInt(toConvert);
    }
    
    handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value: string|undefined = event.target.value;
		if (/^\s*$/.test(value))
			value = undefined
		Joi.validate(
			value,
			Joi.reach(this.props.PayloadSchema, ['Name']),
			this.props.ValidationOptions,
			(errors: ValidationError) => {
				this.setState({
					Name: value,
					NameError: errors ? errors.details[0].message : undefined
				});
			});
	}

    // TODO: Validate summary.
	handleSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
            Summary: event.target.value
        })
	}
    // TODO: Validate notes.
	handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		this.setState({
            Notes: event.target.value
		})
    }
    handleEncounterIdsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const encounters: {Id?: number}[] = []
        const  numberPattern = /\d+/g;
        const ids = event.target.value.match(numberPattern);
        if (ids != null) {
            ids.forEach((value: any) => {
                encounters.push({ Id: this.stringToNumber(value)})
            });
        }
		this.setState({  
            Encounters: encounters
        })
    }
 
    
    // Fix styling with bloom.
	render() {
		return (
            <React.Fragment>              
                <Field>
                    <Label>Campaign Name</Label>
                    <Control>
                        <Input
                            disabled={this.props.disabled}
                            id='Name'
                            type='text'
                            placeholder='Please enter the name of the campaign.'
                            name='Name'
                            value={this.state.Name}
                            onChange={this.handleNameChange}
                            required />
                    </Control>
                </Field>
                <Field>
                    <Label>Summary</Label>
                    <Control>
                        <TextArea
                            disabled={this.props.disabled}
                            id='Summary'
                            placeholder='Please write the campaign summary here.'
                            name='Summary'
                            value={this.state.Summary}
                            onChange={this.handleSummaryChange}
                            required />
                    </Control>
                </Field>
                <Field>
                    <Label>Notes</Label>
                    <Control>
                        <TextArea
                            disabled={this.props.disabled}
                            id='Notes'
                            placeholder='Please write the campaign notes here.'
                            name='Notes'
                            value={this.state.Notes}
                            onChange={this.handleNotesChange}
                            required />
                    </Control>
                </Field>
                <Field>
                    <Label>Encounters</Label>
                    <Control>
                        <TextArea
                            disabled={this.props.disabled}
                            id="encounter_ids"
                            placeholder={'Please write the encounter IDs here.'}
                            onChange={this.handleEncounterIdsChange} />
                    </Control>
                </Field>
            </React.Fragment>
		);
	}
}