import { Link, NavLink } from "react-router-dom";

const makeUrl = params => {
    if(typeof params === 'undefined')
    {
        return '';
    }
    return setTypeLink({
        typeLink: params.typeLink || 'Link',
        key: params.key || null,
        activeClassName: params.activeClassName || null,
        className: params.className || null,
        to: setTypeRoute(params) || null,
        name: params.name || null,
    })
};

const setTypeRoute = params => {
    let route = params.to;
    if(typeof params.type !== 'undefined')
    {
        switch (params.type) {
            case 'section':
                route = '/section/'+(params.to.replace(/[^a-zA-Z ]/g, "").replace(/ /g, '-').toLowerCase());
                break;
            case 'article':
                route = '/article/'+(Buffer.from(params.to).toString('base64'));
                break;
            default:
                route = params.to;
                break;
        }
    }
    return route;
}

const setTypeLink = params => {
    if(params.typeLink === 'NavLink')
    {
        const props = {
            key: params.key,
            activeClassName: params.activeClassName,
            className: params.className ,
            to: params.to
        }
        return (
            <NavLink {...props}>{(params.name || '')}</NavLink>
        );
    }
    else
    {
        const props = {
            key: params.key,
            className: params.className,
            to: params.to
        }
        return (
            <Link {...props}>{(params.name || '')}</Link>
        );
    }
}



export default makeUrl;