export interface IAuthStateMock {
	isAuth?: string,
	login: jest.Mock<any, any> | ((user: {username: string, password: string}, callback?: (message: string) => void) => void),
	logout: jest.Mock<any, any> | ((callback?: (message: string) => void) => void),
}

export const context: IAuthStateMock = {
	isAuth: undefined,
	login: jest.fn(),
	logout: jest.fn()
}