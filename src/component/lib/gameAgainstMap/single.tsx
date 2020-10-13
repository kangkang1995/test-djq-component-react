import object from './object';
import { getVsObject } from './approach';
// interface Pattern {
//     groups: object.data.Interface
// }
class Single {
    props: any = {};
    constructor(props) {
        this.props = props;
    }
    draw(pattern) {
        if (pattern.groups[0].rounds) {
            let sh = pattern.groups[0].rounds[0].vs.length, sw = 0;
            if (sh === 2) sh = 3;
            if (pattern.groups[0].rounds.length === 1) pattern.is_lpl = false;
            if (pattern.is_lpl) sw = pattern.groups[0].rounds.length - 1;
            else sw = pattern.groups[0].rounds.length;
            return new Map([
                ["width", sw * (this.props.vsWidth + this.props.roundInterval) + this.props.crosswiseInterval * 2],
                ["height", sh * (this.props.vsHeight + this.props.vsInterval) + this.props.topInterval + this.props.BottomInterval],
                ["round", [{ x: 0, y: 0, length: sw }]],
                ...this.drawRounds(pattern.groups[0].rounds, pattern.is_lpl)]
            )
        }
    }
    drawRounds(rounds: any[], isLpl = false): any {
        let vsMap = new Map();//定义一个map 对象
        let x = 0, y = 0;
        let lines = [], linesGroup: any[any] = [];
        let vsAllInterval = this.props.vsHeight + this.props.vsInterval;//对阵Y轴实际间隔
        for (let round_index in rounds) {//循环轮次
            let roundIndex = parseInt(round_index);
            let round = rounds[round_index];
            if (isLpl && roundIndex === rounds.length - 1) {//判断是否存在第三名争夺战
                let group = round.vs[0];
                let round_y = Math.pow(2, roundIndex - 1);
                let round_off = Math.floor(Math.pow(2, roundIndex - 2));
                y = this.props.roundHeight + 160 + vsAllInterval * round_off + (vsAllInterval / 2) * round_y - roundIndex * vsAllInterval;//计算对阵Y轴坐标
                vsMap.set(group.id, getVsObject(group, x, y));
            } else {
                x = this.props.crosswiseInterval + 24/*边缘与场次间隔*/ + roundIndex * (this.props.vsWidth + this.props.roundInterval);
                for (let group_index in round.vs) {
                    let groupIndex = parseInt(group_index);
                    let group = round.vs[group_index];
                    let round_y = Math.pow(2, roundIndex);
                    let round_off = Math.floor(Math.pow(2, roundIndex - 1));
                    y = this.props.roundHeight + 28/*轮次与对阵间距*/ + (roundIndex != 0 ? vsAllInterval * round_off - vsAllInterval / 2 : 0) + groupIndex * vsAllInterval * round_y;
                    let startPoint = [x + this.props.vsWidth, y + this.props.vsHeight / 2]
                    let pointSpace = Math.floor(groupIndex % 2) ? -vsAllInterval * round_y / 2 + 15 : vsAllInterval * round_y / 2 - 15;
                    lines.push([startPoint, [startPoint[0] + this.props.roundInterval - 9, startPoint[1]], [startPoint[0] + this.props.roundInterval - 9, startPoint[1] + pointSpace]]);//设置连线转折点[[x1,y1],[x2,y2]]
                    vsMap.set(group.id, getVsObject(group, x, y));
                }
                linesGroup.push(lines);
                lines = [];
            }
        };
        linesGroup.pop();
        return [["vsMap", vsMap], ["linesGroup", linesGroup]];
    }
}
export default Single;
