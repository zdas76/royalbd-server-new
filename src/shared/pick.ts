const pick =<T extends Record<string, unknown>, K extends keyof T> (obj:T, keys:K[]):Partial<T> => {
    const fielderObj:Partial<T> = {};
    
    for(const key of keys){
      if(obj && Object.hasOwnProperty.call(obj, key)){
        fielderObj[key] = obj[key]
      }
    }
    return fielderObj
    }

    export default pick;