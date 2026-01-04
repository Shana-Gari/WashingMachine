import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, Plus, Save } from 'lucide-react';
import ClothCard from '../components/ClothCard';

import config from '../config';

const API_URL = config.API_URL;

const AdminPage = () => {
    const [clothes, setClothes] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        image_url: '',
        weight: 0.5,
        dirt_level: 5,
        delicateness: 5
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchClothes();
    }, []);

    const fetchClothes = async () => {
        try {
            const res = await axios.get(`${API_URL}/admin/clothes/`);
            setClothes(res.data);
        } catch (err) {
            console.error("Failed to fetch clothes", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'name' || name === 'image_url' ? value : parseFloat(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/admin/clothes/`, formData);
            setFormData({ name: '', image_url: '', weight: 0.5, dirt_level: 5, delicateness: 5 });
            fetchClothes();
            alert('Cloth added successfully!');
        } catch (err) {
            console.error("Error adding cloth", err);
            alert('Failed to add cloth');
        } finally {
            setLoading(false);
        }
    };

    // Simple preset images helper
    const setPresetImage = (url) => {
        setFormData(prev => ({ ...prev, image_url: url }));
    };

    return (
        <div>
            <h1 className="page-title">Admin Configuration</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                {/* Form Section */}
                <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
                    <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginTop: 0 }}>
                        Add New Cloth
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Cloth Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="glass-input"
                                placeholder="e.g. Blue Jeans"
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Image URL</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    className="glass-input"
                                    placeholder="https://..."
                                />
                            </div>
                            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                {['https://cdn-icons-png.flaticon.com/512/3345/3345397.png', 'https://cdn-icons-png.flaticon.com/512/2806/2806051.png', 'https://cdn-icons-png.flaticon.com/512/8815/8815194.png'].map(url => (
                                    <img
                                        key={url} src={url} alt="preset"
                                        style={{ width: '30px', height: '30px', cursor: 'pointer', border: formData.image_url === url ? '2px solid var(--primary)' : '1px solid transparent', borderRadius: '4px' }}
                                        onClick={() => setPresetImage(url)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Weight (kg)</span>
                                <span>{formData.weight}</span>
                            </label>
                            <input
                                type="range" name="weight" min="0.1" max="5" step="0.1"
                                value={formData.weight} onChange={handleChange}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Dirt Level (1-10)</span>
                                <span>{formData.dirt_level}</span>
                            </label>
                            <input
                                type="range" name="dirt_level" min="1" max="10" step="1"
                                value={formData.dirt_level} onChange={handleChange}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Delicateness (1-10)</span>
                                <span>{formData.delicateness}</span>
                            </label>
                            <input
                                type="range" name="delicateness" min="1" max="10" step="1"
                                value={formData.delicateness} onChange={handleChange}
                                style={{ width: '100%' }}
                            />
                            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                                1=Robust (Jeans), 10=Very Delicate (Silk)
                            </div>
                        </div>

                        <button type="submit" className="glass-button" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {loading ? 'Saving...' : <><Save size={18} /> Save Cloth</>}
                        </button>
                    </form>
                </div>

                {/* List Section */}
                <div>
                    <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>Library</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {clothes.map(cloth => (
                            <ClothCard key={cloth.id} cloth={cloth} />
                        ))}
                        {clothes.length === 0 && (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#64748b', border: '2px dashed var(--glass-border)', borderRadius: '16px' }}>
                                No clothes configured yet. Add some!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
