import React, { useState, useEffect } from 'react';
import './home.css';
import { FaHome, FaUsers, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Users from '../Users/Users';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

const Home = ({ onLogout }) => {
    const [activeView, setActiveView] = useState('dashboard');
    const [dateRange, setDateRange] = useState({
        from: new Date('2025-01-01'),
        to: new Date()
    });
    
    const [summaryData, setSummaryData] = useState({
        total_users: 0,
        successful_proposals: 0,
        total_proposals_requested: 0,
        success_rate: 0,
    });
    const [dashboardData, setDashboardData] = useState({
        successful_proposals: 0,
        total_proposals_requested: 0,
        average_processing_time: 0,
        success_rate: 0,
        lead_source_stats: {},
        lead_sources: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryResponse, dashboardResponse] = await Promise.all([
                    fetch(`${process.env.REACT_APP_BASE_URL}/summary`),
                    fetch(`${process.env.REACT_APP_BASE_URL}/dashboard?start_date=${dateRange.from.toISOString().split('T')[0]}&end_date=${dateRange.to.toISOString().split('T')[0]}`)
                ]);

                const summaryResult = await summaryResponse.json();
                const dashboardResult = await dashboardResponse.json();

                setSummaryData(summaryResult.data);
                setDashboardData(dashboardResult.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [dateRange]);

    const chartData = {
        labels: ['Delivered', 'Not Delivered'],
        datasets: [{
            data: [dashboardData.successful_proposals, dashboardData.total_proposals_requested - dashboardData.successful_proposals],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384']
        }]
    };

    const barChartData = {
        labels: ['SunnyAI', 'Castaways','Meta','Solar Reviews','Google'],
        datasets: [{
            label: 'Number of Proposals',
            // data:[20,30,10, 10, 10],
            data: [ dashboardData.lead_source_stats.unknown, dashboardData.lead_source_stats.Castaways, dashboardData.lead_source_stats.Meta, dashboardData.lead_source_stats.SolarReviews, dashboardData.lead_source_stats.Fixr],
            backgroundColor: ['#2196F3', '#FF6384', '#FFCE56', '#4BC0C0', '#949FB1'],
            borderColor: '#2196F3',
            borderWidth: 0
        }]
    };

    const barChartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Proposals',
                    color: '#000'
                },
                ticks: {
                    color: '#000'
                },
                grid: {
                    display: false
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Lead Types',
                    color: '#000'
                },
                ticks: {
                    color: '#000'
                },
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#000'
                }
            }
        }
    };

    const renderContent = () => {
        switch (activeView) {
            case 'users':
                return (
                    <div className="users-content">
                        <div className="dashboard-cards">
                            <div className="card">
                                <h3>Total Users</h3>
                                <p className="card-value">{summaryData?.total_users || 0}</p>
                            </div>
                            <div className="card">
                                <h3>Proposals Requested</h3>
                                <p className="card-value">{summaryData?.total_proposals_requested || 0}</p>
                            </div>
                            <div className="card">
                                <h3>Proposals Delivered</h3>
                                <p className="card-value">{summaryData?.successful_proposals || 0}</p>
                            </div>
                            <div className="card">
                                <h3>Success Rate</h3>
                                <p className="card-value">{summaryData?.success_rate || 0}%</p>
                            </div>
                        </div>
                        <div className="user-database-section">
                            <Users />
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="dashboard-content">
                        <div className="activity-header">
                            <div className="activity-title">
                                <h2>Activity</h2>
                            </div>
                            <div className="date-picker-section">
                                <div className="d-flex align-items-center">
                                    <span>From:</span>
                                    <DatePicker
                                        selected={dateRange.from}
                                        onChange={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                                        className="form-control"
                                        dateFormat="yyyy-MM-dd"
                                        maxDate={dateRange.to}
                                        placeholderText="Select start date"
                                    />
                                    <span style={{ margin: '0 10px' }}>To:</span>
                                    <DatePicker
                                        selected={dateRange.to}
                                        onChange={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                                        className="form-control"
                                        dateFormat="yyyy-MM-dd"
                                        minDate={dateRange.from}
                                        maxDate={new Date()}
                                        placeholderText="Select end date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-cards">
                            <div className="card">
                                <h3>Proposals Requested</h3>
                                <p className="card-value">{dashboardData?.total_proposals_requested || 0}</p>
                            </div>
                            <div className="card">
                                <h3>Proposals Delivered</h3>
                                <p className="card-value">{dashboardData?.successful_proposals || 0}</p>
                            </div>
                            <div className="card">
                                <h3>Average Processing Time</h3>
                                <p className="card-value">{dashboardData?.average_processing_time || 0}</p>
                            </div>
                            <div className="card">
                                <h3>Success Rate</h3>
                                <p className="card-value">{dashboardData?.success_rate || 0}%</p>
                            </div>
                        </div>
                        <div className="dashboard-charts">
                            <div className="chart-section">
                                <h2>Proposals Stats</h2>
                                <div className="chart-container">
                                    <Pie data={chartData} />
                                </div>
                            </div>
                            <div className="chart-section">
                                <h2>Lead Source</h2>
                                <div className="chart-container BarChart">
                                    <Bar data={barChartData} options={barChartOptions} style={{ width: '100%', height: '100% !important' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="admin-container">
            <nav className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                <ul className="sidebar-menu">
                    <li className={activeView === 'dashboard' ? 'active' : ''} 
                        onClick={() => setActiveView('dashboard')}>
                        <FaHome className="menu-icon" />
                        <span>Dashboard</span>
                    </li>
                    <li className={activeView === 'users' ? 'active' : ''} 
                        onClick={() => setActiveView('users')}>
                        <FaUsers className="menu-icon" />
                        <span>Users</span>
                    </li>
                </ul>
                <div className="sidebar-footer">
                    <button onClick={onLogout} className="logout-button">
                        <FaSignOutAlt className="menu-icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </nav>
            <main className="admin-main">
                <header className="admin-header">
                    <h1>{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h1>
                    <div className="user-info">
                        <span>Welcome, Admin</span>
                    </div>
                </header>
                <div className="admin-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Home;