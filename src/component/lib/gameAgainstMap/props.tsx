// declare function create(o: object | null): void;
export default class Props {
    constructor(props) {
    }
    private $_base = {
        submit: false,// 是否能被点击
        status: "",// 对阵状态
        edit: false,//是否可编辑
        isPreview: false,//是否在预览状态
        editStep: 0,
        uid: 0,
        isManage: false,//是否是裁判判决
        isPlayerReferee: false,//是否是选手自判
        currentVsId: "",//当前选中的VSid
        isSwitch: false
    };
    private $_singleAndDouble = {
        vsWidth: 200,//对阵宽度
        vsHeight: 50,//对阵高度
        roundHeight: 40,//轮次高度
        vsInterval: 20,// 对阵间隔
        roundInterval: 68,// 轮次间隔
        crosswiseInterval: 38,// 轮次间隔
        topInterval: 0,//顶部间隔
        BottomInterval: 68,// 底部间隔
        roundColor: "#eee",//轮次文字颜色
        vsSeqColor: "#7D7D7D",// 场次颜色
        vsTextColor: "#b8babc",//场次文字颜色
        lineColor: "#2f2f34" //连线颜色
    };
    get $baseProps() {
        return this.$_base
    }
    get $singleProps() {
        return {
            ...this.$_base,
            ...this.$_singleAndDouble
        }
    }
    //基础信息
    //单淘双败
    // vsWidth: 50;//对阵宽度
    // vsHeight: { type: Number, default: 50 },//对阵高度
    // roundHeight: { type: Number, default: 40 },//轮次高度
    // vsInterval: { type: Number, default: 20 },// 对阵间隔
    // roundInterval: { type: Number, default: 68 },// 轮次间隔
    // crosswiseInterval: { type: Number, default: 38 },//左右间隔
    // topInterval: { type: Number, default: 0 },//顶部间隔
    // BottomInterval: { type: Number, default: 68 }, // 底部间隔
    // roundColor: { type: String, default: "#eee" },//轮次文字颜色
    // vsSeqColor: { type: String, default: "#7D7D7D" },// 场次颜色
    // vsTextColor: { type: String, default: "#b8babc" },//场次文字颜色
    // lineColor: { type: String, default: "#2f2f34" },//连线颜色
    // //小组
    // groupWidth: { type: Number, default: 500 },// 小组宽度
    // groupCrosswiseInterval: { type: Number, default: 57 },// 小组左右间距
    // groupIntervalX: { type: Number, default: 32 },// 小组横向间距
    // groupIntervalY: { type: Number, default: 36 },// 小组纵向间距
    // groupTitleHeight: { type: Number, default: 30 },//小组标题高度
    // groupPlayerHeight: { type: Number, default: 36 },//小组成员高度
    // groupVsTitleHeight: { type: Number, default: 30 },//小组轮次标题高度
    // groupVsHeight: { type: Number, default: 36 },//小组对阵高度

    // //多人单淘
    // multiVsWidth: { type: Number, default: 220 },//对阵宽度
    // multiVsActionWidth: { type: Number, default: 250 },//对阵展开宽度
    // multiRoundInterval: { type: Number, default: 80 },//对阵宽度
    // multiCrosswiseInterval: { type: Number, default: 38 },//左右间隔
    // multiPlayerInterval: { type: Number, default: 25 },//组内成员间隔
    // multiVsInterval: { type: Number, default: 50 },// 对阵间隔

    // submit: { type: Boolean, default: false },// 是否能被点击
    // status: { type: String, default: "" },// 是否显示状态
    // edit: { type: Boolean, default: false },
    // is_preview: { type: Boolean, default: false },
    // editStep: { type: Number, default: 0 },//编辑轮次
    // uid: { type: Number, default: 17267 },//用户id
    // is_manage: { type: Boolean, default: false },//是否是裁判
    // is_player_referee: { type: Boolean, default: false },//是否是选手自判
    // vs_id: { type: String, default: "" },//
    // isSwitch: { type: Boolean, default: false }//true，游戏id；flase，用户id
}