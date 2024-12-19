import React, { useState, useEffect } from 'react';
import './OrderHistory.css';

import {
    fetchOrderHistories,
    fetchOrderHistory,
} from './services';

function OrderHistory() {
    const [orderHistories, setOrderHistories] = useState([]); 
    const [expandedTimestamp, setExpandedTimestamp] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchOrderHistories()
            .then((data) => {
                const histories = Object.entries(data || {}).map(([timestamp, items]) => ({
                    timestamp,
                    totalCost: items.reduce((sum, item) => sum + item.qty * item.price, 0),
                }));
                setOrderHistories(histories);
                setError('');
            })
            .catch((err) => {
                setError(err?.error || 'ERROR');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleOrderClick = (timestamp) => {
        if (expandedTimestamp === timestamp) {
            setExpandedTimestamp(null);
            setSelectedOrder(null);
            return;
        }

        setExpandedTimestamp(timestamp);
        setLoading(true);

        fetchOrderHistory(timestamp)
            .then((data) => {
                setSelectedOrder(data);
                setError('');
            })
            .catch((err) => {
                setError(err?.error || 'ERROR');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const renderOrderHistories = () => {
        if (loading) {
            return <p>Loading...</p>;
        }
        if (error) {
            return <p className="error">{error}</p>;
        }
        if (orderHistories.length === 0) {
            return <p>No order histories found.</p>;
        }

        return (
            <ul className="order-history-list">
                {orderHistories.map(({ timestamp, totalCost }) => (
                    <li key={timestamp} className="order-history-item">
                        <div
                            className="order-summary"
                            onClick={() => handleOrderClick(timestamp)}
                        >
                            <span>
                                Order Time: {new Date(timestamp).toLocaleString()}, 
                                {' '}
                                Total Cost: {totalCost.toFixed(2)}
                            </span>
                        </div>
                        {expandedTimestamp === timestamp && selectedOrder && (
                            <div className="selected-order">
                                <ul>
                                    {selectedOrder.map((item, index) => (
                                        <li key={index}>
                                            <span>{item.cat}</span> - <span>Quantity: {item.qty}</span> - <span>Price: ${item.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="order-history">
            <h3>Order History</h3>
            {renderOrderHistories()}
        </div>
    );
}

export default OrderHistory;