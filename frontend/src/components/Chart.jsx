import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Chart = ({ type, data, title }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#b4b4c5',
                    font: {
                        size: 12,
                    },
                    padding: 15,
                },
            },
            title: {
                display: !!title,
                text: title,
                color: '#ffffff',
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
        },
        ...(type === 'bar' && {
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                    },
                    ticks: {
                        color: '#b4b4c5',
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                    ticks: {
                        color: '#b4b4c5',
                    },
                },
            },
        }),
    };

    return (
        <div style={{ height: '300px', position: 'relative' }}>
            {type === 'pie' ? (
                <Pie data={data} options={options} />
            ) : (
                <Bar data={data} options={options} />
            )}
        </div>
    );
};

export default Chart;
