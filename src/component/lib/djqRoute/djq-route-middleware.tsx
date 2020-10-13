function Middleware() {
    this.routeConfig = {
        routes: [],
        routeMap: {}
    };
    this.current = new Array(null);
}
Middleware.prototype.use = function (route: string, name: string, component: any): any {
    let point = this.current.length > 0 ? this.current.length - 1 : 0;
    this.current[point] = route;
    let insertConfig = (obj) => {
        obj.routes.push(route);
        obj.routeMap[route] = {
            name,
            routePath: [...this.current],
            routes: [],
            routeMap: {},
            component
        };
        return obj;
    };
    if (point > 0) {
        let co = this.routeConfig;
        for (let i = 0; i < point; i++) {
            co = co.routeMap[this.current[i]];
            if (i !== point - 1) continue;
            insertConfig(co);
        }
    } else {
        insertConfig(this.routeConfig);
    }
    return this;
};

Middleware.prototype.then = function (res) {
    this.current.push(null);
    res(this);
    this.current.pop();
};

Middleware.prototype.createConfig = function () {
    return this.routeConfig;
};

export default Middleware;