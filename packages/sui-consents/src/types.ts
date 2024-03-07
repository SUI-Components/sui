export interface Purpose {
  consents: Record<number, boolean | undefined>
  legitimateInterests: Record<number, boolean>
}

export enum EventStatus {
  /**
   * This shall be the value for the eventStatus property of the TCData object
   * when a CMP is loaded and is prepared to surface a TC String to any
   * calling scripts on the page.
   *
   * A CMP is only prepared to surface a TC String for this eventStatus
   * if an existing, valid TC String is available to the CMP and it is not
   * intending to surface the UI. If, however, the CMP will surface the UI
   * because of an invalid TC String (e.g. it is too old, incorrect or does
   * not reflect all the information the CMP needs to gather from the user)
   * then an event with this eventStatus must not be triggered.
   */
  TC_LOADED = 'tcloaded',

  /**
   * This shall be the value for the eventStatus property of the TCData
   * object any time the UI is surfaced or re-surfaced, a TC String is
   * available and has rendered "Transparency" in accordance with the
   * TCF Policy.
   *
   * The CMP shall create a TC string with all the surfaced
   * vendors’ legitimate interest signals set to true and all the consent
   * signals set to false. If previous TC signals are present a CMP may
   * also merge those into the now-available TC String in accordance
   * with the policy.
   */
  CMP_UI_SHOWN = 'cmpuishown',

  /**
   * This shall be the value for the eventStatus property of the TCData
   * object whenever a user has confirmed or re-confirmed their choices
   * in accordance with TCF Policy and a CMP is prepared to respond to any
   * calling scripts with the corresponding TC String.
   */
  USER_ACTION_COMPLETE = 'useractioncomplete'
}
