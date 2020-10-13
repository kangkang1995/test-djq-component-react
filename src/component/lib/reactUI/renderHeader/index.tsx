import * as React from 'react';
import { Row, Col, } from 'antd';

interface Props {
	service?: any;
	env?: any,
	RenderHeaderLeft?: any,
	RenderHeaderRight?: any,
}
interface State {
}

class RenderHeaderLeft extends React.Component<Props, State>{
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Col>
				{this.props.children}
			</Col>
		)
	}
}

class RenderHeaderRight extends React.Component<Props, State>{
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Col>
				<Row type="flex" align="middle" style={{ margin: "10px 0" }}>
					{this.props.children}
				</Row>
			</Col>
		)
	}
}

class RenderHeader extends React.Component<Props, State>{
	static RenderHeaderLeft = RenderHeaderLeft;
	static RenderHeaderRight = RenderHeaderRight;
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				{this._renderHeader()}
			</div>
		)
	}
	_renderHeader() {
		if (this.props.children) {
			return <Row type="flex" justify="space-between" align="middle" style={{ margin: "10px 0" }}>
				{this.props.children}
			</Row>
		} else {
			return <Row type="flex" justify="space-between" align="middle" style={{ margin: "10px 0" }}>
				{this.props.RenderHeaderLeft}
				<Col>
					<Row type="flex" align="middle" style={{ margin: "10px 0" }}>
						{this.props.RenderHeaderRight}
					</Row>
				</Col>
			</Row>
		}
	}
}
RenderHeader.RenderHeaderLeft = RenderHeaderLeft;
RenderHeader.RenderHeaderRight = RenderHeaderRight;

export default RenderHeader;