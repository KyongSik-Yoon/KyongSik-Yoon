window.onload = function () {
    let chart = Highcharts.chart('container', {
        chart: {
            type: 'packedbubble',
            height: '100%'
        },
        title: {
            text: 'Jennifer Active Service',
            align: 'left'
        },
        tooltip: {
            useHTML: true,
            pointFormat: '<b>{point.name}:</b> {point.value}m CO<sub>2</sub>'
        },
        plotOptions: {
            packedbubble: {
                useSimulation: true,
                minSize: 15,
                maxSize: 100,
                layoutAlgorithm: {
                    splitSeries: true,
                    seriesInteraction: false,
                    dragBetweenSeries: true,
                    parentNodeLimit: true,
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                    filter: {
                        property: 'y',
                        operator: '>',
                        value: 250
                    },
                    style: {
                        color: 'black',
                        textOutline: 'none',
                        fontWeight: 'normal'
                    }
                }
            }
        },
    });

    updateChartData();

    // 5초마다 API 호출 및 차트 업데이트
    setInterval(updateChartData, 10000);

    function updateChartData() {
        // REST API 호출
        fetch('https://dev.jennifersoft.com/api/activeService/list?domain_id=7908&token=OhTFouCMJRZ')
            .then(response => response.json())
            .then(data => {
                // 데이터 처리
                var chartData = processData(data);

                // 모든 시리즈 제거
                while (chart.series.length > 0) {
                    chart.series[0].remove(true);
                }

                // 새 시리즈 추가
                chartData.forEach(series => {
                    chart.addSeries(series)
                });


                // 차트 옵션 설정
                chart.update({
                    chart: {
                        type: 'packedbubble',
                    },
                    tooltip: {
                        useHTML: true,
                        pointFormat: '<b>{point.name}</b><br/>Elapsed(Avg): {point.value}<br/> Hit: {point.count}',
                        followPointer: false,
                    },
                    plotOptions: {
                        packedbubble: {
                            useSimulation: true,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}',
                                filter: {
                                    property: 'value',
                                    operator: '>',
                                    value: 10,
                                },
                                style: {
                                    color: 'black',
                                    textOutline: 'none',
                                    fontWeight: 'normal',
                                },
                            },

                        },
                    },
                });
            })
            .catch(error => console.error(error));
    }

    function processData(data) {
        const ranges = [
            { name: '0 - 3 sec', min: 0, max: 3000, apps: {} },
            { name: '3 - 5 sec', min: 3000, max: 5000, apps: {} },
            { name: '5 - 8 sec', min: 5000, max: 8000, apps: {} },
            { name: '> 8 sec', min: 8000, max: Infinity, apps: {} },
        ];

        for (const item of data.result) {
            const appName = item.application;
            const elapsedMillis = item.elapseTime;

            for (let i = 0; i < ranges.length; i++) {
                const range = ranges[i];
                if (elapsedMillis >= range.min && elapsedMillis < range.max) {
                    if (!range.apps[appName]) {
                        range.apps[appName] = {
                            count: 0,
                            elapsedMillisSum: 0,
                        }
                    }
                    range.apps[appName].elapsedMillisSum += elapsedMillis;
                    range.apps[appName].count++;
                }
            }
        }

        const transformedData = ranges.map(item => {
            const appData = Object.entries(item.apps);
            const value = appData.map(([appName, { count, elapsedMillisSum }]) => ({
                name: appName,
                value: elapsedMillisSum / 1000 / count,
                count: count
            }));

            return {
                name: item.name,
                data: value,
            };
        });

        return transformedData;
    }
}
