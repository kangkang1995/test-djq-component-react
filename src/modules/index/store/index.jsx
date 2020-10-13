import { reaux } from '../../../component';

export default new reaux.Store({
    state: {
        list: {
            name: '',
            count: 0
        }
    },
    getters: {
        getNameDes: (state, getters) => (num) => {
            console.log(31231);
        },
        spell: (state, getters) => () => {
            return state.list.count;
        }
    },
    actions: {
        setCount({ commit, getters, state, dispatch }, name, count) {
            commit("setCount", { name, count })
        }
    },
    mutations: {
        setCount(state, { name, count }) {
            state.list = {
                name,
                count
            }
        }
    }
})