export default function shallowEqual(objA, objB){
    if(objA === objB){
        return true;
    }

    if(typeof objA !== 'object' || !objA || typeof objB !== 'object' || !objB){
        return false;
    }

    let keysA = Object.keys(objA);
    let keysB = Object.keys(objB);

    if(keysA.length !== keysB.length){
        return false;
    }

    let bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

    for(var idx = 0; idx < keysA.length; idx++){
        var key = keysA[idx];
        if(!bHasOwnProperty(key)){
            return false;
        }
        var valueA = objA[key];
        var valueB = objB[key];
        if(valueA !== valueB){
            return false;
        }
    }
    return true;
}