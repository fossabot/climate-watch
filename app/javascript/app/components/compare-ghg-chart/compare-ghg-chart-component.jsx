import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EmissionsProvider from 'providers/emissions-provider/emissions-provider';
import {
  MobileOnly,
  TabletLandscape,
  TabletPortraitOnly
} from 'components/responsive';
import EmissionsMetaProvider from 'providers/ghg-emissions-meta-provider';
import WbCountryDataProvider from 'providers/wb-country-data-provider';
import Dropdown from 'components/dropdown';
import Button from 'components/button';
import ButtonGroup from 'components/button-group';
import ModalMetadata from 'components/modal-metadata';
import Chart from 'components/charts/chart';
import layout from 'styles/layout.scss';
import styles from './compare-ghg-chart-styles.scss';

class CompareGhgChart extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  renderButtonGroup(reverseDropdown) {
    return (
      <ButtonGroup
        className={styles.colEnd}
        onInfoClick={this.props.handleInfoClick}
        shareUrl="/embed/ghg-emissions"
        analyticsGraphName="Ghg-emissions"
        reverseDropdown={reverseDropdown}
      />
    );
  }

  renderActionButtons(reverseDropdown) {
    const {
      handleInfoClick,
      handleAnalyticsClick,
      selectedLocationsFilter
    } = this.props;
    return [
      <ButtonGroup
        key="action1"
        className={styles.colEnd}
        onInfoClick={handleInfoClick}
        shareUrl="/embed/compare-ghg-chart"
        analyticsGraphName="Ghg-emissions"
        reverseDropdown={reverseDropdown}
      />,
      <Button
        key="action2"
        noSpace
        className={styles.colEnd}
        color="yellow"
        link={`/ghg-emissions?breakBy=location&filter=${selectedLocationsFilter}`}
        onClick={handleAnalyticsClick}
      >
        Explore emissions
      </Button>
    ];
  }

  render() {
    const {
      handleSourceChange,
      sourceOptions,
      sourceSelected,
      calculationOptions,
      calculationSelected,
      handleCalculationChange,
      providerFilters,
      selectedLocations,
      config,
      data,
      loading,
      needsWBData
    } = this.props;
    return (
      <div className={styles.section}>
        <div className={layout.content}>
          <EmissionsProvider filters={providerFilters} />
          <EmissionsMetaProvider />
          {needsWBData && <WbCountryDataProvider />}
          <h2 className={styles.title}>
            Historical GHG Emissions and Target Levels
          </h2>
          <div className="grid-column-item">
            <div className={styles.dropDownsLayout}>
              <Dropdown
                label="Source"
                options={sourceOptions}
                onValueChange={handleSourceChange}
                value={sourceSelected}
                hideResetButton
              />
              <Dropdown
                label="Calculation"
                options={calculationOptions}
                onValueChange={handleCalculationChange}
                value={calculationSelected}
                hideResetButton
              />
              <TabletLandscape>{this.renderActionButtons()}</TabletLandscape>
            </div>
          </div>
          <MobileOnly>
            {isMobile => (
              <Chart
                className={styles.chartWrapper}
                type="line"
                config={config}
                data={data}
                dataOptions={selectedLocations}
                dataSelected={selectedLocations}
                height={isMobile ? 350 : 500}
                loading={loading}
                hideRemoveOptions
              />
            )}
          </MobileOnly>
          <TabletPortraitOnly>
            <div className="grid-column-item">
              <div className={styles.mobileActionButtonsLayout}>
                {this.renderActionButtons(true)}
              </div>
            </div>
          </TabletPortraitOnly>
          <ModalMetadata />
        </div>
      </div>
    );
  }
}

CompareGhgChart.propTypes = {
  sourceOptions: PropTypes.array,
  sourceSelected: PropTypes.object,
  providerFilters: PropTypes.object,
  selectedLocations: PropTypes.array,
  data: PropTypes.array,
  config: PropTypes.object,
  handleSourceChange: PropTypes.func.isRequired,
  calculationOptions: PropTypes.array,
  calculationSelected: PropTypes.object,
  selectedLocationsFilter: PropTypes.array,
  handleCalculationChange: PropTypes.func.isRequired,
  handleInfoClick: PropTypes.func.isRequired,
  handleAnalyticsClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  needsWBData: PropTypes.bool.isRequired
};

export default CompareGhgChart;