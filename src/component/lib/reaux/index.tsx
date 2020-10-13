
const connect = (WrappedComponent, WrappedProps = {}) => {
    console.log(WrappedProps);
    return class extends WrappedComponent {
        $store = WrappedProps;
        constructor(proops) {
            super(proops, WrappedProps);
        }
        render() {
            return super.render();
        }
    }
};

const Store = function (object) {
    this.state = object.state;
    this.getters = handleGetters.call(this, object.getters);
    this.mutations = object.mutations;
    this.actions = object.actions;
    this.commit = (name, ...args) => handleMutations.call(this, name, args);
    this.dispatch = (name, ...args) => handleActions.call(this, name, args);
}
function handleGetters(getters: object) {
    let obj = {};
    const { state } = this;
    for (let key in getters) {
        obj[key] = getters[key](Object.assign({}, state), getters);
    };
    return obj;
}

function handleMutations(name, args) {
    const { mutations } = this;
    if (!mutations[name]) {
        console.error("this mutations is not defined");
    } else {
        mutations[name](this.state, ...args);
    }
}

function handleActions(name, args) {
    const { actions } = this;
    if (!actions[name]) {
        console.error("this actions is not defined");
    } else {
        return actions[name]({
            state: Object.assign({}, this.state),
            getters: this.getters,
            commit: this.commit,
            dispatch: this.dispatch
        }, ...args);
    }
}

export {
    connect,
    Store
}