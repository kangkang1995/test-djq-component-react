import * as React from 'react';
interface Props{
    data?: any,
    params?: any,
    vsClick?: Function,
    locateVs?: string,
    exchangeStart?: number,
    exchangeEnd?: number,
    normalExchangeOfStart?: Function, 
    normalExchangeOfEnd?: Function, 
    startExchange?: Function, 
    checkExchange?: Function, 
  }
export default function (props: Props) {
    const { data: dataMap, params,
            exchangeStart,exchangeEnd,
            normalExchangeOfStart, normalExchangeOfEnd,
            startExchange, checkExchange} = props;
    const width = dataMap.get("width");
    const height = dataMap.get("height");
    const round = dataMap.get("round");
    const linesGroup = dataMap.get("linesGroup");
    const vsMap = dataMap.get("vsMap");
    // ===================================================
    // let locateVs = ''; // 定位用 待修复
    // ========================================
    let boxGroup = [];
    for (let value of vsMap.values()) {
        boxGroup.push(value)
    }

    const _renderRoundTitle = function (length = 0) {
        let arr = [];
        for (let i = 1; i <= length; i++) {
            arr.push(
                <text key={i} x={i * (params.vsWidth + params.roundInterval) - 97} y="25" textAnchor="middle" fontSize="13" style={{ 'fill': params.roundColor }}>第{i}轮</text>
            )
        }
        return arr;
    }
    const _renderIcon = function (length = 0, icon = '#roundIcon1') {
        let arr = [];
        for (let i = 1; i <= length; i++) {
            arr.push(
                <use key={i} xlinkHref={icon} x={i * (params.vsWidth + params.roundInterval) + 44} y="15" width="10" height="10" />
            )
        }
        return arr;
    }
    const _spellImgUrl = function (url = '') {
        let cdnUrl = 'http://cdn2.test.dianjingquan.cn/vs/image/';
        return cdnUrl + url;
    }
    const _spellCountryUrl = function (id = "0") {
        let countryUrl = 'http://testdjqimg.oss-cn-hangzhou.aliyuncs.com/country/%id%.jpg';
        return countryUrl.replace("%id%", id ? id : "0")
    };
    const _spellPoint = function (point = []) {
        let pl = "";
        for (let p of point) {
            pl += p[0] + "," + p[1] + " ";
        }
        return pl;
    };
    const _renderLinesGroup = function (linesGroup = []) {
        let arr = [], a = 0;
        linesGroup.map((pointRound, index) => {
            pointRound.map((point, i) => {
                a++;
                arr.push(<polyline key={"point_" + a} points={_spellPoint(point)} style={{ 'fill': 'none', 'stroke': params.lineColor, 'strokeWidth': 2, 'fillOpacity': 0 }} />)
            })
        })
        return arr;
    }
    const groupLocate = function (x, y, w, h) {
        x += 1; y += 1; w -= 2; h -= 2;
        return x + ',' + y + ' ' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + h) + ' ' + x + ',' + (y + h) + ' ' + x + ',' + y;
    };
    const _renderLocate = function (obj) {
        if (obj.id === props.locateVs) {
            return (<polyline points={groupLocate(obj.x, obj.y, params.vsWidth, params.vsHeight)} style={{ "fill": "none", "stroke": "#ff5454", "strokeWidth": 2 }}></polyline>)
        } else {
            return null
        }
    }
    const _dealName = function (name, length) {
        if (name) {
            if (/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(name)) {
                return name.substring(0, 3) + "****" + name.substring(7, 11);
            } else {
                let len = 0;
                if (name.replace(/[^\x00-\xff]/g, "**").length > length) {
                    for (let i = 0; i < name.length; i++) {
                        len += parseInt(name[i].replace(/[^\x00-\xff]/g, "**").length);
                        if (len > length - 1) {
                            return name.substring(0, i) + "...";
                        }
                    }
                } else {
                    return name;
                }
            }
        } else {
            return "暂无"
        }
    };
    const _dealScore = function (status, score) {
        return status ? (score ? score : 0) : '-';
    };
    const _renderPlayerImg = function (obj) {
        if (obj.status_img && props.params.status === 'START') {
            return <image x={obj.x + 190} y={obj.y + 15} height='20' width='20' xlinkHref={obj.status_img} />
        } else {
            return null
        }
    };
    const _enterVs = function(id){
        if(id==='nil' || !id) return;
        for(let item of  Array.from(document.getElementsByClassName("p_"+id))){
            item.classList.add("hover");
        }   
    };
    const _leaveVs = function(id){
        if(id==='nil'|| !id) return;
        for(let item of Array.from(document.getElementsByClassName("p_"+id))){
            item.classList.remove("hover");
        }
    }
    const _vsClick = function(vs){
        props.vsClick({
            vs_id: vs.id,
            vs_seq: vs.vs_seq,
            round_id: vs.round_id,
            round_seq: vs.round_seq, //场次
            group_id: vs.group_id,
            group_seq: vs.group_seq, //第几组
            rule_type: vs.rule_type,
        })
    }
    const _renderPlayer = function (obj, oi) {
        return obj.players.map((player, i) => {
            let pi = i;
            return (//@mouseenter="enterVs(player.enroll_id)" @mouseleave="leaveVs(player.enroll_id)" @click="clickVs(obj)"
                <g key={'player_' + player.enroll_id + i}>
                    <line x1={obj.x} x2={obj.x + params.vsWidth} y1={obj.y + params.vsHeight/2} y2= {obj.y + params.vsHeight/2} style={{"stroke": "#19191d" ,"strokeWidth":"1"}} />
                    <g className={"player normalPlayer" + ' p_' + player.enroll_id} onMouseEnter={()=>{_enterVs(player.enroll_id)}} onMouseLeave={()=>{_leaveVs(player.enroll_id)}} onClick={()=>{_vsClick(obj)}}>
                        <rect x={obj.x} y={obj.y + i * params.vsHeight / 2} width={params.vsWidth} height={params.vsHeight / 2} style={{ "fill": "#ff5454", "opacity": 0 }}></rect>
                        <image x={obj.x + 5} y={obj.y + 3 + i * params.vsHeight / 2} height='20' width='30' xlinkHref={_spellCountryUrl(player.country_id)} />
                        <text className={player.status === 'QUIT' ? 'quit' : 'normal'} x={obj.x + 40} y={obj.y + 17 + i * params.vsHeight / 2} fontSize='13' style={{ 'fill': player.status == 'QUIT' ? '#7D7D7D' : params.vsTextColor }}>
                            {params.isTeam?
                               !params.isSwitch? _dealName(player.full_name ? player.full_name : '暂无', 14) : _dealName(player.id_name ? player.id_name : '暂无', 14):
                               !params.isSwitch? _dealName(player.id_name ? player.id_name : '暂无', 14) : _dealName(player.full_name ? player.full_name : '暂无', 14)
                            }
                        </text>
                        <text x={obj.x + 170} y={obj.y + 17 + i * params.vsHeight / 2} fontSize='13' style={{ 'fill': player.status == 'QUIT' ? '#7D7D7D' : params.vsTextColor }}>{_dealScore(player.status, player.score)}</text>
                        {_renderPlayerImg(obj)}
                    </g >
                    {_renderExchangeImg(obj, oi, player, pi)}
                </g>
            )
        })
    }
    const _renderExchangeImg = function(obj,oi, player, pi){
        if(params.editStep && obj.round_seq===1) {
            return (
                <g>
                    { normalExchangeOfStart(oi,2,pi) ? <image onClick={()=>startExchange(obj,player.enroll_id,pi?'B':'A',oi*2+pi+1)} style={{"cursor": "pointer"}} x={obj.x+params.vsWidth+3} y={obj.y+5+params.vsHeight*pi/2} height='20' width='20' xlinkHref={_spellImgUrl('exchange-blue.png')}/> : null }
                    { normalExchangeOfEnd(oi,2,pi) ? <image onClick={()=>checkExchange(obj,player.enroll_id,pi?'B':'A',oi*2+pi+1)} style={{"cursor": "pointer"}}  x={obj.x+params.vsWidth+3} y={obj.y+5+params.vsHeight*pi/2} height='20' width='20' xlinkHref={_spellImgUrl('exchange-red.png')}/> : null }
                    { (exchangeEnd && exchangeStart===oi*2+pi+1) || exchangeEnd===oi*2+pi+1 ? <text x={obj.x+params.vsWidth+3} y={obj.y+20+params.vsHeight*pi/2} fontSize='13' style={{"fill":"#b8babc"}}>交换中</text> : null }
                </g>
            )
        }
    }
    const _renderBoxGroup = function (boxGroup = []) {
        return boxGroup.map((obj, oi) => {
            return (
                <g key={'text' + obj.id}>
                    <text fontSize='13' textAnchor='end' style={{ 'fill': params.vsSeqColor }} x={obj.x - 5} y={obj.y + 30}>{obj.vs_seq}</text>
                    <use xlinkHref="#box1" width={params.vsWidth} height={params.vsHeight} x={obj.x} y={obj.y} />
                    {_renderLocate(obj)}
                    {_renderPlayer(obj, oi)}
                </g>
            )
        })
    };


    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} >
            <svg style={{ display: "none" }}>
                {/* <symbol id="line1" viewBox="0 0 200 200">
                    <polyline points='0,1 100,1 100,199 200,199' style='fill:none;stroke:#ff5454;stroke-width:2;fill-opacity: 0'/>
                </symbol> */}
                <symbol id="box1" viewBox="0 0 200 50">
                    <rect x='0' y='0' width='200' height='50' style={{ fill: "#2f2f34" }}></rect>
                </symbol>
                {/* <symbol id="groupBox" viewBox="0 0 500 500">
                    <rect x='0' y='0' width='500' height='500' style='fill: none;stroke:#fff;stroke-width:1'></rect>
                </symbol> */}
                {/* 红色箭头ICON */}
                <symbol id="roundIcon1" viewBox="0 0 9 10">
                    <image x='0' y='0' height='10' width='9' xlinkHref={_spellImgUrl('vs_red.png')} />
                </symbol>
                {/* 绿色箭头ICON */}
                <symbol id="roundIcon2" viewBox="0 0 9 10">
                    <image x='0' y='0' height='10' width='9' xlinkHref={_spellImgUrl('vs_green.png')}/>
                </symbol>
            </svg>
            <g>
                <rect x="0" y="0" height={params.roundHeight} width={(params.vsWidth + params.roundInterval) * round[0].length + params.crosswiseInterval * 2} style={{ fill: "#2f2f34" }}></rect>
                {_renderRoundTitle(round[0].length)}
                {_renderIcon(round[0].length, "#roundIcon1")}
                {_renderLinesGroup(linesGroup)}
                {_renderBoxGroup(boxGroup)}
            </g>
        </svg >


        //     <svg width="width" : height="height" : viewBox="'0 0 '+width+' '+height" v-if="rule">
        //         <g v-if="rule==='SINGLE'">
        //             <rect x="0" y="0" : height="roundHeight" :width="(vsWidth+roundInterval)*round[0].length+crosswiseInterval*2" style="fill: #2f2f34;"></rect>
        //         <text v-for="i in round[0].length" : x="i*(vsWidth+roundInterval)-97" y="25" text-anchor="middle" font-size="13" :style="{'fill': roundColor}">第{{ i }}轮</text>
        //     <use v-for="i in (round[0].length>1?round[0].length-1:0)" xlink: href="#roundIcon1"  : x="i*(vsWidth+roundInterval)+44" y="15" width="10" height="10" />
        //     <template v-for="pointRound in linesGroup">
        //         <polyline v-for="point in pointRound" : points="spellPoint(point)" :style="{'fill': 'none','stroke':lineColor,'stroke-width':2,'fill-opacity': 0}" />
        //     </template>


        //     <g v-for="obj,oi in boxGroup">
        //     <text font-size='13' text-anchor='end' : style="{'fill': vsSeqColor}" :x="obj.x-5" :y="obj.y+30">{{ obj.vs_seq }}</text>
        //     <use xlink: href="#box1" : width="vsWidth" : height="vsHeight" : x="obj.x" : y="obj.y" />
        //     <polyline v-if='obj.id===locateVs' : points="groupLocate(obj.x,obj.y,vsWidth,vsHeight)" style='fill:none;stroke: #ff5454;stroke-width: 2'></polyline>
        //     <template v-for="player,i in obj.players">
        // <g class="player normalPlayer" : class="'p_'+player.enroll_id" @mouseenter="enterVs(player.enroll_id)" @mouseleave="leaveVs(player.enroll_id)" @click="clickVs(obj)">
        //     <rect : x="obj.x" :y=" obj.y + i* vsHeight/2" :width="vsWidth" :height="vsHeight/2"  style="fill: #ff5454;opacity:0"></rect>
        //     <image : x="obj.x+5" : y=" obj.y + 3 + i* vsHeight/2" height='20' width='30' : xlink: href="spellCountryUrl(player.country_id)" />
        //     <text : class="player.status === 'QUIT'?'quit':'normal'" : x="obj.x+40" : y="obj.y + 17 + i* vsHeight/2" font-size='13' : style="{'fill':player.status == 'QUIT'?'#7D7D7D':vsTextColor}">{{!isSwitch?dealName(player.id_name?player.id_name:'暂无',14):dealName(player.full_name?player.full_name:'暂无',14)}}</text>
        //     <text : x="obj.x+170" : y="obj.y + 17 + i* vsHeight/2" font-size='13' : style="{'fill':player.status == 'QUIT'?'#7D7D7D':vsTextColor}">{{ dealScore(player.status, player.score)}}</text>
        //     <image v-if="obj.status_img && status==='START'" : x="obj.x+190" : y="obj.y+15" height='20' width='20' : xlink: href="obj.status_img" />
        // </g >

        //        <template v-if="editStep && obj.round_seq===1">
        //         <image style="cursor: pointer" v-show="normalExchangeOfStart(oi,2,i)" @click="startExchange(obj,player.enroll_id,i?'B':'A',oi*2+i+1)" :x='obj.x+vsWidth+3' :y='obj.y+5+vsHeight*i/2' height='20' width='20' :xlink:href="spellImgUrl('exchange-blue.png')"/>
        //           <image style="cursor: pointer" v-show="normalExchangeOfEnd(oi,2,i)" @click="checkExchange(obj,player.enroll_id,i?'B':'A',oi*2+i+1)" :x='obj.x+vsWidth+3' :y='obj.y+5+vsHeight*i/2' height='20' width='20' :xlink:href="spellImgUrl('exchange-red.png')"/>
        //           <text v-show="(exchangeEnd && exchangeStart===oi*2+i+1) || exchangeEnd===oi*2+i+1" : x='obj.x+vsWidth+3' :y='obj.y+20+vsHeight*i/2' font-size='13' style="fill:#b8babc">交换中</text>
        //         </template >
        //       </template >
        //     <line : x1="obj.x" : x2="obj.x + vsWidth" : y1="obj.y +vsHeight/2" : y2="obj.y + vsHeight/2" style="stroke: #19191d ;stroke-width:1" />
        //     </g >

        //   </g >
    )
}