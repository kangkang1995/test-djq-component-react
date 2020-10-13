import * as React from 'react';
const { Component, Fragment } = React;
import { Layout, Menu, Row, Col } from "antd";
import 'antd/dist/antd.css';

import {
    Link,
    Route
} from 'react-router-dom';

interface Props {
    baseRoute: string,
    routeConfig: object,
    acceptRoute?: any,
    location: any,
}

interface State {
    defaultOpenKeys: Array<string>,
    defaultSelectedKeys: string
}

class CustomMenu extends Component<Props, State>{
    static defaultProps = {
        baseRoute: ''
    };
    routeConfig = {
        routeMap: {},
        routes: []
    };
    constructor(props) {
        super(props);
        const { routeConfig, acceptRoute } = props;
        // console.log(routeConfig);
        if (acceptRoute) {
            if (acceptRoute.length > 0) this.routeConfig = this._dealRoute(routeConfig, acceptRoute);
        } else {
            this.routeConfig = routeConfig;
        }
        this.state = this._spellKeys(props);
    }
    _spellKeys = (props) => {
        const { location: { pathname }, baseRoute } = props;
        let route = pathname.match(/\/[\u4E00-\u9FA5A-Za-z0-9_]+/g);
        let spellPath = (config, i = baseRoute ? 1 : 0) => {
            if (config.routes.length === 0) return [];
            let currentRoute = config.routes[0];
            if (route && config.routes.includes(route[i])) {
                currentRoute = route[i]
            }
            let nextRoute = config.routeMap[currentRoute];
            if (nextRoute.routes.length === 0) {
                return [currentRoute];
            }
            return [currentRoute, ...spellPath(nextRoute, i + 1)];
        };
        let defaultOpenKeys = spellPath(this.routeConfig);
        return {
            defaultOpenKeys,
            defaultSelectedKeys: defaultOpenKeys.pop()
        }
    }
    componentWillReceiveProps(props) {
        const { acceptRoute: preAcceptRoute } = this.props;
        const { acceptRoute } = props;
        if (JSON.stringify(preAcceptRoute) !== JSON.stringify(acceptRoute)) {
            if (acceptRoute.length > 0) this.routeConfig = this._dealRoute(props.routeConfig, acceptRoute);
            this.setState(this._spellKeys(props))
        }
    }
    _dealRoute = (config, acceptRoute) => {
        let obj = {
            routeMap: {},
            routes: []
        };
        config.routes.forEach((item) => {
            let routeItem = config.routeMap[item];
            if (routeItem.routes.length > 0) {
                let res = this._dealRoute(routeItem, acceptRoute);
                if (res) obj.routeMap[item] = res;
            } else {
                if (acceptRoute !== undefined && acceptRoute.includes(item)) obj.routeMap[item] = routeItem;
            }
        });
        obj.routes = config.routes.filter((key) => obj.routeMap[key]);
        if (obj.routes.length > 0) return Object.assign({}, config, obj);
        return false;
    }
    _renderMenu = (config) => {
        return config.routes.map((item) => {
            let route = config.routeMap[item];
            if (route.routes.length > 0) {
                return <Menu.SubMenu key={item} title={<span>{route.name}</span>}>
                    {this._renderMenu(route)}
                </Menu.SubMenu>
            } else {
                return <Menu.Item key={item}><Link to={`${this.props.baseRoute}${route.routePath.join('')}`}>{route.name}</Link></Menu.Item>
            }
        })
    };
    render() {
        return (
            <Menu
                theme={'light'}
                mode={'inline'}
                openKeys={this.state.defaultOpenKeys}
                selectedKeys={[this.state.defaultSelectedKeys]}
                onClick={(item) => {
                    this.setState({ defaultSelectedKeys: item.key })
                }}
                onOpenChange={(item) => {
                    this.setState({ defaultOpenKeys: item })
                }}
            >
                {this._renderMenu(this.routeConfig)}
            </Menu>
        )
    }
}
const CustomRoutes = (props) => {
    let baseRoute = props.baseRoute || '';
    let routes = [];
    let dealRoutes = (config) => {
        config.routes.forEach((item) => {
            let routeItem = config.routeMap[item];
            if (routeItem.routes.length > 0) {
                dealRoutes(routeItem);
            } else {
                if (props.acceptRoute === undefined || (props.acceptRoute !== undefined && props.acceptRoute.includes(item))) {
                    routes.push({ path: `${baseRoute}${routeItem.routePath.join('')}`, component: routeItem.component })
                }
            }
        })
    };
    dealRoutes(props.routeConfig);
    return (
        <Fragment>
            <Route exact path={baseRoute} component={routes[0] && routes[0].component} />
            {routes.map((item, index) =>
                <Route key={`route${index} `} path={item.path} component={item.component} />
            )}
        </Fragment>
    )
};

export default {
    Menu: CustomMenu,
    Routes: CustomRoutes
}