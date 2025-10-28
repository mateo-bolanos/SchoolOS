import React from 'react';

const getStatusTone = (value, threshold) => {
  if (value >= threshold) {
    return 'status-positive';
  }
  if (value >= threshold * 0.5) {
    return 'status-warning';
  }
  return 'status-critical';
};

const toneToColor = {
  'status-positive': '#2e7d32',
  'status-warning': '#ed6c02',
  'status-critical': '#c62828',
};

const toneToLabel = {
  'status-positive': 'On track',
  'status-warning': 'Needs attention',
  'status-critical': 'Critical',
};

function DashboardStatus({ label, value, threshold = 75 }) {
  const tone = getStatusTone(value, threshold);
  const color = toneToColor[tone];
  const statusLabel = toneToLabel[tone];

  return (
    <section
      aria-labelledby={`${label}-status`}
      className="dashboard-status"
      role="group"
    >
      <h2 id={`${label}-status`} className="dashboard-status__label">
        {label}
      </h2>
      <p
        aria-live="polite"
        className="dashboard-status__value"
        role="status"
        style={{ color }}
      >
        {value}%
      </p>
      <p className="dashboard-status__summary">{statusLabel}</p>
    </section>
  );
}

export default DashboardStatus;
export { getStatusTone };
