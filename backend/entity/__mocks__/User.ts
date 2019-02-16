var users = [];


export class User {
	Name: string;
	Username: string;
	Email: string;
	HashedPassword: string;
	Type: string;

	static find(a) {
		var result = users.slice(0);
		for (let key in a) {
			let value = a[key];
			result = result.filter(function (el) {
				return el[key] == value;
			});
		}

		return result
	}

	save() {
		users.push({
			Name: this.Name, 
			Username: this.Username, 
			Email: this.Email,
			HashedPassword: this.HashedPassword,
			Type: this.Type,
		})
	}
}