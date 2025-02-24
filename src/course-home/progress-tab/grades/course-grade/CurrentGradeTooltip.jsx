import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { OverlayTrigger, Popover } from '@edx/paragon';

import { useModel } from '../../../../generic/model-store';

import messages from '../messages';

function CurrentGradeTooltip({ intl, tooltipClassName }) {
  const {
    courseId,
  } = useSelector(state => state.courseHome);

  const {
    courseGrade: {
      isPassing,
      percent,
    },
  } = useModel('progress', courseId);

  const currentGrade = Number((percent * 100).toFixed(0));

  return (
    <>
      <OverlayTrigger
        show
        placement="top"
        overlay={(
          <Popover id={`${isPassing ? 'passing' : 'non-passing'}-grade-tooltip`} aria-hidden="true" className={tooltipClassName}>
            <Popover.Content className={isPassing ? 'text-white' : 'text-dark-700'}>
              {currentGrade.toFixed(0)}%
            </Popover.Content>
          </Popover>
        )}
      >
        <g>
          <circle cx={`${Math.min(...[currentGrade, 100])}%`} cy="50%" r="8.5" fill="transparent" />
          <rect className="grade-bar__divider" x={`${Math.min(...[currentGrade, 100])}%`} style={{ transform: 'translateY(2.61em)' }} />
        </g>
      </OverlayTrigger>
      <text
        className="x-small"
        textAnchor={currentGrade < 50 ? 'start' : 'end'}
        x={`${Math.min(...[currentGrade, 100])}%`}
        y="20px"
        style={{ transform: `translateX(${currentGrade < 50 ? '' : '-'}3.4em)` }}
      >
        {intl.formatMessage(messages.currentGradeLabel)}
      </text>
    </>
  );
}

CurrentGradeTooltip.defaultProps = {
  tooltipClassName: '',
};

CurrentGradeTooltip.propTypes = {
  intl: intlShape.isRequired,
  tooltipClassName: PropTypes.string,
};

export default injectIntl(CurrentGradeTooltip);
