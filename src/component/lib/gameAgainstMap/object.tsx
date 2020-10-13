namespace Object {
    export namespace data {
        export interface Interface {

        }
    }
    export interface Interface {
        click: string,//是否可点击
        country: any[] | null,//国家列表
        current_pattern: string,//当前阶段
        data: data.Interface;
    };
}

export default Object;