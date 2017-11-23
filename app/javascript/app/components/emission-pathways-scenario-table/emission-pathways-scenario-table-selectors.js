import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import { deburrUpper } from 'app/utils';
import remove from 'lodash/remove';
import pick from 'lodash/pick';
import { ESP_BLACKLIST } from 'data/constants';
import { sortLabelByAlpha } from 'utils/graphs';

const getScenarioId = state => state.id || null;
const getQuery = state => deburrUpper(state.query) || '';
const getCategorySelected = state => state.categorySelected || null;
const getData = state =>
  (!isEmpty(state.espScenariosData) ? state.espScenariosData : null);

const getScenarioData = createSelector([getData, getScenarioId], (data, id) => {
  if (!data || !id) return null;
  return data.find(d => String(d.id) === id) || null;
});

const getIndicatorIds = createSelector(getScenarioData, data => {
  if (!data) return null;
  return data.indicators.map(i => i.id) || null;
});

const scenarioIndicatorsData = createSelector(
  [state => state.espIndicatorsData, getIndicatorIds],
  (indicatorsData, ids) => {
    if (!ids || isEmpty(indicatorsData) || isEmpty(ids)) return null;
    return indicatorsData.filter(i => ids.indexOf(i.id) > -1) || null;
  }
);

export const getCategories = createSelector(scenarioIndicatorsData, data => {
  if (!data) return null;
  return sortLabelByAlpha(
    uniq(data.map(c => c.category.name)).map(c => ({
      value: c,
      label: c
    }))
  );
});

export const getSelectedCategoryOption = createSelector(
  [getCategories, getCategorySelected],
  (categories, categorySelected) => {
    if (!categories || !categorySelected) return null;
    return categories.find(c => c.value === categorySelected);
  }
);

export const filterDataByBlackList = createSelector(
  [scenarioIndicatorsData],
  data => {
    if (!data || isEmpty(data)) return null;
    const whiteList = remove(
      Object.keys(data[0]),
      n => ESP_BLACKLIST.indicators.indexOf(n) === -1
    );
    return data.map(d => pick(d, whiteList));
  }
);

const flattenedData = createSelector([filterDataByBlackList], data => {
  if (!data || isEmpty(data)) return null;
  const attributesWithObjects = ['model', 'category', 'subcategory'];
  return data.map(d => {
    const flattenedD = d;
    attributesWithObjects.forEach(a => {
      if (Object.prototype.hasOwnProperty.call(d, a)) {
        flattenedD[a] = d[a] && d[a].name;
      }
    });
    return flattenedD;
  });
});

const filteredDataBySearch = createSelector(
  [flattenedData, getQuery],
  (data, query) => {
    if (!data) return null;
    if (!query) return data;
    return data.filter(d =>
      Object.keys(d).some(key => {
        if (Object.prototype.hasOwnProperty.call(d, key) && d[key] !== null) {
          return deburrUpper(d[key]).indexOf(query) > -1;
        }
        return false;
      })
    );
  }
);

export const filteredDataByCategory = createSelector(
  [filteredDataBySearch, getCategorySelected],
  (data, category) => {
    if (!data) return null;
    if (!category) return data;
    return data.filter(indicator => indicator.category.indexOf(category) > -1);
  }
);

export const defaultColumns = () => [
  'alias',
  'category',
  'subcategory',
  'trend'
];

export default {
  filteredDataByCategory,
  defaultColumns,
  getCategories,
  getSelectedCategoryOption
};
