import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Table from 'components/table';
import NoContent from 'components/no-content';
import Loading from 'components/loading';
import layout from 'styles/layout.scss';
import EspModelsProvider from 'providers/esp-models-provider';
import EspScenariosProvider from 'providers/esp-scenarios-provider';
import EspIndicatorsProvider from 'providers/esp-indicators-provider';
import styles from './emission-pathways-model-table-styles.scss';

class EmissionPathwaysModelTableComponent extends PureComponent {
  getTableContent() {
    const { loading, data, noContentMsg, sortBy, titleLinks } = this.props;
    if (loading) return <Loading light className={styles.loader} />;
    return data && data.length > 0 ? (
      <Table
        titleLinks={titleLinks}
        data={data}
        rowHeight={60}
        sortBy={sortBy}
      />
    ) : (
      <NoContent message={noContentMsg} />
    );
  }

  render() {
    return (
      <div className={layout.content}>
        <EspModelsProvider />
        <EspScenariosProvider />
        <EspIndicatorsProvider />
        {this.getTableContent()}
      </div>
    );
  }
}

EmissionPathwaysModelTableComponent.propTypes = {
  loading: PropTypes.bool,
  noContentMsg: PropTypes.string,
  data: PropTypes.array,
  titleLinks: PropTypes.array,
  sortBy: PropTypes.string
};

export default EmissionPathwaysModelTableComponent;
