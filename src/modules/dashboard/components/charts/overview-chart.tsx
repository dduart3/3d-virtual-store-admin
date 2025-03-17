import { useOrders } from "../../hooks/useOrders";
import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from "@/components/theme-provider";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function OverviewChart() {
    const { theme } = useTheme();

    const [chartData, setChartData] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            data: Array(12).fill(0),
            backgroundColor: theme === 'dark' ? '#ffffff' : '#0f172a',
            borderRadius: 4,
        }]
    });

    const { data: ordersData } = useOrders({ page: 1, pageSize: 1000 });

    useEffect(() => {
        if (ordersData?.orders) {
            const monthlyTotals = new Array(12).fill(0);

            ordersData.orders.forEach(order => {
                const month = new Date(order.created_at).getMonth();
                monthlyTotals[month] += Number(order.total);
            });

            setChartData(prev => ({
                ...prev,
                datasets: [{
                    ...prev.datasets[0],
                    data: monthlyTotals,
                    backgroundColor: theme === 'dark' ? '#ffffff' : '#0f172a',
                }]
            }));
        }
    }, [ordersData, theme]);

    return (
        <div className="h-[350px] w-full">
            <Bar options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: theme === 'dark' ? '#ffffff' : '#475569'
                        },
                        grid: {
                            color: theme === 'dark' ? '#ffffff20' : '#47556920'
                        }
                    },
                    x: {
                        ticks: {
                            color: theme === 'dark' ? '#ffffff' : '#475569'
                        },
                        grid: {
                            color: theme === 'dark' ? '#ffffff20' : '#47556920'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }} data={chartData} />
        </div>
    );
}

export default OverviewChart;