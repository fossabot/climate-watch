import { combineReducers } from 'redux';
import { handleActions } from 'app/utils/redux';

import { reducers as countriesReducers } from 'providers/countries-provider';
import { reducers as autocompleteSearchReducers } from 'components/autocomplete-search';
import { reducers as countrySelectReducers } from 'components/countries-select';
import { reducers as NDCSReducers } from 'pages/ndcs';
import { reducers as countrySDGLinkagesReducers } from 'components/country-ndc-sdg-linkages';
import { reducers as countryNDCReducers } from 'pages/ndc-country';
import { reducers as countryNDCFullReducers } from 'pages/ndc-country-full';
import { reducers as mapReducers } from 'components/map';
import initialState from './data/initial-state';
import allActions from './actions';

export default combineReducers({
  ndcs: handleActions('ndcs', allActions, NDCSReducers, initialState),
  countries: handleActions(
    'countries',
    allActions,
    countriesReducers,
    initialState
  ),
  countrySDGLinkages: handleActions(
    'countrySDGLinkages',
    allActions,
    countrySDGLinkagesReducers,
    initialState
  ),
  countryNDC: handleActions(
    'countryNDC',
    allActions,
    countryNDCReducers,
    initialState
  ),
  countryNDCFull: handleActions(
    'countryNDCFull',
    allActions,
    countryNDCFullReducers,
    initialState
  ),
  countrySelect: handleActions(
    'countrySelect',
    allActions,
    countrySelectReducers,
    initialState
  ),
  map: handleActions('map', allActions, mapReducers, initialState),
  autocompleteSearch: handleActions(
    'autocompleteSearch',
    allActions,
    autocompleteSearchReducers,
    initialState
  )
});
