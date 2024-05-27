window.onload = function () {
    fetch('https://dev.jennifersoft.com/api/domain?token=OhTFouCMJRZ')
        .then(response => response.json())
        .then(data => {
            if (data) {
                const comboBox = document.getElementById('domain-id');
                data.result.forEach(item => {
                    const option = document.createElement('option');
                    option.text = item.name;
                    option.value = item.domainId;
                    comboBox.appendChild(option);
                });

                const desiredValue = 7003;
                for (let i = 0; i < comboBox.options.length; i++) {
                    if (comboBox.options[i].value == desiredValue) {
                        comboBox.selectedIndex = i;
                        break;
                    }
                }
                updateChartData();
            }
        })
        .catch(error => console.error('cannot get domain list:', error));

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
            text: '액티브 서비스(애플리케이션 단위)'
        },

        xAxis: {
            gridLineWidth: 1,
            max: 4,
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
                value: 3,
                label: {
                    rotation: 0,
                    y: 15,
                    style: {
                        fontStyle: 'italic'
                    },
                    text: '3s-5s'
                },
                zIndex: 3
            }, {
                color: 'black',
                dashStyle: 'dot',
                width: 2,
                value: 5,
                label: {
                    rotation: 0,
                    y: 15,
                    style: {
                        fontStyle: 'italic'
                    },
                    text: '5s-8s'
                },
                zIndex: 3
            }, {
                color: 'black',
                dashStyle: 'dot',
                width: 2,
                value: 8,
                label: {
                    rotation: 0,
                    y: 15,
                    style: {
                        fontStyle: 'italic'
                    },
                    text: '8s-'
                },
                zIndex: 3
            }],
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
                '<tr><th>호출건수(8초이상):</th><td>{point.z}</td></tr>' +
                '<tr><th>응답시간(평균):</th><td>{point.x}</td></tr>' +
                '<tr><th>인스턴스:</th><td>{point.instCount}</td></tr>',
            footerFormat: '</table>',
            followPointer: true
        },

        plotOptions: {
            series: {
                animation: true,
                dataLabels: {
                    enabled: true,
                    //format: '{point.name}'
                    formatter: function() {
                        if (this.point.z > 0) {
                            return this.point.name;
                        } else {
                            return '';
                        }
                    }
                }
            }
        },
    });

    setInterval(updateChartData, 4000);

    function updateChartData() {
        // REST API 호출
        const domainId = document.getElementById('domain-id').value;
        if (!domainId) {
            return;
        }
        fetch('https://dev.jennifersoft.com/api/activeService/list?domain_id=' + domainId + '&token=OhTFouCMJRZ')
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    var chartData = processData(data);
                    while (chart.series.length > 0) {
                        chart.series[0].remove(true);
                    }
                    chart.addSeries(chartData);
                }
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
                    badResponseCount: 0,
                    instIds: {}
                };
            }
            statisticByApp[appName].hitCount++;
            statisticByApp[appName].elapsedMillisSum += elapsedMillis;
            if (!statisticByApp[appName].instIds[item.instanceId]) {
                statisticByApp[appName].instIds[item.instanceId] = null;
            }
            if (elapsedMillis >= 8000) {
                statisticByApp[appName].badResponseCount++;
            }
        }

        const transformedData = Object.entries(statisticByApp).map((item) => {
            const appName = item[0];
            const statistic = item[1];
            const avgElaspedSecond = statistic.elapsedMillisSum / 1000 / statistic.hitCount

            var color = '#95D7FE'; // blue

            if (avgElaspedSecond >= 8 || statistic.badResponseCount > 0) {
                color = '#FDAD85'; // red 
            }

            // if (avgElaspedSecond >= 0) {
            //     color =  '#95D7FE';           
            // }
            // if (avgElaspedSecond >= 3) {
            //     color = '#C8F3F0';
            // }
            // if (avgElaspedSecond >= 5) {
            //     color = '#FEDAB4';
            // }
            // if (avgElaspedSecond >= 8) {
            //     color = '#FDAD85';
            // }

            const value = {
                name: appName,
                x: avgElaspedSecond,
                y: statistic.hitCount,
                z: statistic.badResponseCount,
                instCount: Object.keys(statistic.instIds).length,
                color: color
            }
            return value;
        });

        return {
            data: transformedData,
        };
    }
}
