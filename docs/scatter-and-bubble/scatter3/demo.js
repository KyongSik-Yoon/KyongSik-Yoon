window.onload = function () {
    const chart = Highcharts.chart('container', {

        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy'
        },

        legend: {
            enabled: false
        },

        title: {
            text: '액티브 서비스'
        },

        xAxis: {
            gridLineWidth: 1,
            title: {
                text: '평균 응답시간'
            },
            labels: {
                format: '{value} s'
            },
            plotLines: [{
                color: 'black',
                dashStyle: 'dot',
                width: 2,
                value: 65,
                label: {
                    rotation: 0,
                    y: 8,
                    style: {
                        fontStyle: 'italic'
                    },
                    text: 'Bad response'
                },
                zIndex: 3
            }],
            accessibility: {
                rangeDescription: 'Range: 60 to 100 grams.'
            }
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: '호출건수'
            },
            labels: {
                format: '{value}'
            },
            maxPadding: 0.2,
        },

        tooltip: {
            useHTML: true,
            headerFormat: '<table width=300px>',
            pointFormat: '<tr><th colspan="2"><h3>{point.name}</h3></th></tr>' +
                '<tr><th>호출건수:</th><td>{point.y}</td></tr>' +
                '<tr><th>응답시간(평균):</th><td>{point.x}</td></tr>' +
                '<tr><th>응답시간(합):</th><td>{point.z}</td></tr>' +
                '<tr><th>인스턴스:</th><td>{point.instCount}</td></tr>',
            footerFormat: '</table>',
            followPointer: true
        },

        plotOptions: {
            series: {
                animation: true,
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },
    });

    updateChartData();
    setInterval(updateChartData, 5000);

    function updateChartData() {
        // REST API 호출
        fetch('https://dev.jennifersoft.com/api/activeService/list?domain_id=7003&token=OhTFouCMJRZ')
            .then(response => response.json())
            .then(data => {
                var chartData = processData(data);

                while (chart.series.length > 0) {
                    chart.series[0].remove(true);
                }

                chart.addSeries(chartData);

            }).catch(error => console.error(error));
    }

    function processData(data) {
        const statisticByApp = {};

        for (const item of data.result) {
            const appName = item.application;
            const elapsedMillis = item.elapseTime;

            if (!statisticByApp[appName]) {
                statisticByApp[appName] = {
                    hitCount: 0,
                    elapsedMillisSum: 0,
                    instIds: {}
                };
            }
            statisticByApp[appName].hitCount++;
            statisticByApp[appName].elapsedMillisSum += elapsedMillis;
            if (!statisticByApp[appName].instIds[item.instanceId]) {
                statisticByApp[appName].instIds[item.instanceId] = null;
            }
        }

        const transformedData = Object.entries(statisticByApp).map((item) => {
            const appName = item[0];
            const statistics = item[1];
            const value = {
                name: appName,
                x: statistics.elapsedMillisSum / 1000 / statistics.hitCount,
                y: statistics.hitCount,
                z: statistics.elapsedMillisSum / 1000,
                instCount: Object.keys(statistics.instIds).length
            }
            return value;
        });

        return {
            data: transformedData,
            colorByPoint: true
        };
    }
}