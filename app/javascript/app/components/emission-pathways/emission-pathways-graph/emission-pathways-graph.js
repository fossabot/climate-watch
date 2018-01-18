import { PureComponent, createElement } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import qs from 'query-string';
import { getLocationParamUpdated } from 'utils/navigation';

import { actions as modalActions } from 'components/modal-overview';

import ownActions from './emission-pathways-graph-actions';
import reducers, { initialState } from './emission-pathways-graph-reducers';

import EmissionPathwayGraphComponent from './emission-pathways-graph-component';
import {
  getChartData,
  getChartConfig,
  getFiltersOptions,
  getFiltersSelected,
  getModalData
} from './emission-pathways-graph-selectors';

const actions = { ...ownActions, ...modalActions };

const mapStateToProps = (state, { location }) => {
  const { data } = state.espTimeSeries;
  const {
    currentLocation,
    model,
    indicator,
    scenario,
    category,
    subcategory
  } = qs.parse(location.search);
  const espData = {
    data,
    locations: state.espLocations.data,
    models: state.espModels.data,
    scenarios: state.espScenarios.data,
    indicators: state.espIndicators.data,
    location: currentLocation,
    model,
    indicator,
    scenario,
    category,
    subcategory
  };
  return {
    data: getChartData(espData),
    config: getChartConfig(espData),
    filtersLoading: {
      timeseries: state.espTimeSeries.loading,
      locations: state.espLocations.loading,
      models: state.espModels.loading,
      indicators: state.espIndicators.loading
    },
    filtersOptions: getFiltersOptions(espData),
    filtersSelected: getFiltersSelected(espData),
    modalData: getModalData(espData),
    loading:
      state.espTimeSeries.loading ||
      state.espLocations.loading ||
      state.espModels.loading ||
      state.espScenarios.loading ||
      state.espIndicators.loading
  };
};

class EmissionPathwayGraphContainer extends PureComponent {
  handleModelChange = model => {
    this.updateUrlParam([
      { name: 'model', value: model.value },
      {
        name: 'scenario',
        value: model.scenarios ? model.scenarios.toString() : ''
      }
    ]);
  };

  handleSelectorChange = (option, param, clear) => {
    if (param === 'subcategory') {
      this.updateUrlParam({ name: 'indicator', value: '' });
    }
    this.updateUrlParam(
      { name: param, value: option ? option.value : '' },
      clear
    );
  };

  updateUrlParam(params, clear) {
    const { history, location } = this.props;
    history.replace(getLocationParamUpdated(location, params, clear));
  }

  handleInfoClick = () => {
    this.props.toggleModalOverview({ open: true });
  };

  render() {
    return createElement(EmissionPathwayGraphComponent, {
      ...this.props,
      handleInfoClick: this.handleInfoClick,
      handleModelChange: this.handleModelChange,
      handleSelectorChange: this.handleSelectorChange
    });
  }
}

EmissionPathwayGraphContainer.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  toggleModalOverview: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default withRouter(
  connect(mapStateToProps, actions)(EmissionPathwayGraphContainer)
);
