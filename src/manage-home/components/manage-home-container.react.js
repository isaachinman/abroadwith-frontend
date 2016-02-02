var React =               require('react');
var BasicsTab =           require('./basics-tab.react');
var ImmersionsTab =       require('./immersions-tab.react');
var LocationTab =         require('./location-tab.react');
var DescriptionTab =      require('./description-tab.react');
var RoomsTab =            require('./rooms-tab.react');
var PhotosTab =           require('./photos-tab.react');
var PricingTab =          require('./pricing-tab.react');

module.exports = React.createClass({
  getInitialState: function(){
    return {
      // State will be populated by POST
    }
  },
  handleChange: function() {

    console.log(url);

    $.post(url, function(data) {
      var response = JSON.parse(data);
      var newState = {
        // Set new state vars
      }

      if (this.isMounted()) {
        this.setState(newState);
      }
    })
  },
  componentDidMount: function() {

    window.handleChange = this.handleChange;

    // Language-known select
      $('select#language-sought').select2({
        placeholder: "Choose a language you want to learn"
      });

    // Set permanent vars
    var addLanguage = $('a#add-language');
    var chipContainer = $('#language-chips');
    var languageSought = $('#language-sought');

    addLanguage.click(function() {

      // Set conditional vars
      var languageCode = $('#language-sought option:selected').attr('data-lang');

      if (languageSought.val() != '' && $('.chip[data-lang="'+languageCode+'"]').length <= 0) {

        // Remove initial chip
        if ($('#language-chips').find($('.initial').length)) {
          $('#language-chips').find($('.initial')).remove();
        }

        var newLanguage = '<div class="language-chip chip" data-lang="' + languageCode + '">' + languageSought.val() + '<i class="material-icons">close</i></div>'
        chipContainer.append(newLanguage);

        languageSought.select2('val', '');
        languageSought.val('');
        discount.select2('val', '');

      }
    })

    // Home photos
    var photos = $('.home-photo');
    photos.find('.delete').click(function() {
      $(this).parentsUntil('.col').remove()
    })


    // Next button
    $('a#next-btn').click(function() {
      var activeTab = $('li.tab a.active');
      if (activeTab.attr('data-next')) {
        var next = activeTab.data('next');
        $('ul.tabs').tabs('select_tab', next);
        console.log('switched')
      }
    })

    $.post(this.props.source, function(data) {

      // Parse the response
      var response = JSON.parse(data);

      var newState = {
        // Set initial state vars
      }

      if (this.isMounted()) {
        this.setState(newState);
      }
    }.bind(this));
  },
  render: function() {
    return (

      <div>
        <div className="row manage-home">
          <div className="col s12 no-padding-sides">
            <ul className="tabs">
              <li className="tab"><a className='active' href="#basics" data-next='immersions'>Basics</a></li>
              <li className="tab"><a href="#immersions" data-next='location'>Immersions</a></li>
              <li id='location-tab' className="tab"><a href="#location" data-next='description'>Location</a></li>
              <li className="tab"><a href="#description" data-next='rooms'>Description</a></li>
              <li className="tab"><a href="#rooms" data-next='photos'>Rooms</a></li>
              <li className="tab"><a href="#photos" data-next='pricing'>Photos</a></li>
              <li className="tab"><a href="#pricing">Pricing</a></li>
            </ul>
          </div>

          <BasicsTab />
          <ImmersionsTab />
          <LocationTab />
          <DescriptionTab />
          <PhotosTab />
          <RoomsTab />
          <PricingTab />

        </div>

        <div className='row'>
          <div className='col s6 offset-s3'>
            <a className='btn btn-primary save-btn'>Save</a>
          </div>
          <div className='col s3 right-align'>
            <a id='next-btn'><i className="fa fa-chevron-right grey-text text-lighten-1 next-btn"></i></a>
          </div>
        </div>

        <div className='manage-home-info-text'>
          <h6>Now managing your home in Berlin</h6>
        </div>
      </div>

    );
  }
});
