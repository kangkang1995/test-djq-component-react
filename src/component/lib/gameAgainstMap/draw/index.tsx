import * as React from 'react'
import Single from './single';
import Double from './double';
import Group from './group';
import MultiSingle from './multiSingle';
import './style'
interface Props {
  rule: string,
  data: any,
  params: object,
  vsClick?: Function,
  vsExchange?: Function,
  vsLocate?: Function
}
interface State {
  locateVs: string,
  locatePlayer: string,
  exchangeStart: number,
  exchangeEnd: number,
  startExchangeGroupIndex: number,
}
export default class extends React.Component<Props, State> {
  selectVsGroup: any[] = [];
  exchangeObj: any = {}
  constructor(props) {
    super(props);
    this.state = {
      locateVs: '',       // 定位
      locatePlayer: '',   // 定位（小组赛）
      exchangeStart: 0,
      exchangeEnd: 0,
      startExchangeGroupIndex: 0,   // 小组赛 交换对阵vs点击第一下 所在的组
    }
  }
  componentDidMount() {
  }
  // =========   searchVs    ===========
  searchVs = (vs_id) => {
    const {data: dataMap,rule} = this.props;
    this.setState({
      locateVs: vs_id,
      locatePlayer: ''
    })
    if(vs_id){
      let vsMap = dataMap.get("vsMap");
      let vs = vsMap.get(vs_id);
      this.props.vsLocate(vs.x,vs.y)
    }
  }
  searchGroup = (group_id) => {
    this.setState({locateVs: ""})
    const {data: dataMap,rule} = this.props;
    for(let group of dataMap.get("groupMap")){
      if(group_id === group.id) this.props.vsLocate(group.x,group.y);
    }
  }
  choosePlayer = (value) => {
    this.selectVsGroup = [];
    const {data: dataMap,rule} = this.props;
    const vsGroup = dataMap.get('vsGroup');
    if(this.props.rule === 'GROUP'){
      for(let group of vsGroup){
        if((group.name.indexOf(value)>-1 || group.id_name.indexOf(value)>-1) && value) this.selectVsGroup.push(group);
      }
      let locatePlayer = this.selectVsGroup[0]?this.selectVsGroup[0].enroll_id:'';
      this.setState({locatePlayer: locatePlayer});
      this.searchGroup(this.selectVsGroup[0]?this.selectVsGroup[0].group_id:'');
    }else{
      for(let vs of vsGroup){
        for(let p of vs.players){
          if(p.indexOf(value)>-1 && value){
            this.selectVsGroup.push(vs);
            break;
          }
        }
      }
      this.searchVs(this.selectVsGroup[0]?this.selectVsGroup[0].id:'');
    }
    return this.selectVsGroup.length?this.selectVsGroup.length:0;
  }
  choosePlayerIndex = (index) => {
    let selectVsGroup = this.selectVsGroup[index]?this.selectVsGroup[index]:{}
    if(this.props.rule === 'GROUP'){
      this.setState({locatePlayer: selectVsGroup.enroll_id})
      this.searchGroup(selectVsGroup.group_id);
    }else{
      this.searchVs(selectVsGroup.id);
    }
  }
  // ========= exchangeJudge ===========
  normalExchangeOfStart = (gi, len, pi) => {
    return !this.state.exchangeStart || (this.state.exchangeStart === gi * len + pi + 1 && !this.state.exchangeEnd)
  }
  normalExchangeOfEnd = (gi, len, pi) => {
    return this.state.exchangeStart && this.state.exchangeStart !== gi * len + pi + 1 && !this.state.exchangeEnd
  }
  groupPlayerExchangeOfStart = (gi, len, pi) => {
    return !this.state.exchangeStart || (this.state.exchangeStart === gi * len + pi + 1 && !this.state.exchangeEnd)
  }
  groupPlayerExchangeOfEnd = (gi, len, pi) => {
    return this.state.exchangeStart && Math.floor((this.state.exchangeStart - 1) / len) !== gi && !this.state.exchangeEnd
  }
  groupExchangeOfStart = (gi, rlen, ri, vlen, vi) => {
    return !this.state.exchangeStart || (this.state.exchangeStart === gi * (rlen * vlen) + ri * vlen + vi + 1 && !this.state.exchangeEnd) && this.state.startExchangeGroupIndex == gi
  }
  groupExchangeOfEnd = (gi, rlen, ri, vlen, vi) => {
    let cg = Math.floor((this.state.exchangeStart - 1) / (rlen * vlen));
    let cr = Math.floor((this.state.exchangeStart - cg * rlen * vlen - 1) / vlen);
    return this.state.exchangeStart && cg === gi && cr === ri && this.state.exchangeStart !== gi * (rlen * vlen) + ri * vlen + vi + 1 && !this.state.exchangeEnd && this.state.startExchangeGroupIndex == gi
  }
  // ========= exchangeClick ===========
  startExchange = (vs,enroll_id,p,index) => {
    this.setState({
      exchangeStart: this.state.exchangeStart?0:index
    })
    this.exchangeObj.s_vs_id = vs.id;
    this.exchangeObj.s_player_enroll_id = String(enroll_id);
    this.exchangeObj.s_player_index = p;
    this.exchangeObj.s_round_id = vs.round_id;
    this.exchangeObj.s_round_seq = vs.round_seq;
    this.exchangeObj.s_group_seq = vs.group_seq;
    this.exchangeObj.s_group_id = vs.group_id;
    this.exchangeObj.s_vs_seq = vs.vs_seq;
  }
  checkExchange = (vs,enroll_id,p,index) => {
    this.setState({ exchangeEnd: index})
    this.exchangeObj.d_vs_id = vs.id;
    this.exchangeObj.d_player_enroll_id = String(enroll_id);
    this.exchangeObj.d_player_index = p;
    this.exchangeObj.d_round_id = vs.round_id;
    this.exchangeObj.d_round_seq = vs.round_seq;
    this.exchangeObj.d_group_seq = vs.group_seq;
    this.exchangeObj.d_group_id = vs.group_id;
    this.exchangeObj.d_vs_seq = vs.vs_seq;
    this.props.vsExchange(this.exchangeObj, ()=>{
      this.setState({
        exchangeStart: 0,
        exchangeEnd: 0
      })
    });
  }
  startGroupPlayerExchange = (group,enroll_id,index) => {
    this.setState({
      exchangeStart: this.state.exchangeStart?0:index
    })
    this.exchangeObj.s_enroll_id = enroll_id;
    this.exchangeObj.s_group_seq = group.group_seq;
    this.exchangeObj.s_group_id = group.id;
  }
  checkGroupPlayerExchange = (group,enroll_id,index) => {
    this.setState({ exchangeEnd: index})
    this.exchangeObj.d_enroll_id = enroll_id;
    this.exchangeObj.d_group_seq = group.group_seq;
    this.exchangeObj.d_group_id = group.id;
    this.props.vsExchange(this.exchangeObj, ()=>{
      this.setState({
        exchangeStart: 0,
        exchangeEnd: 0
      })
    });
  }
  startGroupExchange = (vs,index, clickGi) => {
    this.setState({
      exchangeStart: this.state.exchangeStart?0:index,
      startExchangeGroupIndex: clickGi
    })
    this.exchangeObj.s_vs_id = vs.id;
    this.exchangeObj.s_vs_seq = vs.vs_seq;
    this.exchangeObj.s_round_id = vs.round_id;
    this.exchangeObj.s_round_seq = vs.round_seq;
    this.exchangeObj.s_group_seq = vs.group_seq;
    this.exchangeObj.s_group_id = vs.group_id;
  }
  checkGroupExchange = (vs,index) => {
    this.setState({ exchangeEnd: index})
    this.exchangeObj.d_vs_id = vs.id;
    this.exchangeObj.d_vs_seq = vs.vs_seq;
    this.exchangeObj.d_round_id = vs.round_id;
    this.exchangeObj.d_round_seq = vs.round_seq;
    this.exchangeObj.d_group_seq = vs.group_seq;
    this.exchangeObj.d_group_id = vs.group_id;
    this.props.vsExchange(this.exchangeObj, ()=>{
      this.setState({
        exchangeStart: 0,
        exchangeEnd: 0
      })
    });
  }

  render() {
    const { rule, data } = this.props;
    switch (rule) {
      case "SINGLE":
        return <Single 
                {...this.props}
                {...this.state}
                normalExchangeOfStart={this.normalExchangeOfStart}
                normalExchangeOfEnd={this.normalExchangeOfEnd}
                startExchange={this.startExchange}
                checkExchange={this.checkExchange}
              />;
      case "DOUBLE":
        return <Double 
                {...this.props} 
                {...this.state}
                normalExchangeOfStart={this.normalExchangeOfStart}
                startExchange={this.startExchange}
                normalExchangeOfEnd={this.normalExchangeOfEnd}
                checkExchange={this.checkExchange}
              />;
      case "GROUP":
        return <Group 
                {...this.props}
                {...this.state}
                groupPlayerExchangeOfStart={this.groupPlayerExchangeOfStart}
                groupPlayerExchangeOfEnd={this.groupPlayerExchangeOfEnd}
                startGroupPlayerExchange={this.startGroupPlayerExchange}
                checkGroupPlayerExchange={this.checkGroupPlayerExchange}
                groupExchangeOfStart={this.groupExchangeOfStart}
                groupExchangeOfEnd={this.groupExchangeOfEnd}
                startGroupExchange={this.startGroupExchange}
                checkGroupExchange={this.checkGroupExchange}
              />;
      case "MULTISINGLE":
        return <MultiSingle 
                {...this.props} 
                locateVs={this.state.locateVs}
              />
      default:
        return null;
    }
  }
}