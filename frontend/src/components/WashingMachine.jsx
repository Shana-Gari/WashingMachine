import React from 'react';

const WashingMachine = ({ state = 'idle', speed = 'medium' }) => {
    // state: 'idle', 'filling', 'washing', 'spinning', 'draining', 'complete'

    const getSpinClass = () => {
        if (state === 'spinning') return 'animate-spin-fast';
        if (state === 'washing') return 'animate-spin-slow';
        return '';
    };

    const statusColor = {
        idle: '#64748b',
        filling: '#3b82f6',
        washing: '#6366f1',
        spinning: '#ec4899',
        draining: '#ef4444',
        complete: '#22c55e'
    }[state];

    return (
        <div className="glass-panel" style={{
            width: '300px', height: '400px', margin: '0 auto',
            position: 'relative', display: 'flex', flexDirection: 'column',
            alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.05)'
        }}>
            {/* Top Panel */}
            <div style={{ width: '100%', height: '50px', background: 'rgba(0,0,0,0.3)', marginBottom: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: statusColor, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
                    {state === 'idle' ? 'Ready' : state}
                </div>
            </div>

            {/* Drum Container */}
            <div style={{
                width: '220px', height: '220px', borderRadius: '50%',
                border: `8px solid ${state === 'idle' ? '#334155' : 'white'}`,
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
                position: 'relative', overflow: 'hidden', background: '#1e293b'
            }}>
                {/* Water Level Overlay */}
                {(state === 'filling' || state === 'washing' || state === 'spinning') && (
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: '70%', background: 'rgba(59, 130, 246, 0.3)',
                        transition: 'height 2s'
                    }} />
                )}

                {/* Inner Drum */}
                <div className={getSpinClass()} style={{
                    width: '100%', height: '100%',
                    backgroundImage: 'radial-gradient(circle, transparent 20%, rgba(255,255,255,0.1) 21%, transparent 22%)',
                    backgroundSize: '20px 20px'
                }}>
                    {/* Clothes inside (abstract representation) */}
                    {(state !== 'idle' && state !== 'complete') && (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '50%', height: '50%', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', filter: 'blur(10px)' }}></div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default WashingMachine;
