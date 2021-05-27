import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { AlertModal, Button, Spinner, Icon } from '@edx/paragon';
import { Check } from '@edx/paragon/icons';
import { FormattedMessage, injectIntl } from '@edx/frontend-platform/i18n';
import { sendActivationEmail } from '../../courseware/data';

function AccountActivationAlert() {
  const [showModal, setShowModal] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const handleOnClick = () => {
    setShowSpinner(true);
    setShowCheck(false);
    sendActivationEmail().then(() => {
      setShowSpinner(false);
      setShowCheck(true);
    });
  };

  const showAccountActivationAlert = Cookies.get('show-account-activation-popup');
  if (showAccountActivationAlert !== undefined) {
    Cookies.remove('show-account-activation-popup', { path: '/', domain: process.env.SESSION_COOKIE_DOMAIN });
    // extra check to make sure cookie was removed before updating the state. Updating the state without removal
    // of cookie would make it infinit rendering
    if (Cookies.get('show-account-activation-popup') === undefined) {
      setShowModal(true);
    }
  }

  const title = (
    <h3>
      <FormattedMessage
        id="account-activation.alert.title"
        defaultMessage="Activate your account so you can log back in"
        description="Title for account activation alert which is shown after the registration"
      />
    </h3>
  );

  const button = (
    <Button
      variant="primary"
      className=""
      onClick={() => setShowModal(false)}
    >
      <FormattedMessage
        id="account-activation.alert.button"
        defaultMessage="Continue to {siteName}"
        description="account activation alert continue button"
        values={{
          siteName: getConfig().SITE_NAME,
        }}
      />
    </Button>
  );

  const children = () => {
    let bodyContent = null;
    const message = (
      <FormattedMessage
        id="account-activation.alert.message"
        defaultMessage="We sent an email to {boldEmail} with a link to activate your account. Can’t find it? Check your spam folder or
        {sendEmailTag}."
        description="Message for account activation alert which is shown after the registration"
        values={{
          boldEmail: <b>{getAuthenticatedUser().email}</b>,
          sendEmailTag: (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a href="#" role="button" onClick={handleOnClick}>
              <FormattedMessage
                id="account-activation.resend.link"
                defaultMessage="resend the email"
                description="Message for resend link in account activation alert which is shown after the registration"
              />
            </a>
          ),
        }}
      />
    );
    bodyContent = (
      <p>
        {message}
      </p>
    );

    if (showCheck === false && showSpinner === true) {
      bodyContent = (
        <p>
          {message}
          <Spinner animation="border" variant="primary" size="sm" />
        </p>
      );
    }

    if (showCheck === true && showSpinner === false) {
      bodyContent = (
        <p>
          {message}
          <Icon src={Check} className="text-success account-activation-check" />
        </p>
      );
    }
    return bodyContent;
  };

  return (
    <AlertModal
      isOpen={showModal}
      title={title}
      footerNode={button}
      close={() => ({})}
    >
      {children()}
    </AlertModal>
  );
}

export default injectIntl(AccountActivationAlert);
