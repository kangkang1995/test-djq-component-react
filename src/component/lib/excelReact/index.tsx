
import * as React from 'react';
import {
    Table, Input, Button, Popconfirm, Form, Divider,
} from 'antd';

interface Props {
    record: any,
    handleSave?: Function,
    editable?: boolean,
    dataIndex?: any,
    title?: any,
    index?: number,
    needDeleteRow?: boolean //是否需要删除行 的操作
    needPushRow?: boolean //是否需要添加行 的操作
    showHeader?: boolean //是否显示表头
    tableTitle?:any // 自定义的表格头部
    columns?:any // 表格的列
    dataSource?:any //表格的行
    keys?:any,
    round?:number // 当前轮次
    handerTableDataSource?:Function //回调
}
interface State {
    dataSource?: any,
    count?: number
    editing?: boolean
}
const FormItem = Form.Item;
const EditableContext = React.createContext({});
const EditableRow: any = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
class EditableCell extends React.Component<Props, State> {
    input = null;
    form = null;
    cell = null;
    state = {
        editing: false,
    }
    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    }
    save = () => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    }
    render() {
        const { editing } = this.state;
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td ref={node => (this.cell = node)} {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form: any) => {
                            this.form = form;
                            return (
                                editing ? (
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            rules: [{
                                                required: true,
                                                message: `${title} is required.`,
                                            }],
                                            initialValue: record[dataIndex],
                                        })(
                                            <Input
                                                ref={node => (this.input = node)}
                                                onPressEnter={this.save}
                                                onBlur={this.save}
                                            />
                                        )}
                                    </FormItem>
                                ) : (
                                        <div
                                            className="editable-cell-value-wrap"
                                            style={{ paddingRight: 24}}
                                            onClick={this.toggleEdit}
                                        >
                                            {restProps.children}
                                        </div>
                                    )
                            );
                        }}
                    </EditableContext.Consumer>
                ) : <div style={{background:'#7d7d7d',height:'100%',lineHeight:'50px'}}>{ restProps.children }</div>}
            </td>
        );
    }
}

export default class extends React.Component<Props, State> {
    columns = [];
    constructor(props) {
        super(props);
        this.columns = [...this.props.columns];
        // 添加删除行操作 饭饭
        if (this.props.needDeleteRow) {
            this.columns.push({
                title: 'operation',
                dataIndex: 'operation',
                render: (text, record) => (
                    this.state.dataSource.length >= 1
                        ? (
                            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                                <a href="javascript:;">Delete</a>
                            </Popconfirm>
                        ) : null
                ),
            })
        }

        this.state = {
            dataSource: this.props.dataSource,
            count: this.props.dataSource.length,
        };
    }

    handleDelete = (key) => {//删除
        // const dataSource = [...this.state.dataSource];
        // this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    }
    handleAdd = () => {
        // const { count, dataSource } = this.state;
        // const newData = {
        //     key: count,
        //     name: `Edward King ${count}`,
        //     age: 32,
        //     address: `London, Park Lane no. ${count}`,
        // };
        // this.setState({
        //     dataSource: [...dataSource, newData],
        //     count: count + 1,
        // });
    }
    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        const index = newData.findIndex(item => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        this.setState({ dataSource: newData },()=>{
            this.props.handerTableDataSource(this.state.dataSource,this.props.round)
        });
    }
    render() {
        const { dataSource } = this.state;
        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (col.editable === false) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        return (
            <div >
                {this.props.needPushRow ? <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    Add a row
                </Button>:null}

                <Table
                    // components={components}
                    rowClassName={() => 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    showHeader={this.props.showHeader}
                    title={this.props.tableTitle}
                    pagination={false}
                />
            </div>
        );
    }
}
