import React from 'react';

const ClothCard = ({ cloth, selected, onClick, showActions = false }) => {
    return (
        <div
            className={`glass-panel ${selected ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-slate-900' : ''}`}
            style={{
                padding: '1rem',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden'
            }}
            onClick={onClick}
        >
            <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '1rem' }}>
                {cloth.image_url ? (
                    <img src={cloth.image_url} alt={cloth.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                ) : (
                    <div style={{ fontSize: '3rem' }}>👕</div>
                )}
            </div>

            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem' }}>{cloth.name}</h3>

            <div style={{ fontSize: '0.9rem', color: '#94a3b8', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>Weight: <span style={{ color: 'white' }}>{cloth.weight}kg</span></div>
                <div>Dirt: <span style={{ color: 'white' }}>{cloth.dirt_level}/10</span></div>
                <div style={{ gridColumn: 'span 2' }}>
                    Type: <span style={{ color: 'white' }}>
                        {cloth.delicateness <= 4 ? 'Robust' : cloth.delicateness <= 7 ? 'Normal' : 'Delicate'}
                        ({cloth.delicateness})
                    </span>
                </div>
            </div>

            {selected && (
                <div style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: 'var(--primary)', borderRadius: '50%', width: '24px', height: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    ✓
                </div>
            )}
        </div>
    );
};

export default ClothCard;
