import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './themes';
import useSystemTheme from './useSystemTheme';

const ExchangeInfoPanel = ({ exchangeId }) => {
    const [data, setData] = useState(null);
    const [chartData, setChartData] = useState(null);
    const theme = useSystemTheme(); // автоматичне визначення теми

    useEffect(() => {
        const fetchData = () => {
            fetch(`https://api.example.com/exchange/${exchangeId}`)
                .then(res => res.json())
                .then(res => {
                    setData(res);
                    setChartData(formatChartData(res.history));
                });
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // 🔄 кожні 30 сек

        return () => clearInterval(interval);
    }, [exchangeId]);

    if (!data || !chartData) return <Loading>Завантаження...</Loading>;

    return (
        <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
            <Panel>
                <Header>
                    <Logo src={data.logo} alt={data.name} />
                    <Title>{data.name}</Title>
                </Header>
                <Stats>
                    <p>📈 Ціна: {data.price} AUD</p>
                    <p>🔻 Зміна: {data.change}%</p>
                    <p>💰 Обсяг: {data.volume} млн</p>
                </Stats>
                <ChartWrapper>
                    <Line data={chartData} options={chartOptions} />
                </ChartWrapper>
            </Panel>
        </ThemeProvider>
    );
};

