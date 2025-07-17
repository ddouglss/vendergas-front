import React from 'react';
import './CardMetric.css';

export default function CardMetric({ title, value }) {
    return (
        <div className="card-metric">
            <h3>{title}</h3>
            <p>{value}</p>
        </div>
    );
}
