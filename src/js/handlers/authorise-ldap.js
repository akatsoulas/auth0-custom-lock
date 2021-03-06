var ui = require( 'helpers/ui' );
var fireGAEvent = require( 'helpers/fireGAEvent' );
var storeLastUsedConnection = require( 'helpers/storeLastUsedConnection' );
var isDev = require( 'helpers/isDev' );

module.exports = function authorise( element, secondTry ) {
  var form = element.tagName === 'FORM' ? element : element.form;
  var emailField = document.getElementById( 'field-email' );
  var passwordField = secondTry ? document.getElementById( 'field-password-try-2' ) : document.getElementById( 'field-password' );
  var errorText = document.getElementById( 'error-message-ldap' );
  var connection = isDev ? 'Mozilla-LDAP-Dev' : 'Mozilla-LDAP';

  if ( element.id === 'authorise-ldap-credentials-try-2' ) {
    passwordField = document.getElementById( 'field-password-try-2' );
  }

  ui.setLockState( element, 'loading' );

  fireGAEvent( 'Authorisation', 'Authorising with LDAP' );

  form.webAuth.redirect.loginWithCredentials({
    connection: connection,
    username: emailField.value,
    password: passwordField.value,
    scope: 'openid'
  }, function( error ) {

    if ( error && error.code === 'invalid_user_password' ) {
      errorText.lastElementChild.textContent = error.description;
      ui.setLockState( element, 'error-password' );
      fireGAEvent( 'Error', 'LDAP: invalid username or password' );
    }
  });

  storeLastUsedConnection( connection );
};
