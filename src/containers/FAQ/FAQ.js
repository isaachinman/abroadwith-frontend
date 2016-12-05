import React, { Component, PropTypes } from 'react'
import { Grid, Row, Tab, MenuItem, Nav, NavDropdown, NavItem } from 'react-bootstrap'
import { translate } from 'react-i18next'

// Relative imports
import styles from './FAQ.styles.js'

@translate()
export default class FAQ extends Component {
  render() {
    const { t } = this.props
    return (
      <Grid style={styles.grid}>
        <Row>
          <h1 style={styles.h1}>{t('help.title')}</h1>
        </Row>
        <Row>
          <Tab.Container defaultActiveKey={1} id='FAQ'>

            <div>
              <Nav bsStyle='tabs'>

                <NavItem eventKey={1}>{t('help.general_section.title')}</NavItem>

                <NavDropdown title={t('help.student_section.title')}>
                  <MenuItem eventKey={2.1}>{t('help.student_section.general_section.title')}</MenuItem>
                  <MenuItem eventKey={2.2}>{t('help.student_section.pricing_section.title')}</MenuItem>
                  <MenuItem eventKey={2.3}>{t('help.student_section.amenities_section.title')}</MenuItem>
                  <MenuItem eventKey={2.4}>{t('help.student_section.insurance_visa_section.title')}</MenuItem>
                  <MenuItem eventKey={2.5}>{t('help.student_section.trust_safety_section.title')}</MenuItem>
                  <MenuItem eventKey={2.6}>{t('help.student_section.during_stay_section.title')}</MenuItem>
                </NavDropdown>

                <NavDropdown title={t('help.host_section.title')}>
                  <MenuItem eventKey={3.1}>{t('help.host_section.general_section.title')}</MenuItem>
                  <MenuItem eventKey={3.2}>{t('help.host_section.signing_up_section.title')}</MenuItem>
                  <MenuItem eventKey={3.3}>{t('help.host_section.create_profile_section.title')}</MenuItem>
                  <MenuItem eventKey={3.4}>{t('help.host_section.booking_section.title')}</MenuItem>
                  <MenuItem eventKey={3.5}>{t('help.host_section.after_arrival_section.title')}</MenuItem>
                  <MenuItem eventKey={3.6}>{t('help.host_section.trust_safety_section.title')}</MenuItem>
                  <MenuItem eventKey={3.7}>{t('help.host_section.troubleshooting_section.title')}</MenuItem>
                </NavDropdown>

              </Nav>

              <Tab.Content>

                <Tab.Pane eventKey={1}>
                  <h3>{t('help.general_section.what_is_abroadwith.title')}</h3>
                  <p>{t('help.general_section.what_is_abroadwith.first_platform')}</p>
                  <p>{t('help.general_section.what_is_abroadwith.hosts')}</p>
                  <p>{t('help.general_section.what_is_abroadwith.allowing')}</p>

                  <h3>{t('help.general_section.how_does_it_work.title')}</h3>
                  <p>{t('help.general_section.how_does_it_work.simple')}</p>
                  <p dangerouslySetInnerHTML={{ __html: t('help.general_section.how_does_it_work.how_to_guide') }} />

                  <h3>{t('help.general_section.why_abroadwith.title')}</h3>
                  <p>{t('help.general_section.why_abroadwith.founded')}</p>
                  <p>{t('help.general_section.why_abroadwith.market_value')}</p>
                  <p>{t('help.general_section.why_abroadwith.commission')}</p>

                  <h3>{t('help.general_section.define_homestay_immersion.title')}</h3>
                  <p>{t('help.general_section.define_homestay_immersion.accommodation_option')}</p>

                  <h3>{t('help.general_section.minimum_user_age_abroadwith.title')}</h3>
                  <p>{t('help.general_section.minimum_user_age_abroadwith.eighteen')}</p>

                  <h3>{t('help.general_section.sign_up_cost.title')}</h3>
                  <p>{t('help.general_section.sign_up_cost.free')}</p>

                  <h3>{t('help.general_section.abroadwith_fees.title')}</h3>
                  <p>{t('help.general_section.abroadwith_fees.commission')}</p>

                  <h3>{t('help.general_section.when_was_abroadwith_founded.title')}</h3>
                  <p>{t('help.general_section.when_was_abroadwith_founded.founded_in')}</p>

                  <h3>{t('help.general_section.how_to_search_cities.title')}</h3>
                  <p>{t('help.general_section.how_to_search_cities.type_it_in')}</p>
                </Tab.Pane>

                <Tab.Pane eventKey={2.1}>

                  <h3>{t('help.student_section.general_section.how_to_send_host_message.title')}</h3>
                  <p>{t('help.student_section.general_section.how_to_send_host_message.click_the_button')}</p>

                  <h3>{t('help.student_section.general_section.how_to_book.title')}</h3>
                  <p>{t('help.student_section.general_section.how_to_book.very_easy')}</p>

                  <h3>{t('help.student_section.general_section.booking_confirmation.title')}</h3>
                  <p>{t('help.student_section.general_section.booking_confirmation.confirmation_notification')}</p>

                  <h3>{t('help.student_section.general_section.no_host_response.title')}</h3>
                  <p>{t('help.student_section.general_section.no_host_response.forty_eight_hours')}</p>

                  <h3>{t('help.student_section.general_section.finding_desired_destination.title')}</h3>
                  <p>{t('help.student_section.general_section.finding_desired_destination.growing')}</p>

                  <h3>{t('help.student_section.general_section.knowing_host_availability.title')}</h3>
                  <p>{t('help.student_section.general_section.knowing_host_availability.showcase')}</p>

                  <h3>{t('help.student_section.general_section.how_to_pay.title')}</h3>
                  <p>{t('help.student_section.general_section.how_to_pay.payment_methods')}</p>

                  <h3>{t('help.student_section.general_section.how_to_cancel_bookings.title')}</h3>
                  <p>{t('help.student_section.general_section.how_to_cancel_bookings.cancellation')}</p>
                  <p>{t('help.student_section.general_section.how_to_cancel_bookings.standard_cancellation')}</p>
                  <p>{t('help.student_section.general_section.how_to_cancel_bookings.short_cancellation')}</p>

                  <h3>{t('help.student_section.general_section.when_host_cancels_booking.title')}</h3>
                  <p>{t('help.student_section.general_section.when_host_cancels_booking.not_charged')}</p>

                  <h3>{t('help.student_section.general_section.issues_with_bookings.title')}</h3>
                  <p>{t('help.student_section.general_section.issues_with_bookings.contact_us')}</p>

                  <h3>{t('help.student_section.general_section.modifying_booking_dates.title')}</h3>
                  <p>{t('help.student_section.general_section.modifying_booking_dates.contact_us')}</p>

                  <h3>{t('help.student_section.general_section.writing_reviews.title')}</h3>
                  <p>{t('help.student_section.general_section.writing_reviews.review_host')}</p>

                </Tab.Pane>

                <Tab.Pane eventKey={2.2}>

                  <h3>{t('help.student_section.pricing_section.included_in_price.title')}</h3>
                  <p>{t('help.student_section.pricing_section.included_in_price.basic_rate')}</p>

                  <h3>{t('help.student_section.pricing_section.asking_for_discounts.title')}</h3>
                  <p dangerouslySetInnerHTML={{ __html: t('help.student_section.pricing_section.asking_for_discounts.no') }} />

                  <h3>{t('help.student_section.pricing_section.paying_for_meals.title')}</h3>
                  <p>{t('help.student_section.pricing_section.paying_for_meals.meal_plan')}</p>

                  <h3>{t('help.student_section.pricing_section.are_towels_included.title')}</h3>
                  <p>{t('help.student_section.pricing_section.are_towels_included.ask_host')}</p>

                  <h3>{t('help.student_section.pricing_section.separate_charge_for_laundry.title')}</h3>
                  <p>{t('help.student_section.pricing_section.separate_charge_for_laundry.depends_on_host')}</p>

                </Tab.Pane>

                <Tab.Pane eventKey={2.3}>

                  <h3>{t('help.student_section.amenities_section.do_homestays_have_wifi.title')}</h3>
                  <p>{t('help.student_section.amenities_section.do_homestays_have_wifi.no')}</p>

                  <h3>{t('help.student_section.amenities_section.bringing_pets.title')}</h3>
                  <p>{t('help.student_section.amenities_section.bringing_pets.it_depends')}</p>

                </Tab.Pane>

                <Tab.Pane eventKey={2.4}>

                  <h3>{t('help.student_section.insurance_visa_section.who_organizes_visa.title')}</h3>
                  <p>{t('help.student_section.insurance_visa_section.who_organizes_visa.student_is_responsible')}</p>

                  <h3>{t('help.student_section.insurance_visa_section.is_insurance_needed.title')}</h3>
                  <p dangerouslySetInnerHTML={{ __html: t('help.student_section.insurance_visa_section.is_insurance_needed.yes') }} />

                  <h3>{t('help.student_section.insurance_visa_section.does_abroadwith_provide_insurance.title')}</h3>
                  <p dangerouslySetInnerHTML={{ __html: t('help.student_section.insurance_visa_section.does_abroadwith_provide_insurance.not_at_this_time') }} />

                </Tab.Pane>

                <Tab.Pane eventKey={2.5}>

                  <h3>{t('help.student_section.trust_safety_section.abroadwith_trust_and_safety.title')}</h3>
                  <p>{t('help.student_section.trust_safety_section.abroadwith_trust_and_safety.hosts_are_vetted')}</p>

                  <h3>{t('help.student_section.trust_safety_section.getting_verified.title')}</h3>
                  <p>{t('help.student_section.trust_safety_section.getting_verified.photo_id')}</p>

                  <h3>{t('help.student_section.trust_safety_section.what_info_is_shared_with_host.title')}</h3>
                  <p>{t('help.student_section.trust_safety_section.what_info_is_shared_with_host.public_data')}</p>

                  <h3>{t('help.student_section.trust_safety_section.is_my_host_real.title')}</h3>
                  <p>{t('help.student_section.trust_safety_section.is_my_host_real.hosts_interviewed')}</p>

                  <h3>{t('help.student_section.trust_safety_section.when_a_problem_arises.title')}</h3>
                  <p>{t('help.student_section.trust_safety_section.when_a_problem_arises.contact_us')}</p>

                </Tab.Pane>

                <Tab.Pane eventKey={2.6}>

                  <h3>{t('help.student_section.during_stay_section.not_getting_along_with_host.title')}</h3>
                  <p>{t('help.student_section.during_stay_section.not_getting_along_with_host.contact_us')}</p>

                </Tab.Pane>

                <Tab.Pane eventKey={3.1}>

                  <h3>{t('help.host_section.general_section.how_does_it_work.title')}</h3>
                  <p>{t('help.host_section.general_section.how_does_it_work.overview')}</p>

                  <h3>{t('help.host_section.general_section.why_host.title')}</h3>
                  <p>{t('help.host_section.general_section.why_host.the_pitch')}</p>

                  <h3>{t('help.host_section.general_section.who_can_host.title')}</h3>
                  <p>{t('help.host_section.general_section.who_can_host.nearly_anyone')}</p>

                  <h3>{t('help.host_section.general_section.who_are_guests.title')}</h3>
                  <p>{t('help.host_section.general_section.who_are_guests.nearly_anyone')}</p>

                  <h3>{t('help.host_section.general_section.length_of_stay.title')}</h3>
                  <p>{t('help.host_section.general_section.length_of_stay.it_depends')}</p>

                  <h3>{t('help.host_section.general_section.how_to_get_students.title')}</h3>
                  <p>{t('help.host_section.general_section.how_to_get_students.not_an_agency')}</p>

                  <h3>{t('help.host_section.general_section.room_availability_when_traveling.title')}</h3>
                  <p>{t('help.host_section.general_section.room_availability_when_traveling.no')}</p>

                  <h3>{t('help.host_section.general_section.payments.title')}</h3>
                  <p dangerouslySetInnerHTML={{ __html: t('help.host_section.general_section.payments.fill_out_payment_section') }} />

                  <h3>{t('help.host_section.general_section.deleting_account.title')}</h3>
                  <p>{t('help.host_section.general_section.deleting_account.not_for_everyone')}</p>
                  <p>{t('help.host_section.general_section.deleting_account.two_possible_cases')}</p>
                  <p dangerouslySetInnerHTML={{ __html: t('help.host_section.general_section.deleting_account.case_one') }} />
                  <p dangerouslySetInnerHTML={{ __html: t('help.host_section.general_section.deleting_account.case_two') }} />
                  <p>{t('help.host_section.general_section.deleting_account.important')}</p>
                  <p>{t('help.host_section.general_section.deleting_account.deleting_your_account')}</p>
                  <p>{t('help.host_section.general_section.deleting_account.step_1')}</p>
                  <p>{t('help.host_section.general_section.deleting_account.step_2')}</p>
                  <p>{t('help.host_section.general_section.deleting_account.step_3')}</p>
                  <p>{t('help.host_section.general_section.deleting_account.step_4')}</p>
                  <p dangerouslySetInnerHTML={{ __html: t('help.host_section.general_section.deleting_account.more_info') }} />

                  <h3>{t('help.host_section.general_section.what_happens_when_conflict_arises.title')}</h3>
                  <p>{t('help.host_section.general_section.what_happens_when_conflict_arises.we_mediate')}</p>

                </Tab.Pane>

                <Tab.Pane eventKey={3.2}>

                  <h3>{t('help.host_section.signing_up_section.how_to_sign_up.title')}</h3>
                  <p dangerouslySetInnerHTML={{ __html: t('help.host_section.signing_up_section.how_to_sign_up.simple') }} />

                  <h3>{t('help.host_section.signing_up_section.verifications.title')}</h3>
                  <p>{t('help.host_section.signing_up_section.verifications.personal_interview')}</p>
                  <p dangerouslySetInnerHTML={{ __html: t('help.host_section.signing_up_section.verifications.how_to') }} />

                  <h3>{t('help.host_section.signing_up_section.verifying_landline.title')}</h3>
                  <p dangerouslySetInnerHTML={{ __html: t('help.host_section.signing_up_section.verifying_landline.not_at_this_time') }} />

                  <h3>{t('help.host_section.signing_up_section.id_verification.title')}</h3>
                  <p>{t('help.host_section.signing_up_section.id_verification.government_id')}</p>

                  <h3>{t('help.host_section.signing_up_section.personal_home_verification.title')}</h3>
                  <p>{t('help.host_section.signing_up_section.personal_home_verification.sometimes')}</p>

                </Tab.Pane>

                <Tab.Pane eventKey={3.3}>

                  <h3>{t('help.host_section.create_profile_section.info_provided_for_signup.title')}</h3>
                  <p dangerouslySetInnerHTML={{ __html: t('help.host_section.create_profile_section.info_provided_for_signup.basic_info') }} />

                  <h3>{t('help.host_section.create_profile_section.photos_to_upload.title')}</h3>
                  <p>{t('help.host_section.create_profile_section.photos_to_upload.clean_and_clear')}</p>

                  <h3>{t('help.host_section.create_profile_section.room_photos.title')}</h3>
                  <p>{t('help.host_section.create_profile_section.room_photos.clutter_free')}</p>

                  <h3>{t('help.host_section.create_profile_section.house_rules.title')}</h3>
                  <p>{t('help.host_section.create_profile_section.house_rules.its_your_house')}</p>

                  <h3>{t('help.host_section.create_profile_section.what_is_included_in_base_rate.title')}</h3>
                  <p>{t('help.host_section.create_profile_section.what_is_included_in_base_rate.bed_and_breakfast')}</p>

                  <h3>{t('help.host_section.create_profile_section.what_to_charge.title')}</h3>
                  <p>{t('help.host_section.create_profile_section.what_to_charge.ask_us')}</p>

                  <h3>{t('help.host_section.create_profile_section.duration_of_stay.title')}</h3>
                  <p>{t('help.host_section.create_profile_section.duration_of_stay.no')}</p>

                  <h3>{t('help.host_section.create_profile_section.serving_breakfast.title')}</h3>
                  <p>{t('help.host_section.create_profile_section.serving_breakfast.either_way')}</p>

                  <h3>{t('help.host_section.create_profile_section.dinner_with_family.title')}</h3>
                  <p>{t('help.host_section.create_profile_section.dinner_with_family.either_way')}</p>

                  <h3>{t('help.host_section.create_profile_section.half_and_full_board.title')}</h3>
                  <p>{t('help.host_section.create_profile_section.half_and_full_board.explanation')}</p>

                </Tab.Pane>

                <Tab.Pane eventKey={3.4}>

                  <h3>{t('help.host_section.booking_section.booking_process.title')}</h3>
                  <p>{t('help.host_section.booking_section.booking_process.overview')}</p>

                  <h3>{t('help.host_section.booking_section.booking_expectations.title')}</h3>
                  <p>{t('help.host_section.booking_section.booking_expectations.it_depends')}</p>

                  <h3>{t('help.host_section.booking_section.one_time_fee.title')}</h3>
                  <p>{t('help.host_section.booking_section.one_time_fee.yes')}</p>

                  <h3>{t('help.host_section.booking_section.getting_paid.title')}</h3>
                  <p>{t('help.host_section.booking_section.getting_paid.commencement')}</p>
                  <p>{t('help.host_section.booking_section.getting_paid.delays')}</p>
                  <p>{t('help.host_section.booking_section.getting_paid.accurate_info')}</p>

                  <h3>{t('help.host_section.booking_section.cancelling_bookings.title')}</h3>
                  <p dangerouslySetInnerHTML={{ __html: t('help.host_section.booking_section.cancelling_bookings.timeframe') }} />
                  <p>{t('help.host_section.booking_section.cancelling_bookings.standard_cancellation')}</p>
                  <p>{t('help.host_section.booking_section.cancelling_bookings.short_cancellation')}</p>

                  <h3>{t('help.host_section.booking_section.messaging_guests.title')}</h3>
                  <p>{t('help.host_section.booking_section.messaging_guests.notification')}</p>

                  <h3>{t('help.host_section.booking_section.messaging_time_limit.title')}</h3>
                  <p>{t('help.host_section.booking_section.messaging_time_limit.not_for_messaging')}</p>

                  <h3>{t('help.host_section.booking_section.communicating_with_student.title')}</h3>
                  <p>{t('help.host_section.booking_section.communicating_with_student.break_the_ice')}</p>

                  <h3>{t('help.host_section.booking_section.booking_direct.title')}</h3>
                  <p dangerouslySetInnerHTML={{ __html: t('help.host_section.booking_section.booking_direct.against_toc') }} />

                  <h3>{t('help.host_section.booking_section.student_profile_photo.title')}</h3>
                  <p>{t('help.host_section.booking_section.student_profile_photo.yes')}</p>

                  <h3>{t('help.host_section.booking_section.paying_taxes.title')}</h3>
                  <p dangerouslySetInnerHTML={{ __html: t('help.host_section.booking_section.paying_taxes.it_depends') }} />

                </Tab.Pane>

                <Tab.Pane eventKey={3.5}>

                  <h3>{t('help.host_section.after_arrival_section.preparing_to_host.title')}</h3>
                  <p>{t('help.host_section.after_arrival_section.preparing_to_host.contact_us')}</p>

                  <h3>{t('help.host_section.after_arrival_section.providing_house_key.title')}</h3>
                  <p>{t('help.host_section.after_arrival_section.providing_house_key.it_depends')}</p>

                  <h3>{t('help.host_section.after_arrival_section.student_language_school.title')}</h3>
                  <p>{t('help.host_section.after_arrival_section.student_language_school.no')}</p>

                  <h3>{t('help.host_section.after_arrival_section.conflict_resolution.title')}</h3>
                  <p dangerouslySetInnerHTML={{ __html: t('help.host_section.after_arrival_section.conflict_resolution.contact_us') }} />

                  <h3>{t('help.host_section.after_arrival_section.emergency_number.title')}</h3>
                  <p>{t('help.host_section.after_arrival_section.emergency_number.country_manager')}</p>

                  <h3>{t('help.host_section.after_arrival_section.parent_contact_info.title')}</h3>
                  <p>{t('help.host_section.after_arrival_section.parent_contact_info.yes')}</p>

                </Tab.Pane>

                <Tab.Pane eventKey={3.6}>

                  <h3>{t('help.host_section.trust_safety_section.meeting_prior_to_arrival.title')}</h3>
                  <p>{t('help.host_section.trust_safety_section.meeting_prior_to_arrival.not_in_person')}</p>

                  <h3>{t('help.host_section.trust_safety_section.student_background_checks.title')}</h3>
                  <p>{t('help.host_section.trust_safety_section.student_background_checks.not_really')}</p>

                  <h3>{t('help.host_section.trust_safety_section.liability_for_damages.title')}</h3>
                  <p>{t('help.host_section.trust_safety_section.liability_for_damages.not_us')}</p>

                  <h3>{t('help.host_section.trust_safety_section.needing_insurance.title')}</h3>
                  <p>{t('help.host_section.trust_safety_section.needing_insurance.probably')}</p>

                  <h3>{t('help.host_section.trust_safety_section.security_of_private_info.title')}</h3>
                  <p dangerouslySetInnerHTML={{ __html: t('help.host_section.trust_safety_section.security_of_private_info.yes_secure') }} />

                  <h3>{t('help.host_section.trust_safety_section.storing_payment_info.title')}</h3>
                  <p>{t('help.host_section.trust_safety_section.storing_payment_info.we_dont')}</p>

                </Tab.Pane>

                <Tab.Pane eventKey={3.7}>

                  <h3>{t('help.host_section.troubleshooting_section.how_to_change_email.title')}</h3>
                  <p>{t('help.host_section.troubleshooting_section.how_to_change_email.you_cannot')}</p>

                  <h3>{t('help.host_section.troubleshooting_section.how_to_update_phone.title')}</h3>
                  <p>{t('help.host_section.troubleshooting_section.how_to_update_phone.you_cannot')}</p>

                  <h3>{t('help.host_section.troubleshooting_section.editing_profile.title')}</h3>
                  <p>{t('help.host_section.troubleshooting_section.editing_profile.click_on_your_home')}</p>
                  <p>{t('help.host_section.troubleshooting_section.editing_profile.click_on_your_profile')}</p>

                  <h3>{t('help.host_section.troubleshooting_section.changing_pricing.title')}</h3>
                  <p>{t('help.host_section.troubleshooting_section.changing_pricing.you_can_change')}</p>

                </Tab.Pane>


              </Tab.Content>

            </div>

          </Tab.Container>
        </Row>
      </Grid>
    )
  }
}

FAQ.propTypes = {
  t: PropTypes.func,
}
