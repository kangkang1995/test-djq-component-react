import * as React from 'react'
interface Props{
  data?: any,
  params?: any,
  vsClick?: Function,
  locateVs?: string,      //定位
  locatePlayer?: string,  //定位
  exchangeStart?: number,
  exchangeEnd?: number,
  groupPlayerExchangeOfStart?: Function, 
  groupPlayerExchangeOfEnd?: Function, 
  startGroupPlayerExchange?: Function, 
  checkGroupPlayerExchange?: Function,
  groupExchangeOfStart?: Function,
  groupExchangeOfEnd?: Function,
  startGroupExchange?: Function,
  checkGroupExchange?: Function,
}
export default function (props: Props) {
  const { data: dataMap, params,
          exchangeStart, exchangeEnd,
          groupPlayerExchangeOfStart, groupPlayerExchangeOfEnd, 
          startGroupPlayerExchange, checkGroupPlayerExchange,
          groupExchangeOfStart, groupExchangeOfEnd,
          startGroupExchange, checkGroupExchange } = props;
          
  const width = dataMap.get("width");
  const height = dataMap.get("height");
  const vsMap = dataMap.get("vsMap");
  const groupMap = dataMap.get("groupMap");

  const _spellImgUrl = function (url = '') {
    let cdnUrl = 'http://cdn2.test.dianjingquan.cn/vs/image/';
    return cdnUrl + url;
  }
  const _spellCountryUrl = function (id = "0") {
    let countryUrl = 'http://testdjqimg.oss-cn-hangzhou.aliyuncs.com/country/%id%.jpg';
    return countryUrl.replace("%id%", id ? id : "0")
  };
  const groupLocate = function (x, y, w, h) {
    x += 1; y += 1; w -= 2; h -= 2;
    return x + ',' + y + ' ' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + h) + ' ' + x + ',' + (y + h) + ' ' + x + ',' + y;
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
  }
  const _clickVs = function (vs) {
    props.vsClick({
        vs_id: vs.id,
        vs_seq: vs.vs_seq,
        round_id: vs.round_id,
        round_seq: vs.round_seq, //场次
        group_id: vs.group_id,
        group_seq: vs.group_seq, //第几组
        rule_type: vs.rule_type,
      });
  }
  // =========== draw svg ============
  const _renderRoundTitle = function (g) {
    return (
      <React.Fragment>
        <rect x="0" y="0" height={params.groupVsTitleHeight} width={params.groupWidth} style={{ fill: "#302F35" }}></rect>
        <text x="130" y="20" fontSize='13' style={{fill: "#fff"}}>{g.group}组</text>
        <text x='270' y='20' fontSize='13' textAnchor='middle' style={{ fill: "#7d7d7d" }}>胜</text>
        <text x='310' y='20' fontSize='13' textAnchor='middle' style={{ fill: "#7d7d7d" }}>平</text>
        <text x='350' y='20' fontSize='13' textAnchor='middle' style={{ fill: "#7d7d7d" }}>负</text>
        <text x='390' y='20' fontSize='13' textAnchor='middle' style={{ fill: "#7d7d7d" }}>大场</text>
        <text x='430' y='20' fontSize='13' textAnchor='middle' style={{ fill: "#7d7d7d" }}>小场</text>
        <text x='470' y='20' fontSize='13' textAnchor='middle' style={{ fill: "#7d7d7d" }}>积分</text>
      </React.Fragment>
    )
  }
  const _renderPlayers = function (g, gi) {
    let players = g.players;
    let {uid, isSwitch, isTeam,editStep, groupVsTitleHeight, groupPlayerHeight, groupWidth} = params;

    let playerArrs = players.map((player, i) => {
        return (
          <g key={i}>
            <rect x="0" y={groupVsTitleHeight+i*groupPlayerHeight} height={groupPlayerHeight} width={groupWidth} style={{ fill: "#222126" }}></rect>
            <line x1='0' y1={groupVsTitleHeight+i*groupPlayerHeight} x2={groupWidth} y2={groupVsTitleHeight+i*groupPlayerHeight} style={{ stroke:"#191919", strokeWidth:1 }}></line>
            <text x='20' fontSize='13' y={groupVsTitleHeight+i*groupPlayerHeight+23} style={{ fill: "#b8babc" }}>{i + 1}.</text>
            <image x='45' y={groupVsTitleHeight+i*groupPlayerHeight+8} className='flag' height='20' width='30'  xlinkHref={_spellCountryUrl(player.country_id)} />
            <text x='90' y={groupVsTitleHeight+i*groupPlayerHeight+23} fontSize='13' style={{ 'fill':uid==player.uid&&uid?'#ff5454':'#b8babc' }}>
              {
                isTeam 
                ? !isSwitch?_dealName(player.full_name?player.full_name:'暂无',12):_dealName(player.id_name?player.id_name:'暂无',12)
                : !isSwitch?_dealName(player.id_name?player.id_name:'暂无',12):_dealName(player.full_name?player.full_name:'暂无',12)
              }
            </text>
            <text x='270' y={groupVsTitleHeight+i*groupPlayerHeight+23} fontSize='13' style={{ 'fill':"#b8babc" }} textAnchor='middle'>{player.game_win ? player.game_win : 0}</text>
            <text x='310' y={groupVsTitleHeight+i*groupPlayerHeight+23} fontSize='13' style={{ 'fill':"#b8babc" }} textAnchor='middle'>{player.game_draw ? player.game_draw : 0}</text>
            <text x='350' y={groupVsTitleHeight+i*groupPlayerHeight+23} fontSize='13' style={{ 'fill':"#b8babc" }} textAnchor='middle'>{player.game_los ? player.game_los : 0}</text>
            <text x='390' y={groupVsTitleHeight+i*groupPlayerHeight+23} fontSize='13' style={{ 'fill':"#b8babc" }} textAnchor='middle'>{player.game_win || player.game_los ? player.game_win+'-'+ player.game_los:'0-0'}</text>
            <text x='430' y={groupVsTitleHeight+i*groupPlayerHeight+23} fontSize='13' style={{ 'fill':"#b8babc" }} textAnchor='middle'>{player.win || player.los? player.win+'-'+ player.los:'0-0'}</text>
            <text x='470' y={groupVsTitleHeight+i*groupPlayerHeight+23} fontSize='13' style={{ 'fill':"#b8babc" }} textAnchor='middle'>{player.point ? player.point : 0}</text>
            {
              editStep === 1 
              ? (<React.Fragment>
                  {groupPlayerExchangeOfStart(gi,g.pc,i) ? <image onClick={()=>startGroupPlayerExchange(g,player.enroll_id,gi*g.pc+i+1)} style={{ cursor: "pointer" }} x='200' y={groupVsTitleHeight+i*groupPlayerHeight+8} height='20' width='20' xlinkHref={_spellImgUrl('exchange-blue.png')}/> : null}
                  {groupPlayerExchangeOfEnd(gi,g.pc,i) ? <image onClick={()=>checkGroupPlayerExchange(g,player.enroll_id,gi*g.pc+i+1)} style={{cursor: "pointer"}} x='200' y={groupVsTitleHeight+i*groupPlayerHeight+8} height='20' width='20' xlinkHref={_spellImgUrl('exchange-red.png')}/> : null}
                  {(exchangeEnd && exchangeStart===gi*g.pc+i+1) || exchangeEnd===gi*g.pc+i+1 ? <text x='200' y={groupVsTitleHeight+i*groupPlayerHeight+23} fontSize='13' style={{ 'fill':"#b8babc" }}>交换中</text> : null}
                </React.Fragment>) : null
            }
            {
              player.enroll_id==props.locatePlayer && props.locatePlayer
              ? <polyline points={groupLocate(0,groupVsTitleHeight+i*groupPlayerHeight,groupWidth,groupPlayerHeight)} style={{fill:"none", stroke: "#ff5454", strokeWidth: 2}}></polyline> 
              : null
            }
          </g>
        )
      })
    return playerArrs;
  }
  const _renderRounds = function (g, gi) {
    let rounds = g.rounds; 
    let {groupVsTitleHeight, groupWidth} = params;
    let roundArrs = rounds.map((round, i) => {
      let ri = i;
      return (
        <g key={i}>
          <rect x='0' y={round.y} height={groupVsTitleHeight} width={groupWidth} style={{fill: "#302F35"}}></rect>
          <text x='25' y={round.y+20} fontSize='13' style={{fill: "#fff"}}>详细对阵循环{i?"二":"一"}</text>
          {_renderVs(round, rounds.length, gi, ri)}
        </g>
      )
    })
    return roundArrs;
  }
  const _renderVs = function (round, roundsLength, gi, ri) {
    let {isSwitch, isTeam, editStep, groupVsTitleHeight, groupWidth,groupVsHeight} = params;
    let vsArrs = round.vs.map((vsItem, j) => {
      return (
        <g key={j}>
          <rect x='0' y={round.y+groupVsTitleHeight+j*groupVsHeight} height={groupVsHeight} width={groupWidth} style={{fill: "#222126"}}></rect>
          <line x1='0' y1={round.y+groupVsTitleHeight+j*groupVsHeight} x2={groupWidth} y2={round.y+groupVsTitleHeight+j*groupVsHeight} style={{stroke:"#191919",strokeWidth:1}}/>
          <text x='20' y={round.y+groupVsTitleHeight+j*groupVsHeight+23} fontSize='13' textAnchor='start' style={{fill: "#b8babc"}}>{j+1}.</text>
          {
            vsItem.players.map((player, k) => {
              return (<g key={k}>
                        <g className={`player groupPlayer p_${player.enroll_id}`} onMouseEnter={() => _enterVs(player.enroll_id)} onMouseLeave={() => _leaveVs(player.enroll_id)} onClick={() => _clickVs(vsItem)}>
                          <rect x={120+230*k} y={round.y+groupVsTitleHeight+j*groupVsHeight+1} width='140' height={groupVsHeight-2} style={{fill: "#2B2A30",stroke: "#39383E",opacity: 0}}></rect>
                          <text x={190+230*k} y={round.y+groupVsTitleHeight+j*groupVsHeight+23} fontSize='13' className={player.status === 'QUIT'?'quit':'normal'} textAnchor='middle'>
                            {
                              isTeam
                              ? !isSwitch?_dealName(player.full_name?player.full_name:'暂无',12):_dealName(player.id_name?player.id_name:'暂无',12)
                              : !isSwitch?_dealName(player.id_name?player.id_name:'暂无',12):_dealName(player.full_name?player.full_name:'暂无',12)
                            }
                          </text>
                        </g>
                        <text x={290+40*k} y={round.y+groupVsTitleHeight+j*groupVsHeight+23} fontSize='13' textAnchor='middle' style={{'fill':player.status == 'QUIT'?'#7D7D7D':'#b8babc'}}>{player.status ? player.score:'-'}</text>
                      </g>)
            })
          }
          <text x='310' y={round.y+groupVsTitleHeight+j*groupVsHeight+23} fontSize='14' textAnchor='middle' style={{fill: "#F28723"}}>vs</text>
          {vsItem.status_img && params.status==='START' ? <image x='90' y={round.y+groupVsTitleHeight+j*groupVsHeight+8} height='20' width='20' xlinkHref={vsItem.status_img}/> : null}
          {
            editStep === 2
            ? (<React.Fragment>
                {groupExchangeOfStart(gi,roundsLength,ri,round.vs.length,j) ? <image onClick={() =>startGroupExchange(vsItem,gi*(roundsLength*round.vs.length)+ri*round.vs.length+j+1, gi)} style={{cursor: "pointer"}} x='80' y={round.y+groupVsTitleHeight+j*groupVsHeight+8} height='20' width='20' xlinkHref={_spellImgUrl('exchange-blue.png')}/> : null}
                {groupExchangeOfEnd(gi,roundsLength,ri,round.vs.length,j) ? <image onClick={() =>checkGroupExchange(vsItem,gi*(roundsLength*round.vs.length)+ri*round.vs.length+j+1)} style={{cursor: "pointer"}} x='80' y={round.y+groupVsTitleHeight+j*groupVsHeight+8} height='20' width='20'  xlinkHref={_spellImgUrl('exchange-red.png')}/> : null}
              </React.Fragment>)
            : null
          }
          {
            vsItem.id===props.locateVs && props.locateVs
            ? <polyline points={groupLocate(0,round.y+groupVsTitleHeight+j*groupVsHeight,groupWidth,groupVsHeight)} style={{fill:"none", stroke: "#ff5454",strokeWidth: 2}}></polyline>
            : null
          }
        </g>)
    })
    return vsArrs;
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} >
      <svg style={{ display: "none" }}>
        <symbol id="box1" viewBox="0 0 200 50">
          <rect x='0' y='0' width='200' height='50' style={{ fill: "#2f2f34" }}></rect>
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
      <g>
        {
          groupMap.map((g, gi) => {
            return (
              <svg key={gi} x={g.x} y={g.y} width={params.groupWidth} height={g.height}>
                {_renderRoundTitle(g)}
                {_renderPlayers(g, gi)}
                {params.editStep !== 1 ? _renderRounds(g, gi) : null}
                <rect x='0' y='0' width={params.groupWidth} height={g.height} style={{fill: "none",stroke:"#191919",strokeWidth:1}}></rect>
              </svg>
            )
          })
        }
      </g>
    </svg >
  )
}