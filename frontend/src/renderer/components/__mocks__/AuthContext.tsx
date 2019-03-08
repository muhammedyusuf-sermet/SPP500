import { context } from "../../../../test/testHelpers";

export const AuthContext = {
	Consumer(props: any) {
		return props.children(context);
	}
}