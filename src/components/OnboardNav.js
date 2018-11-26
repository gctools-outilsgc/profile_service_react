import React from 'react';

// import { Button } from 'reactstrap';
/* eslint react/prop-types: 0 */

const OnboardNav = (props) => {
  const dots = [];
  const words = [
    '',
    'personal info',
    'personal',
    'contact',
    'avatar',
    'team',
  ];
  for (let i = 1; i <= props.totalSteps; i += 1) {
    const isActive = props.currentStep === i;
    const displayNum = i - 1;
    switch (i) {
      case 1:
      case 6:
        dots.push('');
        break;
      default:
        dots.push((
          <li
            key={`step-${i}`}
            className={`nav-item ${isActive ? 'ob-active' : ''}`}
          >
            <div className="d-flex justify-content-center">
              <div className="display-num align-self-center">
                {displayNum}
              </div>
              <div className="display-text align-self-center">
                {words[i]}
              </div>
            </div>
          </li>
        ));
    }
  }

  return (
    <div className="mb-4 onboard-nav">
      <ul className="nav justify-content-center">
        {dots}
      </ul>
    </div>
  );
};

export default OnboardNav;
