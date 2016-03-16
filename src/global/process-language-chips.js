module.exports = function(k) {

  var container = $('#language-'+k+'-chips');
  var language = $('#'+k+'-language');
  var level = $('#'+k+'-level');
  var langCode = $('#'+k+'-language option:selected').attr('data-lang');
  var levelCode = $('#'+k+'-level option:selected').attr('data-level');

  if (language.val() !== '' && level.val() !== '' && $('.chip[data-lang="'+langCode+'"]').length <= 0) {

    if (container.find($('.initial').length)) {
      container.find($('.initial')).remove();
    }

    container.append('<div class="language-'+k+'-chip chip" data-lang="'+langCode+'" data-level="'+levelCode+'">'+language.val()+' ('+level.val()+')<i class="material-icons">close</i></div>');

    language.select2('val', '');
    language.val('');

  }

}
