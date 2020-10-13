import * as React from 'react'
interface Props {
    data?: any,
    params?: any,
    locateVs?: string,
    exchangeStart?: number,
    exchangeEnd?: number,
    normalExchangeOfStart?: Function,
    startExchange?: Function,
    normalExchangeOfEnd?: Function,
    checkExchange?: Function,
    vsClick?: Function,
}
export default function (props: Props) {
    const { data: dataMap, params, exchangeStart, exchangeEnd, normalExchangeOfStart, startExchange, normalExchangeOfEnd, checkExchange, vsClick } = props;
    const width = dataMap.get("width");
    const height = dataMap.get("height");
    const round = dataMap.get("round");
    const linesGroup = dataMap.get("linesGroup");
    const vsMap = dataMap.get("vsMap");

    let boxGroup = [];
    for (let value of vsMap.values()) {
        boxGroup.push(value)
    }

    const _renderWinTop = function (arr) {
        let arr0 = [], arr1 = [], arr2 = [], arr3 = [], arr4 = [];
        arr0.push(<rect key={'wintop'} x={round[0].x} y={round[0].y} height={params.roundHeight} width={(params.vsWidth + params.roundInterval) * round[0].length + params.crosswiseInterval * 2} style={{ "fill": "#2f2f34" }}></rect>)
        if (arr[0].length > 1) {
            arr1.length = arr[0].length - 1;
            for (let i = 1; i <= arr[0].length - 1; i++) {
                arr1.push(<use key={i + '_roundIcon1'} xlinkHref="#roundIcon1" x={i * (params.vsWidth + params.roundInterval) + 44} y={round[0].y + 15} width="10" height="10" />)
            }
        }
        if (arr[1].length > 0) {
            for (let i = 1; i <= arr[1].length; i++) {//v-if="!(i>1 && !(i%2 == 0))"
                if (!(i > 1 && !(i % 2 == 0))) {
                    arr2.push(<text key={i + '_text'} x={i * (params.vsWidth + params.roundInterval) - 97} y={round[0].y + 25} textAnchor="middle" fontSize="13" style={{ 'fill': params.roundColor }} >胜者组第{i > 2 ? (i - (i / 2 - 1)) : i}轮</text>)
                }
            }
        }
        if (arr[0].length - 1 >= arr[1].length) {
            arr3.push(<text key="_lastMatch" x={(round[0].length - 1) * (params.vsWidth + params.roundInterval) - 97} y={round[0].y + 25} textAnchor="middle" fontSize="13" style={{ 'fill': params.roundColor }}>决赛</text>)
        }
        if (arr[0].length - 2 >= arr[1].length) {
            arr4.push(<text key="_anotherMatch" x={(round[0].length) * (params.vsWidth + params.roundInterval) - 97} y={round[0].y + 25} textAnchor="middle" fontSize="13" style={{ 'fill': params.roundColor }}>附加赛</text>)
        }
        return [arr0, arr1, arr2, arr3, arr4]
    }
    const _spellImgUrl = function (url = '') {
        let cdnUrl = 'http://cdn2.test.dianjingquan.cn/vs/image/';
        return cdnUrl + url;
    }
    const _renderLoseTop = function (arr) {
        let arr0 = [], arr1 = [], arr2 = [], arr3 = [], arr4 = [];
        arr0.push(<rect key={'loseTop'} x={round[1].x} y={round[1].y} height={params.roundHeight} width={(params.vsWidth + params.roundInterval) * round[1].length + params.crosswiseInterval} style={{ "fill": "#2f2f34" }}></rect>)
        if (arr[1].length > 1) {
            arr1.length = arr[1].length - 1;
            for (let i = 1; i <= arr[1].length - 1; i++) {
                arr1.push(<use key={i + '_roundIcon1_lose'} xlinkHref="#roundIcon2" x={i * (params.vsWidth + params.roundInterval) + 44} y={round[1].y + 15} width="10" height="10" />)
            }
        }
        if (arr[1].length > 0) {
            for (let i = 1; i <= arr[1].length; i++) {//v-if="!(i>1 && !(i%2 == 0))"
                arr2.push(<text key={i + '_text_lose'} x={i * (params.vsWidth + params.roundInterval) - 97} y={round[1].y + 25} textAnchor="middle" fontSize="13" style={{ 'fill': params.roundColor }} >败者组第{i}轮</text>)
            }
        }

        return [arr0, arr1, arr2]
    }

    const _spellPoint = function (point) {
        let pl = "";
        for (let p of point) {
            pl += p[0] + "," + p[1] + " ";
        }
        return pl;
    }

    const _renderPolyline = function (linesGroup) {
        return linesGroup.map((item, index) => {
            return item.map((subitem, ii) => {
                return <polyline key={index + ii + '_polyline'} points={_spellPoint(subitem)} style={{ 'fill': 'none', 'stroke': params.lineColor, 'strokeWidth': 2, 'fillOpacity': 0 }} />
            })
        })
    }
    const _groupLocate = function (x, y, w, h) {
        x += 1; y += 1; w -= 2; h -= 2;
        return x + ',' + y + ' ' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + h) + ' ' + x + ',' + (y + h) + ' ' + x + ',' + y;
    }

    const _enterVs = function (id) {
        if (id === 'nil' || !id) return;
        for (let item of Array.from(document.getElementsByClassName("p_" + id))) {
            item.classList.add("hover");
        }
    };
    const _leaveVs = function (id) {
        if (id === 'nil' || !id) return;
        for (let item of Array.from(document.getElementsByClassName("p_" + id))) {
            item.classList.remove("hover");
        }
    };
    const _clickVs = function (vs) {
        vsClick({
            vs_id: vs.id,
            vs_seq: vs.vs_seq,
            round_id: vs.round_id,
            round_seq: vs.round_seq, //场次
            group_id: vs.group_id,
            group_seq: vs.group_seq, //第几组
            rule_type: vs.rule_type,
        })
    };

    const _spellCountryUrl = function (id = "0") {
        let countryUrl = 'http://testdjqimg.oss-cn-hangzhou.aliyuncs.com/country/%id%.jpg';
        return countryUrl.replace("%id%", id ? id : "0")
    };
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
    const _renderPlayer = function (obj, oi) {
        return obj.players.map((player, i) => {
            return (<g key={obj.id + '_player' + i}>
                <line x1={obj.x} x2={obj.x + params.vsWidth} y1={obj.y + params.vsHeight / 2} y2={obj.y + params.vsHeight / 2} style={{ "stroke": "#19191d", "strokeWidth": "1" }} />
                <g className={'p_' + player.enroll_id + ' player normalPlayer'} onMouseEnter={() => { _enterVs(player.enroll_id) }} onMouseLeave={() => { _leaveVs(player.enroll_id) }} onClick={() => { _clickVs(obj) }}>
                    <rect x={obj.x} y={obj.y + i * params.vsHeight / 2} width={params.vsWidth} height={params.vsHeight / 2} style={{ "fill": "#ff5454", "opacity": 0 }}></rect>
                    <image x={obj.x + 5} y={obj.y + 3 + i * params.vsHeight / 2} height='20' width='30' xlinkHref={_spellCountryUrl(player.country_id)} />
                    <text className={player.status === 'QUIT' ? 'quit' : 'normal'} x={obj.x + 40} y={obj.y + 17 + i * params.vsHeight / 2} fontSize='13' style={{ 'fill': player.status == 'QUIT' ? '#7D7D7D' : params.vsTextColor }}>
                        {params.isTeam ?
                            !params.isSwitch ? _dealName(player.full_name ? player.full_name : '暂无', 14) : _dealName(player.id_name ? player.id_name : '暂无', 14) :
                            !params.isSwitch ? _dealName(player.id_name ? player.id_name : '暂无', 14) : _dealName(player.full_name ? player.full_name : '暂无', 14)}
                    </text>
                    <text x={obj.x + 170} y={obj.y + 17 + i * params.vsHeight / 2} fontSize='13' style={{ 'fill': player.status == 'QUIT' ? '#7D7D7D' : params.vsTextColor }}>{_dealScore(player.status, player.score)}</text>
                    {
                        obj.status_img && params.status === 'START' ?
                            <image x={obj.x + 190} y={obj.y + 15} height='20' width='20' xlinkHref={obj.status_img} /> : null
                    }
                    {(() => {
                        if (params.editStep && obj.round_seq === 1 && obj.group_seq === 1) {
                            return <g >
                                {normalExchangeOfStart(oi, 2, i) ? <image style={{ cursor: "pointer" }} onClick={()=>startExchange(obj, player.enroll_id, i ? 'B' : 'A', oi * 2 + i + 1)} x={obj.x + params.vsWidth + 3} y={obj.y + 5 + params.vsHeight * i / 2} height='20' width='20' xlinkHref={_spellImgUrl('exchange-blue.png')} /> : null}
                                {normalExchangeOfEnd(oi, 2, i) ? <image style={{ cursor: "pointer" }} onClick={()=>checkExchange(obj, player.enroll_id, i ? 'B' : 'A', oi * 2 + i + 1)} x={obj.x + params.vsWidth + 3} y={obj.y + 5 + params.vsHeight * i / 2} height='20' width='20' xlinkHref={_spellImgUrl('exchange-red.png')} /> : null}
                                {(exchangeEnd && exchangeStart === oi * 2 + i + 1) || exchangeEnd === oi * 2 + i + 1 ? <text x={obj.x + params.vsWidth + 3} y={obj.y + 20 + params.vsHeight * i / 2} fontSize='13' style={{ "fill": "#b8babc" }}>交换中</text> : null}
                            </g>
                        }
                    })()}
                </g>
            </g>)
        })
    };


    const _renderVsImageGrounp = function () {
        return boxGroup.map((obj, oi) => {
            return <g key={obj.id}>
                <text fontSize='13' textAnchor='end' style={{ 'fill': params.vsSeqColor }} x={obj.x - 5} y={obj.y + 30}>{obj.vs_seq}</text>
                <use xlinkHref="#box1" width={params.vsWidth} height={params.vsHeight} x={obj.x} y={obj.y} />
                {
                    obj.id === props.locateVs ?
                        <polyline points={_groupLocate(obj.x, obj.y, params.vsWidth, params.vsHeight)} style={{ 'fill': 'none', 'stroke': '#ff5454', 'strokeWidth': 2 }}></polyline> : null
                }
                {_renderPlayer(obj, oi)}
            </g>
        })
    }

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} >
            <svg style={{ display: "none" }}>
                <symbol id="line1" viewBox="0 0 200 200">
                    <polyline points='0,1 100,1 100,199 200,199' style={{ fill: "none", stroke: "#ff5454", strokeWidth: 2, fillOpacity: 0 }} />
                </symbol>
                <symbol id="box1" viewBox="0 0 200 50">
                    <rect x='0' y='0' width='200' height='50' style={{ fill: "#2f2f34" }}></rect>
                </symbol>
                <symbol id="groupBox" viewBox="0 0 500 500">
                    <rect x='0' y='0' width='500' height='500' style={{ fill: "none", stroke: "#fff", strokeWidth: 1 }}></rect>
                </symbol>
                {/* 红色箭头ICON */}
                <symbol id="roundIcon1" viewBox="0 0 9 10">
                    <image x='0' y='0' height='10' width='9' xlinkHref={_spellImgUrl('vs_red.png')} />
                </symbol>
                {/* 绿色箭头ICON */}
                <symbol id="roundIcon2" viewBox="0 0 9 10">
                    <image x='0' y='0' height='10' width='9' xlinkHref={_spellImgUrl('vs_green.png')} />
                </symbol>
            </svg>

            {_renderWinTop(round)}
            {_renderLoseTop(round)}
            {_renderPolyline(linesGroup)}
            {_renderVsImageGrounp()}
        </svg>
    )
}
