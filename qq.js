/**
 * @param {Object|Array} obj
 * @return {boolean}
 */
const isEmpty = function(obj) {
    if(Object.values(obj).length===0)return console.log(true)
        console.log(false)
};

isEmpty({})
