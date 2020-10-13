import * as React from 'react';
import { is, fromJS } from 'immutable';
var Snap = require( "imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js" );
interface Props {
  rule?: any,
  params?: any,
  data?: any,
  locateVs?: string,
  vsExchange?: Function,
  vsClick?: Function
}
interface State {}
export default class extends React.Component<Props, State> {
  multiSingleSvg = null;     // svg
  exchangeObj: any = {};
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this._draw(this.props)
  }
  shouldComponentUpdate(nextProps) {
    let isUpdate=!is(fromJS(nextProps), fromJS(this.props))
    return isUpdate
  }
  componentWillUpdate(props, state) {
    this._draw(props);
  }
  _spellImgUrl = (url: string) => {
    let cdnUrl = 'http://cdn2.test.dianjingquan.cn/vs/image/';
    return cdnUrl + url;
  }
  _spellCountryUrl = (id = "0") => {
    let countryUrl = 'http://testdjqimg.oss-cn-hangzhou.aliyuncs.com/country/%id%.jpg';
    return countryUrl.replace("%id%", id ? id : "0")
  };
  _clickVs = (vs) => {
    this.props.vsClick({
        vs_id: vs.id,
        vs_seq: vs.vs_seq,
        round_id: vs.round_id,
        round_seq: vs.round_seq, //场次
        group_id: vs.group_id,
        group_seq: vs.group_seq, //第几组
        rule_type: vs.rule_type,      
    })
  }
  _handleExchangeChoose = (e, vs, pi, pIndex) => {
      this.exchangeObj.s_vs_id = vs.id;
      this.exchangeObj.s_player_enroll_id = pi.enroll_id.toString();
      this.exchangeObj.s_player_index = pIndex.toString();
      this.exchangeObj.s_vs_seq = vs.vs_seq;
      this.exchangeObj.s_round_id = vs.round_id;
      this.exchangeObj.s_round_seq = vs.round_seq;
      this.exchangeObj.s_group_id = vs.group_id;
      this.exchangeObj.s_group_seq = vs.group_seq;
      let chooseNodeArr = Array.from(document.getElementsByClassName('multi_exchange_choose'));
      let sureNodeArr = Array.from(document.getElementsByClassName('multi_exchange_sure'));
      let ta = e.target;
      if(ta.getAttribute("data-click")){
        ta.removeAttribute("data-click");
        for(let obj of chooseNodeArr){
          let node: any = obj;
          node.style.display = 'block';
        }
        for(let obj of sureNodeArr){
          let node: any = obj;
          node.style.display = 'none';
        }
      }else{
        ta.setAttribute("data-click",true);
        for(let obj of chooseNodeArr){
          let node: any = obj;
          if(obj !== ta) node.style.display = 'none';
        }
        for(let obj of sureNodeArr){
          let node: any = obj;
          if(obj.getAttribute("data-vs") !== vs.id) node.style.display = 'block';
        }
      }
  }
  _handleExchangeSure = (e, vs, pi, pIndex) => {
      this.exchangeObj.d_vs_id = vs.id;
      this.exchangeObj.d_player_enroll_id = pi.enroll_id.toString();
      this.exchangeObj.d_player_index = pIndex.toString();
      this.exchangeObj.d_vs_seq = vs.vs_seq;
      this.exchangeObj.d_round_id = vs.round_id;
      this.exchangeObj.d_round_seq = vs.round_seq;
      this.exchangeObj.d_group_id = vs.group_id;
      this.exchangeObj.d_group_seq = vs.group_seq;
      let chooseNodeArr = Array.from(document.getElementsByClassName('multi_exchange_choose'));
      let sureNodeArr = Array.from(document.getElementsByClassName('multi_exchange_sure'));
      let textNodeArr = Array.from(document.getElementsByClassName('exchange_text'));

      let ce = "0";
      for(let obj of chooseNodeArr){
        let node: any = obj;
        if(node.getAttribute("data-click")) ce = obj.getAttribute("data-enroll");
        node.style.display = 'none';
      }
      for(let obj of sureNodeArr){
        let node: any = obj;
        node.style.display = 'none';
      }
      for(let obj of textNodeArr){
        let node: any = obj;
        if(node.getAttribute("data-enroll") === ce || obj.getAttribute("data-enroll") === pi.enroll_id) node.style.display = 'block';
      }
      this.props.vsExchange(this.exchangeObj, ()=> {
        for(let obj of textNodeArr){
          let node: any = obj;
          node.style.display = 'none';
        }
      });
  }
  // =========== draw svg ==============
  _draw = (props) => {
    const { data: dataMap, locateVs, params } = props;
    const width = dataMap.get("width");
    const height = dataMap.get("height");
    const allWidth = dataMap.get("allWidth");
    const svh = dataMap.get("svh");
    const linesGroup = dataMap.get("linesGroup");
    const vsMap = dataMap.get("vsMap");
    const roundsArr = dataMap.get("roundsArr");
    // 每次更新重置svg
    if(this.multiSingleSvg) {
      var svg = document.getElementById('svgBox');
      svg.innerHTML = '';
    }
    this.multiSingleSvg = Snap("#svgBox").attr({
      width: width,
      height: height,
      viewBox: "0 0 " + width + " " + height
    });
    this._drawLines(linesGroup);
    this._drawRoundTitle(roundsArr, allWidth);
    this._drawPlayer(svh, vsMap, params);
    this._drawLocate(locateVs);
  }
  _drawLines = (linesGroup) => {
    for(let lines of linesGroup){
      for(let point of lines) {
        let pl = [];
        for(let p of point){
          pl.push(p[0]);
          pl.push(p[1]);
        }
        this.multiSingleSvg.paper.polyline(pl).attr({
          fill: "none",
          stroke: "#ff5454",
          strokeWidth: 2,
          fillOpacity: 0,
        });
      }
    }
  }
  _drawRoundTitle = (roundsArr, allWidth) => {
    this.multiSingleSvg.rect(0,0.5,allWidth * roundsArr.length, 40).attr({
      fill: '#2f2f34',
      stroke: '#191919',
      strokeWidth: '.5'
    });
    for (let i = 0; i < roundsArr.length; i++) {
      let round = roundsArr[i];
      this.multiSingleSvg.text(allWidth * i + 150, 25, "第" + (i + 1) + "轮").attr({
        "fill": "#b8babc",
        "font-size": 13,
        "text-anchor": "middle"
      });
      if (i > 0) this.multiSingleSvg.image(this._spellImgUrl("vs_red.png"), allWidth * i - 10, 20, 8, 8);
    }
  }
  _drawPlayer = (svh, vsMap, params) => {
    const {isSwitch,editStep, multiVsInterval, multiVsWidth,multiPlayerInterval,multiVsActionWidth} = params;
    for (let vs of vsMap.values()) {
      this.multiSingleSvg.text(vs.x-9, vs.y+(svh-multiVsInterval)/2, vs.vs_seq).attr({
        "fill": "#b8babc",
        "font-size": 13,
        "text-anchor": "middle"
      });
      if(editStep && vs.round_seq === 1){
        vs.players.forEach((pi, pIndex) => {
          if (pi.enroll_id !== "nil") {
            this.multiSingleSvg.image(this._spellImgUrl("exchange-blue.png"), vs.x+ multiVsWidth + 5, vs.y + pIndex * multiPlayerInterval + 3, 20, 20).attr({
              "class": "multi_exchange_choose",
              "data-enroll": pi.enroll_id,
              "data-vs": vs.id,
            }).click((e) => this._handleExchangeChoose(e, vs, pi, pIndex));
            this.multiSingleSvg.image(this._spellImgUrl("exchange-red.png"), vs.x+ multiVsWidth + 5, vs.y + pIndex * multiPlayerInterval + 3, 20, 20).attr({
              "class": "multi_exchange_sure",
              "data-enroll": pi.enroll_id,
              "data-vs": vs.id,
            }).click((e) => this._handleExchangeSure(e, vs, pi, pIndex));
            this.multiSingleSvg.text(vs.x+ multiVsWidth + 5, vs.y + pIndex * multiPlayerInterval + 18, "交换中").attr({
              "class": "exchange_text",
              "data-enroll": pi.enroll_id,
              "font-size": 13,
              "fill": "#b8babc",
              "text-anchor": "start",
            });
          }
        });
      }
      
      this.multiSingleSvg.append((()=>{
        let vl = vs.players.length;
        let vh = vl > 4 ? 4*multiPlayerInterval +15 : vl * multiPlayerInterval;
        if (editStep) vh = vl * multiPlayerInterval;
        let ss = Snap(multiVsWidth, vh).attr({
          "x": vs.x,
          "y": vs.y
        });
        let sr = ss.rect(0.5, 0.5, multiVsWidth-1, vl * multiPlayerInterval).attr({
          "stroke-width": 2,
          "stroke": "#191919",
          "fill": "#2f2f34",
          "class": "rectBox",
          "data-vsid": vs.id
        });
        let psl = [];
        vs.players.forEach((pi, i) => {
          let pg = ss.g().attr({
            "cursor": "pointer",
            "class": "multi_player",
            "data-id": pi.enroll_id
          });
          let pgr = pg.rect(0, multiPlayerInterval * i + .5, multiVsActionWidth, multiPlayerInterval).attr({
            "fill": "#ff5454",
            "opacity": 0
          });
          let eid = pi.enroll_id;
          pg.image(this._spellCountryUrl(pi.country_id), 5, i * multiPlayerInterval + 5, 25, 17).attr({
            "data-id": eid,
          });
          // pg.image(this._spellImgUrl("notify_sure.png"), 5, i * multiPlayerInterval + 5, 25, 17).attr({
          //   "class": "notify notify_sure",
          //   "data-id": eid,
          // });
          // pg.image(this._spellImgUrl("notify_unSure.png"), 5, i * multiPlayerInterval + 5, 25, 17).attr({
          //   "class": "notify notify_unSure",
          //   "data-id": eid,
          // });
          let name = isSwitch 
                    ? (pi.full_name ? pi.full_name : "暂无")
                    : (pi.id_name ? pi.id_name : "暂无");
          let pgt = pg.text(40, i * multiPlayerInterval + 18, name).attr({
            "class": "player_show",
            "data-id": eid,
            "fill": "#b8babc",
            "font-size": 13
          });
          let pgs = pg.text(200, i * multiPlayerInterval + 18, vs.status === "FINISH" ? (pi.status === "QUIT" ? "-" : pi.score.toString()) : "").attr({
            "class": "score",
            "fill": "#b8babc",
            "font-size": 13
          });
          if (vs.vs_status === "FINISH") {
            pg.rect(0, 1, 250, vl * 25).attr({
              "fill": "#2f2f34",
              "class": "hide",
              "style": "display:none"
            });
          }
          psl.push(pgs);
          let color = "#b8babc";
          pg
            .mousemove(() => {
              pgr.attr({
                "opacity": 1
              });
              pgt.attr({
                "fill": "#000"
              });
              pgs.attr({
                "fill": "#000"
              });
            })
            .mouseout(() => {
              pgr.attr({
                "opacity": 0
              });
              if (pgt.attr("aria-status") === "checked") color = "#a2cb01";
              if (pgt.attr("aria-status") === "unchecked") color = "#ff5454";
              pgt.attr({
                "fill": color
              });
              pgs.attr({
                "fill": "#b8babc"
              });
            })
            .click((e) => {
              if (e.which === 1) this._clickVs(vs);
            })
        });
        let ls;
        if (vl > 4 && !editStep) {
          ls = ss.image(this._spellImgUrl("btn_more.png"), 1, 100.5, multiVsWidth-2, 15);
        }
        if (vl > 4 && !editStep) ss.mousemove(()=>{
          ss.animate({
            height: vl * 25 + 1,
            width: 250,
            x: vs.x-15
          }, 200);
          ls.animate({
            y: vl * 25 + 2
          }, 200);
          sr.animate({
            width: multiVsActionWidth-1
          }, 200);
          psl.forEach(function (psi) {
            psi.animate({
              x: 230
            }, 200)
          });
        });
        if (vl > 4 && !editStep) ss.mouseout(()=>{
          ss.animate({
            height: vh,
            width: 220,
            x: vs.x
          }, 200);
          ls.animate({
            y: 100.5
          }, 200);
          sr.animate({
            width: multiVsWidth-1
          }, 200);
          psl.forEach(function (psi) {
            psi.animate({
              x: 200
            }, 200)
          })
        });
        return ss.node;
      })())
    }
  }
  _drawLocate = (vs_id) => {
    let rectBox = Array.from(document.getElementsByClassName('rectBox'))
    for(let obj of rectBox){
      let node:any = obj;
      if(node.getAttribute("data-vsid")===vs_id) node.style.stroke = '#ff5454';
      else node.style.stroke = '#191919';
    }
  } 

  render() {
    const width = this.props.data.get("width");
    const height = this.props.data.get("height");
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} >
        <svg style={{ display: "none" }}>
            <symbol id="box1" viewBox="0 0 200 50">
                <rect x='0' y='0' width='200' height='50' style={{ fill: "#2f2f34" }}></rect>
            </symbol>
            {/* 红色箭头ICON */}
            <symbol id="roundIcon1" viewBox="0 0 9 10">
                <image x='0' y='0' height='10' width='9' xlinkHref={this._spellImgUrl('vs_red.png')} />
            </symbol>
            {/* 绿色箭头ICON */}
            <symbol id="roundIcon2" viewBox="0 0 9 10">
                <image x='0' y='0' height='10' width='9' xlinkHref={this._spellImgUrl('vs_green.png')} />
            </symbol>
        </svg>
        <svg id="svgBox"></svg>
      </svg>
    )
  }
}