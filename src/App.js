import React, { useEffect, useState } from 'react';
import Chart from "react-apexcharts";
import './App.css';

function App() {

  const [stocks, setStocks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [series, setSeries] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const bar = {
    options: {
      chart: {
        id: "basic-bar"
      },
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      xaxis: {
        categories: categories
      }
    },
    series: [
      {
        name: "series-1",
        data: series
      }
    ]
  }

  function fetchStocks() {
    console.log("fetch stocks");

    fetch('https://fathomless-anchorage-33685.herokuapp.com/')
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setStocks(data);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  function calculatePriceChange(stock) {
    let priceChange = stock.lastPrice - stock.priceThreeMonthsAgo;
    return (priceChange / stock.priceThreeMonthsAgo) * 100;
  }

  function populateBarChart() {
    let _categories = [];
    let _series = [];

    stocks.forEach(function(stock) {
      _categories.push(stock.name);
      _series.push(calculatePriceChange(stock).toFixed(2));
    });

    setCategories(_categories);
    setSeries(_series);
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    console.log("hello");
    if (stocks.length) {
      populateBarChart();
    }
  }, [stocks]);

  return (
    <div className="App">
      {isLoaded &&
        <>
          {stocks.length &&
            <ul>
              {stocks.map((stock) =>
                <li key={stock.id}>{stock.name} {stock.changePercent}</li>
              )}
            </ul>
          }
          {console.log(bar.options)}
          <Chart options={bar.options} series={bar.series} type="bar" height={350} />
        </>
      }
    </div>
  );
}

export default App;