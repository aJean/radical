/**
 * @file radical middleware
 */

function compose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg;
    }

    if (funcs.length === 1) {
        return funcs[0];
    }
    // 获取最后一个函数
    const last = funcs[funcs.length - 1];
    // 获取除最后一个以外的函数[0,length-1)
    const rest = funcs.slice(0, -1);
    // 通过函数 curry 化
    return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args));
}

function applyMiddleware(...middlewares) {
    const store = {dispatch: function(action) {console.log('end')}};
    let dispatch = store.dispatch;
    let chain = [];

    const middlewareAPI = {
        dispatch: (action) => dispatch(action)
    };
    chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {dispatch};
}

function test(api) {
    return next => action => {
        console.log(22)
        next(action);
    };
}

function log(api) {
    return next => action => {
        console.log('before');
        next(action);
        console.log('after');
    };
}

applyMiddleware(test, log).dispatch('end');