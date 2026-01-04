import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, RotateCcw } from 'lucide-react';
import ClothCard from '../components/ClothCard';
import WashingMachine from '../components/WashingMachine';

const API_URL = 'http://127.0.0.1:8000';

const UserPage = () => {
    const [clothes, setClothes] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [machineState, setMachineState] = useState('idle'); // idle, processing, washing, complete
    const [simulationResult, setSimulationResult] = useState(null);

    useEffect(() => {
        const fetchClothes = async () => {
            try {
                const res = await axios.get(`${API_URL}/admin/clothes/`);
                setClothes(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchClothes();
    }, []);

    const toggleSelection = (id) => {
        if (machineState !== 'idle' && machineState !== 'complete') return;
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
        if (machineState === 'complete') {
            setMachineState('idle');
            setSimulationResult(null);
        }
    };

    const selectedClothes = clothes.filter(c => selectedIds.includes(c.id));

    // Aggregation Logic (Client side for preview, verification via backend)
    const totalLoad = selectedClothes.reduce((sum, c) => sum + c.weight, 0);
    const avgDirt = selectedClothes.length ? selectedClothes.reduce((sum, c) => sum + c.dirt_level, 0) / selectedClothes.length : 0;
    const maxDelicate = selectedClothes.length ? Math.max(...selectedClothes.map(c => c.delicateness)) : 0;

    const handleStart = async () => {
        if (selectedClothes.length === 0) return;
        setMachineState('processing');

        try {
            const payload = {
                total_load: totalLoad,
                avg_dirt_level: parseFloat(avgDirt.toFixed(2)),
                max_delicateness: maxDelicate
            };

            const res = await axios.post(`${API_URL}/simulation/`, payload);
            setSimulationResult(res.data);

            // Start Visual Cycle
            runVisualCycle(res.data.wash_time);
        } catch (err) {
            console.error(err);
            setMachineState('idle');
        }
    };

    const runVisualCycle = (washTime) => {
        // Condensed animation cycle
        setMachineState('filling');
        setTimeout(() => {
            setMachineState('washing');
            setTimeout(() => {
                setMachineState('spinning');
                setTimeout(() => {
                    setMachineState('draining');
                    setTimeout(() => {
                        setMachineState('complete');
                    }, 2000);
                }, 3000);
            }, 3000); // Washing duration
        }, 2000);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
            <div className="fade-in">
                <h1 className="page-title" style={{ textAlign: 'left' }}>Select Clothes</h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                    {clothes.map(cloth => (
                        <ClothCard
                            key={cloth.id}
                            cloth={cloth}
                            selected={selectedIds.includes(cloth.id)}
                            onClick={() => toggleSelection(cloth.id)}
                        />
                    ))}
                </div>
            </div>

            <div className="fade-in">
                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', sticky: 'top', top: '20px' }}>
                    <h2 style={{ marginTop: 0 }}>Machine Control</h2>

                    <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Total Load:</span>
                            <span style={{ fontWeight: 'bold', color: totalLoad > 10 ? '#ef4444' : 'white' }}>{totalLoad.toFixed(1)} kg</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>Avg Dirt:</span>
                            <span style={{ fontWeight: 'bold' }}>{avgDirt.toFixed(1)}/10</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Fabric Type:</span>
                            <span style={{ fontWeight: 'bold' }}>
                                {maxDelicate <= 4 ? 'Robust' : maxDelicate <= 7 ? 'Normal' : 'Delicate'}
                            </span>
                        </div>
                    </div>

                    <WashingMachine state={machineState} />

                    {machineState === 'idle' || machineState === 'complete' ? (
                        <button
                            className="glass-button"
                            style={{ width: '100%', marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                            onClick={handleStart}
                            disabled={selectedClothes.length === 0}
                        >
                            {machineState === 'complete' ? <><RotateCcw /> Reset</> : <><Play /> Start Wash</>}
                        </button>
                    ) : (
                        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--accent)' }}>
                            Cycle in progress...
                        </div>
                    )}
                </div>

                {simulationResult && (
                    <div className="glass-panel fade-in" style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)' }}>
                        <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>Fuzzy Logic Result</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                            <div>
                                <div style={{ color: '#94a3b8' }}>Time</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{Math.round(simulationResult.wash_time)} min</div>
                            </div>
                            <div>
                                <div style={{ color: '#94a3b8' }}>Water</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{Math.round(simulationResult.water_level)}%</div>
                            </div>
                            <div>
                                <div style={{ color: '#94a3b8' }}>Spin</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{Math.round(simulationResult.spin_speed)} RPM</div>
                            </div>
                            <div>
                                <div style={{ color: '#94a3b8' }}>Detergent</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{Math.round(simulationResult.detergent_amount)} ml</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.8rem', fontStyle: 'italic' }}>
                            "{simulationResult.explanation}"
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserPage;
