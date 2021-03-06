import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { PieChart, TooltipChart } from 'cw-components';
import Card from 'components/card';

import NoContent from 'components/no-content';

import styles from './indicator-card-styles.scss';

const cardTheme = {
  card: styles.card,
  data: styles.cardData,
  contentContainer: styles.titleContainer
};

const renderLegend = (card, year) => {
  const hasData = card.chartData && card.chartData.some(l => l.value);
  return hasData ? (
    <div className={cx(styles.textHtmlWrapper, styles.legend)}>
      {card.legend.map(i => (
        <div
          key={i.title}
          dangerouslySetInnerHTML={{ __html: i.text }}
          className={styles.legendItem}
        />
      ))}
    </div>
  ) : (
    <NoContent
      message={
        card.noDataMessage || `No data for ${card.countryName} in ${year.value}`
      }
      className={styles.noContent}
      minHeight={100}
    />
  );
};

const renderBulletList = (card, year) => {
  const hasData = card.bulletList && card.bulletList.length;
  return hasData ? (
    <div className={cx(styles.textHtmlWrapper, styles.bulletList)}>
      <ul>
        {card.bulletList.map(text => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </div>
  ) : (
    <NoContent
      message={
        card.noDataMessage || `No data for ${card.countryName} in ${year.value}`
      }
      className={styles.noContent}
      minHeight={100}
    />
  );
};

const renderPopulationBarChart = ({ countryName, population }, year) => {
  const hasData = population.some(p => p.value != null);
  return hasData ? (
    <ul className={styles.populationBarsContainer}>
      {population.map(p => (
        <li
          key={`${p.value}-${p.label}-${countryName}-${year.value}`}
          className={styles.countryData}
          data-value={p.valueLabel}
        >
          <span
            data-label={p.label}
            style={{
              width: `${p.value}%`,
              height: '12px',
              backgroundColor: p.color,
              display: 'block'
            }}
          />
        </li>
      ))}
    </ul>
  ) : (
    <NoContent
      message={`No population data for ${countryName} on ${year.value}`}
      className={styles.noContent}
      minHeight={100}
    />
  );
};

const indicatorCardsComponent = ({ cards, selectedYear }) => (
  <div className={styles.cardsContainer}>
    {cards &&
      cards.map(card => (
        <Card title={card.title} theme={cardTheme} contentFirst>
          <div
            className={cx(styles.textHtmlWrapper, styles.introText)}
            dangerouslySetInnerHTML={{ __html: card.text }}
          />
          <div className={styles.cardContent}>
            {card.bulletList && renderBulletList(card, selectedYear)}
            {card.legend && renderLegend(card, selectedYear)}
            {card.chartData && card.chartData.some(l => l.value) && (
              <div className={styles.chart}>
                <PieChart
                  data={card.chartData}
                  width={150}
                  config={card.chartConfig}
                  customTooltip={
                    card.tooltipValueFormat ? (
                      <TooltipChart
                        getCustomYLabelFormat={card.tooltipValueFormat}
                      />
                    ) : null
                  }
                />
              </div>
            )}
            {card.rank && (
              <div
                className={cx(styles.textHtmlWrapper, styles.rank)}
                dangerouslySetInnerHTML={{ __html: card.rank }}
              />
            )}
            {card.population && renderPopulationBarChart(card, selectedYear)}
          </div>
          <div className={styles.yearData}>
            <span>{selectedYear && selectedYear.value}</span> data
          </div>
        </Card>
      ))}
  </div>
);

renderPopulationBarChart.propTypes = {
  countryName: PropTypes.string,
  population: PropTypes.arrayOf(PropTypes.shape({}))
};

indicatorCardsComponent.propTypes = {
  selectedYear: PropTypes.shape({}),
  cards: PropTypes.arrayOf(PropTypes.shape({}))
};

export default indicatorCardsComponent;
