$(function() {
  $('img').each(function() {
    var src = $(this).attr('src');
    if (src.indexOf('w=10') > -1) {
      src = src.replace('w=10','')
      $(this).attr('src',src)
      console.log(src)
    }
  })
})
