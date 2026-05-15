import React from 'react';

export function Input({ label, error, className = '', ...props }) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
    width: '100%'
  };

  const labelStyle = {
    marginBottom: '6px',
    fontSize: '14px',
    color: 'var(--text-muted)',
    fontWeight: '500'
  };

  const inputStyle = {
    padding: '14px',
    borderRadius: '8px',
    border: `1px solid ${error ? 'var(--error)' : 'var(--border-color)'}`,
    backgroundColor: 'var(--bg-card)',
    color: 'var(--text-main)',
    fontSize: '16px',
    outline: 'none',
  };

  const errorStyle = {
    color: 'var(--error)',
    fontSize: '12px',
    marginTop: '4px'
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <label style={labelStyle}>{label}</label>}
      <input 
        style={inputStyle} 
        {...props} 
      />
      {error && <span style={errorStyle}>{error}</span>}
    </div>
  );
}
