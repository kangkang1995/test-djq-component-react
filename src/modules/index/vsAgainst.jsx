import React, { Component } from 'react';
import { gameAgainstMap as DrawMap} from '../../component';
import { GameAgainstMap } from 'djq-approach';


import data from './data';

const map = new GameAgainstMap(data,{
    editStep:1
});
let drawData = map.draw(0);    // 返回处理后的数据

export default class extends Component {
    constructor(props) {
        super(props);
    }
    _vsExchange = () => {
        console.log('exchange')
    }
    render() {
        return <DrawMap.Draw
                rule={drawData.rule} 
                data={drawData.dataMap} 
                params={drawData.params} 
                // vsClick={this._vsClick}
                vsExchange={this._vsExchange}
                // vsLocate={this._vsLocate}
            />
    }
}