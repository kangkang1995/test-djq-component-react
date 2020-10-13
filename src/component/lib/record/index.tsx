import * as React from 'react';
import { Modal, message, Table } from 'antd';

interface Props {
  service?: any;
  byType?: {moudle: string, objtype: string}  // 子级的日志
  type?: string;  
}

interface State {
  recordVisible: boolean,
  pagination: Object,
  dataList: object[],
  loading: boolean,
}

export default class extends React.Component<Props, State> {
  page_count = 15;
  columns: object[] = [
    {
      title: '记录时间', dataIndex: 'time', key: 'time', width: "200px", align: "center",
    },
    {
      title: '操作者', dataIndex: 'operator', key: 'operator', width: "150px", align: "center",
    },
    {
      title: '操作者内容', dataIndex: 'content', key: 'content', width: "500px", align: "left",
    },
  ];
  state = {
    recordVisible: false,
    pagination: {
      pageSize: this.page_count,
      current: 1,
      total: 0
    },
    dataList: [],
    loading: false,
  };
  constructor(props) {
    super(props);
  }

  _initModel = () => {
    this.props.byType ? this._getListBytype() : this._getList();
    this._recordVisibleShow();

  }

  _getList = () => {
    let { base } = this.props.service;
    let { current: page, pageSize: page_count } = this.state.pagination;
    let moudle = this.props.type;
    base.getBusinessOptLogList({ moudle, page, page_count }).then(
      res => {
        let { pagination } = this.state;
        pagination.total = res.totalElements;
        this.setState({
          pagination,
          dataList: res.content.map((item, index) => {
            item.key = item.time + '-' + index;
            return item
          })
        })
      },
      err => {
        message.error("失败，请重试")
      }
    )
  }

  _getListBytype = () => {
    let { base } = this.props.service;
    let { current: page, pageSize: page_count } = this.state.pagination;
    base.getBusinessOptLogListBytype({ ...this.props.byType, page, page_count }).then(
      res => {
        let { pagination } = this.state;
        pagination.total = res.totalElements;
        this.setState({
          pagination,
          dataList: res.content.map((item, index) => {
            item.key = item.time + '-' + index;
            return item
          })
        })
      },
      err => {
        message.error("失败，请重试")
      }
    )
  }

  _recordVisibleHide = () => {
    this.setState({
      recordVisible: false
    })
  }

  _recordVisibleShow = () => {
    this.setState({
      recordVisible: true
    })
  }

  _handleTableChange = (pagination, filters, sorter) => {
    const { pagination: pager } = this.state;
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    }, () => {
      this.props.byType ? this._getListBytype() : this._getList();
    });
  };

  render() {
    return this._renderModel()
  }

  _renderModel = () => {
    return <Modal
      title='操作记录'
      width={1000}
      maskClosable={false}
      visible={this.state.recordVisible}
      onOk={this._recordVisibleHide}
      onCancel={this._recordVisibleHide}
      footer={null}
    >
      {this._renderTable1()}
    </Modal>
  }

  _renderTable1 = () => {
    return <Table
      columns={this.columns}
      dataSource={this.state.dataList}
      pagination={this.state.pagination}
      onChange={this._handleTableChange}
      loading={this.state.loading}
      scroll={{ y: "60vh" }}
    />
  }

}