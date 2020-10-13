import React, { Component } from 'react';
import { ExcelReact } from '../../../component';
import './excel.scss'

const tableTitle = () => (// 表格头部
    <div className="tableTitle">
        <span>常规赛</span>
        <span>季后赛</span>
    </div>
)

const columns = ['战队1', '战队2', '战队3', '战队4', '战队5', '战队6', '战队7'];


export default class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:[]
        }
    }
    _handerTableData = (isRegular = true, ) => {//是否是常规赛 以及队伍总数
        let column = new Array();
        if (isRegular) {
            for (let k = 0; k < columns.length; k++) {
                column.push({
                    title: columns[k],
                    key:`team${k + 1}`,
                    children:[
                        {
                            title:'比分',
                            dataIndex: `team${k + 1}_score`,
                            key:`team${k + 1}_score`,
                            align: 'center',
                            width: 120,
                            editable:true,
                            render:()=> <input></input>
                        },
                        {
                            title:'视频链接',
                            width: 120,
                            dataIndex: `team${k + 1}_link`,
                            key:`team${k + 1}_link`,
                            align: 'center',
                            editable:true,
                            render:()=> <input></input>
                        },
                        {
                            title:'时间',
                            width: 120,
                            dataIndex: `team${k + 1}_time`,
                            key:`team${k + 1}_time`,
                            align: 'center',
                            editable:true,
                            render:()=> <input></input>
                        }
                    ],
                    editable:true,
                    dataIndex:`team${k + 1}`,
                    align: 'center',
                })
            }
        }
        return {
            column,
        }
    }
    _handerTableDataSource = (arr,round) => {
        let dataSource = this.state.dataSource;
        dataSource[round] = arr;
        console.log(dataSource);
        this.setState({dataSource:[...dataSource]});
    }
    render() {
        let param = {
            showHeader: true,
            needPushRow: false,
            needDeleteRow: false,
        }
        return (
            <div>
                {
                    columns.map((team, index) => {
                        let dataSource = [{ teamName: `战队${index + 1}`,key:index}], arr = [{
                            title: `第${index + 1}轮`,
                            dataIndex: 'teamName',
                            width: 120,
                            align: 'center',
                            editable: false
                        }, ...[...this._handerTableData().column]];
                        arr[index+1].editable = false;
                        return <div key={team} className="tableBox">
                            <ExcelReact {...param}
                                tableTitle={index !== 0 ? null : tableTitle} columns={arr} dataSource={dataSource}
                                round={index}
                                handerTableDataSource={this._handerTableDataSource}
                            /></div>
                    })
                }
            </div>
        )
    }
} 