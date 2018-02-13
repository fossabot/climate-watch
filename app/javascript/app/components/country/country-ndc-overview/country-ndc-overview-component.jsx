import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/button';
import Card from 'components/card';
import Intro from 'components/intro';
import cx from 'classnames';
import Loading from 'components/loading';
import NoContent from 'components/no-content';
import InfoButton from 'components/button/info-button';
import { TabletLandscape, TabletPortraitOnly } from 'components/responsive';
import introTheme from 'styles/themes/intro/intro-simple.scss';
import layout from 'styles/layout.scss';
import styles from './country-ndc-overview-styles.scss';

class CountryNdcOverview extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function

  renderInfoAndCompareButtons() {
    const { iso, handleInfoClick } = this.props;
    return (
      <div className={styles.infoAndCompareButtons}>
        <InfoButton
          className={styles.infoBtn}
          infoOpen={false}
          handleInfoClick={handleInfoClick}
          box
        />
        <Button
          className={styles.exploreBtn}
          color="white"
          link={`/ndcs/compare/mitigation?locations=${iso}`}
        >
          Compare
        </Button>
      </div>
    );
  }

  renderExploreButton() {
    const { iso, handleAnalyticsClick } = this.props;
    return (
      <Button
        className={styles.exploreBtn}
        color="yellow"
        link={`/ndcs/country/${iso}`}
        onClick={handleAnalyticsClick}
      >
        Explore NDC content
      </Button>
    );
  }

  renderCards() {
    const { sectors, values } = this.props;
    return (
      <div>
        <h4 className={styles.subTitle}>Mitigation contribution</h4>
        <div className={styles.cards}>
          <div className={styles.cardsRowContainer}>
            <Card title="GHG Target">
              <div className={styles.cardContent}>
                {values && values.ghg_target_type ? (
                  <div>
                    <span className={styles.metaTitle}>Target type</span>
                    <p
                      className={styles.targetText}
                      dangerouslySetInnerHTML={{
                        // eslint-disable-line
                        __html: values.ghg_target_type[0].value
                      }}
                    />
                    <span className={styles.metaTitle}>Target year</span>
                    <p
                      className={styles.targetText}
                      dangerouslySetInnerHTML={{
                        // eslint-disable-line react/no-danger
                        __html: values.time_target_year[0].value
                      }}
                    />
                  </div>
                ) : (
                  <div className={styles.noContent}>Not included</div>
                )}
              </div>
            </Card>
            <Card title="Non-GHG Target">
              <div className={styles.cardContent}>
                {values && values.non_ghg_target ? (
                  <p
                    className={styles.targetText}
                    dangerouslySetInnerHTML={{
                      // eslint-disable-line react/no-danger
                      __html: values.non_ghg_target[0].value
                    }}
                  />
                ) : (
                  <div className={styles.noContent}>Not included</div>
                )}
              </div>
            </Card>
            <Card title="Identified Sectors for Mitigation Action">
              <div className={styles.cardContent}>
                {values && values.coverage_sectors_short ? (
                  <p
                    className={styles.targetText}
                    dangerouslySetInnerHTML={{
                      // eslint-disable-line react/no-danger
                      __html: values.coverage_sectors_short[0].value
                    }}
                  />
                ) : (
                  <div className={styles.noContent}>Not included</div>
                )}
              </div>
            </Card>
          </div>
          <div>
            <h4 className={cx(styles.subTitle, styles.adaptionList)}>
              Adaptation Contribution
            </h4>
            <Card title="Identified Sectors for Adaptation Action">
              <div className={styles.cardContent}>
                {sectors.length ? (
                  <ul className={styles.list}>
                    {sectors.map(sector => (
                      <li key={sector} className={styles.listItem}>
                        {sector}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.noContent}>Not included</div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { sectors, values, loading, actions } = this.props;
    const hasSectors = values && sectors;
    if (!hasSectors && !loading) {
      return (
        <NoContent
          message="No overview content data"
          className={styles.noContentWrapper}
        />
      );
    }

    const description = hasSectors && (
      <p
        className={styles.descriptionContainer}
        dangerouslySetInnerHTML={{
          // eslint-disable-line react/no-danger
          __html: values.indc_summary[0] && values.indc_summary[0].value
        }}
      />
    );

    return (
      <div className={styles.wrapper}>
        <div className={layout.content}>
          {loading && <Loading light className={styles.loader} />}
          {hasSectors && (
            <div className={styles.countryOverviewPadding}>
              <div className={cx(styles.header, actions ? styles.col2 : '')}>
                <Intro
                  theme={introTheme}
                  title={
                    actions ? (
                      'Nationally Determined Contribution (NDC) Overview'
                    ) : (
                      'Overview'
                    )
                  }
                />
                <TabletPortraitOnly>{description}</TabletPortraitOnly>
                {actions && (
                  <div className={styles.actions}>
                    {this.renderInfoAndCompareButtons()}
                    <TabletLandscape>
                      {this.renderExploreButton()}
                    </TabletLandscape>
                  </div>
                )}
              </div>
              <TabletLandscape>{description}</TabletLandscape>
              {this.renderCards()}
              <TabletPortraitOnly>
                {this.renderExploreButton()}
              </TabletPortraitOnly>
            </div>
          )}
        </div>
      </div>
    );
  }
}

CountryNdcOverview.propTypes = {
  iso: PropTypes.string,
  sectors: PropTypes.array,
  values: PropTypes.object,
  loading: PropTypes.bool,
  actions: PropTypes.bool,
  handleInfoClick: PropTypes.func.isRequired,
  handleAnalyticsClick: PropTypes.func.isRequired
};

export default CountryNdcOverview;