import Props from './props';

import single from './single';

import Draw from './draw';

interface Data {
    pattern: any[]
}
class GameAgainstMap extends Props {
    static Draw = Draw;
    data: Data;
    single: any
    constructor(data, props = {}) {
        super(props);
        this.single = new single(this.$singleProps);
        this.data = data.data;
    }
    draw(pat = 0) {
        const currentPattern = this.data.pattern[pat];
        switch (currentPattern.rule_type) {
            case 'SINGLE':
                return {
                    rule: "SINGLE",
                    params: this.$singleProps,
                    dataMap: this.single.draw(currentPattern)
                }
            case 'DOUBLE':
                // this.rule = 'DOUBLE';
                // svg = this._initDouble(pat);
                break;
            case 'GROUP':
                // this.rule = 'GROUP';
                // svg = this._initGroup(pat);
                break;
            case 'MULTISINGLE':
                return {
                    rule: "MULTISINGLE",
                    // params: this.$singleProps,
                    // dataMap: this.single.draw(currentPattern)
                }
                // this.rule = 'MULTISINGLE';
                // svg = this._initMultiSingle(pat);
                break;
        }
        // return svg;
    }
}

export default GameAgainstMap;