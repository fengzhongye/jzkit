import React, { Component } from 'react';
import canUseDOM from './canUseDOM';
import shallowEqual from './shallowequal';

export default function withSideEffect(
    reducePropsToState,
    handleStateChangeOnClient,
    mapStateOnServer
){
    if(typeof reducePropsToState !== 'function'){
        throw new Error('reducePropsToState必须是一个函数');
    }
    if(typeof handleStateChangeOnClient !== 'function'){
        throw new Error('handleStateChangeOnClient必须是一个函数');
    }
    if(typeof mapStateOnServer !== 'undefined' && typeof mapStateOnServer !== 'function'){
        throw new Error('mapStateOnServer必须是函数或者undefined');
    }

    function getDisplayName(WrappedComponent){
        return WrappedComponent.displayName || WrappedComponent.name || 'Component';
    }

    return function wrap(WrappedComponent){
        if(typeof WrappedComponent !== 'function'){
            throw new Error('WrappedComponent必须是一个React组件');
        }
        let mountedInstances = [];
        let state;
        function emitChange(){
            state = reducePropsToState(mountedInstances.map(function(instance){
                return instance.props;
            }));
            if(canUseDOM){
                handleStateChangeOnClient(state);
            }else if(mapStateOnServer){
                state = mapStateOnServer(state);
            }
        }
        class SideEffect extends Component{
            static displayName = `SideEffect(${getDisplayName(WrappedComponent)})`;
            static peek(){
                return state;
            }
            static rewind(){
                if(SideEffect.canUseDOM){
                    throw new Error('rewind只能在服务器端调用，可以在浏览器端调用peek替代');
                }
                let recordedState = state;
                state = undefined;
                mountedInstances = [];
                return recordedState;
            }
            componentWillMount(){
                mountedInstances.push(this);
                emitChange();
            }
            shouldComponentUpdate(nextProps){
                return !shallowEqual(nextProps, this.props);
            }
            componentDidMount(){
                emitChange();
            }
            componentWillUnmount(){
                const index = mountedInstances.indexOf(this);
                mountedInstances.splice(index, 1);
                emitChange();
            }
            render(){
                return <WrappedComponent {...this.props}/>
            }
        }
        return SideEffect;
    }
}

