const cdnUrl = ""
export const getVsObject = function (vs, x, y) {
    return {
        id: vs.id,
        group_id: vs.group_id,
        group_seq: vs.group_seq,
        round_id: vs.round_id,
        round_seq: vs.round_seq,
        vs_seq: vs.vs_index ? vs.vs_index : vs.vs_seq,
        rule_type: vs.rule_type,
        x: x,
        y: y,
        status: vs.vs_status,
        status_img: (() => {
            let m = this.is_manage;
            let pa = this.is_player_referee ? this.uid == vs.player_a.uid : false;
            let pb = this.is_player_referee ? this.uid == vs.player_b.uid : false;
            if (vs.vs_status === 'CREATE' && (m || pa || pb)) return cdnUrl + 'submit.png';
            if (vs.vs_status === 'AWAIT_CONFIRM') {
                if (m) return cdnUrl + 'judge_confirm.png';
                if (vs.player_a_status === "AWAIT_VS_RESULT" && pa) return cdnUrl + 'wait_confirm.png';
                if (vs.player_a_status === "AWAIT_VS_RESULT" && pb) return cdnUrl + 'need_confirm.png';
                if (vs.player_b_status === "AWAIT_VS_RESULT" && pb) return cdnUrl + 'wait_confirm.png';
                if (vs.player_b_status === "AWAIT_VS_RESULT" && pa) return cdnUrl + 'need_confirm.png';
            }
            if (vs.vs_status === 'ARBITRATION') {
                if (m) return cdnUrl + 'need_arbitration.png';
                if (pa || pb) return cdnUrl + 'wait_arbitration.png';
            }
        })(),
        players: vs.rule_type === 'MULTISINGLE' ? vs.players : [vs.player_a, vs.player_b]
    };
};