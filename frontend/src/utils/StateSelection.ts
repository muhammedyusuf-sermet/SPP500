export function stateWithoutErrors(state: any): any
{
	let newState: { [key: string]: number | string } = {};
	for (let field in state) {
		if (field.endsWith('Error'))
			continue
		if (state[field] != undefined)
			newState[field] = state[field];
	}
	return newState;
}