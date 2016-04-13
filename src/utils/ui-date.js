module.exports = function(inputDate) {

    if (typeof inputDate.getMonth === 'function') {

      // It's a date object
      var yyyy = inputDate.getFullYear().toString();
      var mm = (inputDate.getMonth()+1).toString();
      var dd  = inputDate.getDate().toString();
      return (dd[1]?dd:"0"+dd[0]) + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + yyyy

    } else {

      // It's a string
      var newDate = new Date(inputDate.substring(0,4)+'-'+inputDate.substring(5,7)+'-'+inputDate.substring(8,10));
      var yyyy = newDate.getFullYear().toString();
      var mm = (newDate.getMonth()+1).toString();
      var dd  = newDate.getDate().toString();
      return (dd[1]?dd:"0"+dd[0]) + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + yyyy

    }

}
