import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook, faTwitter, faYoutube, faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import { Toast } from '@openedx/paragon';
import HeaderSlot from '../plugin-slots/HeaderSlot';
import PageLoading from '../generic/PageLoading';
import { getAccessDeniedRedirectUrl } from '../shared/access';
import { useModel } from '../generic/model-store';

import genericMessages from '../generic/messages';
import messages from './messages';
import LoadedTabPage from './LoadedTabPage';
import { setCallToActionToast } from '../course-home/data/slice';
import LaunchCourseHomeTourButton from '../product-tours/newUserCourseHomeTour/LaunchCourseHomeTourButton';

const TabPage = ({ intl, ...props }) => {
  const {
    activeTabSlug,
    courseId,
    courseStatus,
    metadataModel,
  } = props;
  const {
    toastBodyLink,
    toastBodyText,
    toastHeader,
  } = useSelector(state => state.courseHome);
  const dispatch = useDispatch();
  const {
    courseAccess,
    number,
    org,
    start,
    title,
  } = useModel('courseHomeMeta', courseId);

  if (courseStatus === 'denied') {
    const redirectUrl = getAccessDeniedRedirectUrl(courseId, activeTabSlug, courseAccess, start);
    if (redirectUrl) {
      return (<Navigate to={redirectUrl} replace />);
    }
  }

  return (
    <>
      {['loaded', 'denied'].includes(courseStatus) && (
        <>
          <Toast
            action={toastBodyText ? {
              label: toastBodyText,
              href: toastBodyLink,
            } : null}
            closeLabel={intl.formatMessage(genericMessages.close)}
            onClose={() => dispatch(setCallToActionToast({ header: '', link: null, link_text: null }))}
            show={!!(toastHeader)}
          >
            {toastHeader}
          </Toast>
          {metadataModel === 'courseHomeMeta' && (<LaunchCourseHomeTourButton srOnly />)}
        </>
      )}

      <HeaderSlot courseOrg={org} courseNumber={number} courseTitle={title} />

      {courseStatus === 'loading' && (
        <PageLoading srMessage={intl.formatMessage(messages.loading)} />
      )}

      {['loaded', 'denied'].includes(courseStatus) && (
        <LoadedTabPage {...props} />
      )}

      {/* courseStatus 'failed' and any other unexpected course status. */}
      {(!['loading', 'loaded', 'denied'].includes(courseStatus)) && (
        <p className="text-center py-5 mx-auto" style={{ maxWidth: '30em' }}>
          {intl.formatMessage(messages.failure)}
        </p>
      )}
      <div class="wrapper-footer wrapper">
        <footer class="primary container-fluid" role="contentinfo">
          <div class="row">
            <div class="col-sm1">
              <ul class="list-unstyled">
                <li><b>COMPANÍA</b></li>
                <li><a href="./about">Acerca de Atenea</a></li>
                <li><a href="https://atenea.com.ec">Equipo</a></li>
                <li><a href="./contact">Contacto</a></li>
              </ul>
            </div>
            <div class="col-sm1 uamx_footer-middle">
              <ul class="list-unstyled">
                <li><b>PRODUCTOS</b></li>
                <li><a href="./">Ecosistema Digital</a></li>
                <li><a href="./">Sector Público</a></li>
              </ul>
            </div>
            <div class="col-sm1 uamx_footer-middle">
              <ul class="list-unstyled">
                <li><b>LEGAL</b></li>
                <li><a href="./privacy">Política de privacidad</a></li>
                <li><a href="./tos">Términos del servicio</a></li>
              </ul>
            </div>
            <div class="col-sm1 last-col">
              <div class="footer-about-openedx">
                <h5>
                  <a href="https://app.atenea.digital/">
                    <img src="/static/logo_foot.png" alt="Atenea" width="140" />
                  </a>
                </h5>
              </div>
              <p>Aprende en nuestras redes:</p>
              <div class="social-wrapper">
                <div class="social">
                  <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="facebook"><FontAwesomeIcon icon={faFacebook} className="fa" /></a>
                  <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="twitter"><FontAwesomeIcon icon={faTwitter} className="fa" /></a>
                  <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" aria-label="youtube"><FontAwesomeIcon icon={faYoutube} className="fa" /></a>
                  <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="instagram"><FontAwesomeIcon icon={faInstagram} className="fa" /></a>
                </div>
              </div>
            </div>
          </div>
          <p class="copyright small">© 2022 <a href="https://app.atenea.digital/">Atenea Lifelong Learning</a></p>
        </footer>
      </div>
    </>
  );
};

TabPage.defaultProps = {
  courseId: null,
  unitId: null,
};

TabPage.propTypes = {
  activeTabSlug: PropTypes.string.isRequired,
  intl: intlShape.isRequired,
  courseId: PropTypes.string,
  courseStatus: PropTypes.string.isRequired,
  metadataModel: PropTypes.string.isRequired,
  unitId: PropTypes.string,
};

export default injectIntl(TabPage);
