module.exports = function(_date) {
    var yyyy = _date.getFullYear().toString();
    var mm = (_date.getMonth()+1).toString();
    var dd  = _date.getDate().toString();
    return (dd[1]?dd:"0"+dd[0]) + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + yyyy
}
