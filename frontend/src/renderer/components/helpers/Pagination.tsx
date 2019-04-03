import * as React from 'react';
import '../../css/platform/pages/catalogue-pagination.css';


export interface IPaginationState {
	page: number,
}

export class Pagination extends React.Component<any, IPaginationState> {
	constructor(props: any) {
		super(props);
		this.state = {
			page: 0,
		}
	}

	getTotalPages() {
		return this.props.getTotalPages();
	}

	previousPage() {
		if(this.state.page > 0){
			let newPage = this.state.page-1;
			this.setState({ page: newPage});
			this.props.onPageChange(newPage);
		}
	}

	nextPage() {
		let totalPages = this.getTotalPages();
		if(this.state.page < totalPages){
			let newPage = this.state.page+1;
			this.setState({ page: newPage});
			this.props.onPageChange(newPage);
		}
	}

	render() {
			return (
				<div id="paginated-catalogue-navigation">
					<h3>Page No: {this.state.page+1}</h3>
					<a onClick={() => this.previousPage()} id="previousPageButton" className="previous">&laquo; Previous</a>
					<a onClick={() => this.nextPage()} id="nextPageButton" className="next">Next &raquo;</a>
				</div>
			)
	}
}
