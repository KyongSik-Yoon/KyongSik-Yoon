Highcharts.setOptions({
    colors: ['rgba(5,141,199,0.5)', 'rgba(80,180,50,0.5)', 'rgba(237,86,27,0.5)', 'rgba(255,0,0,1)']
});

const series = [{
    name: '0-3',
    id: '0-3',
    marker: {
        symbol: 'circle'
    },
    min: 0,
    max: 3000
},
{
    name: '3-5',
    id: '3-5',
    marker: {
        symbol: 'triangle'
    },
    min: 3000,
    max: 5000,
},
{
    name: '5-8',
    id: '5-8',
    marker: {
        symbol: 'circle'
    },
    min: 5000,
    max: 8000
},
{
    name: '8-',
    id: '8-',
    marker: {
        symbol: 'square'
    },
    min: 8000,
    max: Infinity
}];


async function getData() {
    const response = await fetch(
        'https://dev.jennifersoft.com/api/activeService/list?domain_id=7908&token=OhTFouCMJRZ'
    );
    return response.json();
}

updateChart();
setInterval(updateChart, 2000);


function updateChart() {
    getData().then(data => {
        const getData = (min, max) => {
            const temp = [];
            data.result.forEach(elm => {
                if (elm.elapseTime >= min && elm.elapseTime < max) {
                    temp.push([elm.startTime, elm.elapseTime / 1000, { name: elm.application, domainId: elm.domainId, instanceId: elm.instanceId }]);
                }
            });
            return temp;
        };
        series.forEach(s => {
            s.data = getData(s.min, s.max);
        });
    
        Highcharts.chart('container', {
            chart: {
                type: 'scatter',
                zoomType: 'xy'
            },
            title: {
                text: '액티브 서비스',
                align: 'left'
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: '시작시간'
                },
                labels: {
                    formatter: function () {
                        const date = new Date(this.value);
                        const hours = date.getHours();
                        const minutes = String(date.getMinutes()).padStart(2, '0');
                        const seconds = String(date.getSeconds()).padStart(2, '0');
                        return `${hours}:${minutes}:${seconds}`;
                    }
                },
                startOnTick: true,
                endOnTick: true,
                showLastLabel: true
            },
            yAxis: {
                title: {
                    text: '응답시간'
                },
                labels: {
                    format: '{value} s'
                }
            },
            legend: {
                enabled: true
            },
            plotOptions: {
                series: {
                    animation: false // 애니메이션 효과 없앰
                },
                scatter: {
                    marker: {
                        radius: 2.5,
                        symbol: 'circle',
                        states: {
                            hover: {
                                enabled: true,
                                lineColor: 'rgb(100,100,100)'
                            }
                        }
                    },
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    },
                    jitter: {
                        x: 0.005
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    const date = new Date(this.x);
                    const hours = date.getHours();
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const seconds = String(date.getSeconds()).padStart(2, '0');
                    const formattedTime = `${hours}:${minutes}:${seconds}`;
    
                    return `<b>시작시간:</b> ${formattedTime}<br/><b>응답시간:</b> ${this.y}`;
                }
            },
            series
        });
    });    
}

