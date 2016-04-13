module.exports = function(inputDate) {


  if (typeof inputDate.getMonth === 'function') {

    // It's a date object
    var yyyy = inputDate.getFullYear().toString();
    var mm = (inputDate.getMonth()+1).toString();
    var dd  = inputDate.getDate().toString();
    return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0])

  } else {

    // It's a string
    var newDate = new Date(inputDate.substring(6,10)+'-'+inputDate.substring(3,5)+'-'+inputDate.substring(0,2));
    var yyyy = newDate.getFullYear().toString();
    var mm = (newDate.getMonth()+1).toString();
    var dd  = newDate.getDate().toString();
    return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0])

  }

}
