module.exports = function(uiDate) {
  console.log(uiDate)
    var rearranged = uiDate.substring(6,9) + '-' + uiDate.substring(3,4) + '-' + uiDate.substring(0,1)
    var newDate = new Date(rearranged) ;
    var yyyy = newDate.getFullYear().toString();
    var mm = (newDate.getMonth()+1).toString();
    var dd  = newDate.getDate().toString();
    return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0])
}
