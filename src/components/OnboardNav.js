import React from 'react';

// import { Button } from 'reactstrap';
/* eslint react/prop-types: 0 */

const OnboardNav = (props) => {
  const dots = [];
  for (let i = 1; i <= props.totalSteps; i += 1) {
    const isActive = props.currentStep === i;
    dots.push((
      <li
        key={`step-${i}`}
        className={`list-inline-item ${isActive ? 'bg-warning' : ''}`}
      >
        Step {i}
      </li>
    ));
  }

  return (
    <div className="mb-4 d-flex justify-content-center">
      <ul className="list-inline">
        {dots}
      </ul>
    </div>
  );
};

export default OnboardNav;
