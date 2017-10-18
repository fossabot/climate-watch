import React from 'react';
import PropTypes from 'prop-types';
import { themr } from 'react-css-themr';

import styles from './intro-styles.scss';

const Intro = props => {
  const { title, description, theme } = props;
  return (
    <div className={theme.intro}>
      <h2 className={theme.title}>{title}</h2>
      <p
        className={theme.description}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

Intro.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  theme: PropTypes.object
};

export default themr('Intro', styles)(Intro);
