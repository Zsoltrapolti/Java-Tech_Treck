import { useEffect, useState } from 'react';
import { fetchUnassignedClients, fetchMyClients, claimClient } from '../../api/backend';
import { showSuccess, showError } from '../../utils/toast';

interface UserAccountClient {
    id: number;
    username: string;
    role?: string;
}

export function AssignClientsPage() {
    const [unassigned, setUnassigned] = useState<UserAccountClient[]>([]);
    const [myClients, setMyClients] = useState<UserAccountClient[]>([]);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                const freeClients = await fetchUnassignedClients();
                const mine = await fetchMyClients();

                if (isMounted) {
                    setUnassigned(freeClients);
                    setMyClients(mine);
                }
            } catch (error) {
                if (isMounted) {
                    showError(error instanceof Error ? error.message : "Could not load clients");
                }
            }
        };

        void loadData();

        return () => {
            isMounted = false;
        };
    }, [refreshTrigger]);

    const handleClaim = async (clientId: number) => {
        try {
            await claimClient(clientId);
            showSuccess("Client claimed successfully!");

            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            showError(error instanceof Error ? error.message : "Error claiming client");
        }
    };

    const styles = {
        container: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            padding: '40px',
            maxWidth: '1300px',
            margin: '0 auto',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
        },
        column: {
            backgroundColor: '#ffffff',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
            border: '1px solid #eaeaea'
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: '600',
            marginBottom: '25px',
            color: '#1e5b32',
            borderBottom: '3px solid #1e5b32',
            paddingBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        clientCard: {
            backgroundColor: '#fcfcfc',
            padding: '20px',
            marginBottom: '15px',
            borderRadius: '10px',
            border: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default'
        },
        clientInfo: {
            display: 'flex',
            flexDirection: 'column' as const,
            gap: '4px'
        },
        username: {
            fontSize: '1.1rem',
            color: '#333',
            fontWeight: '600'
        },
        idBadge: {
            fontSize: '0.8rem',
            color: '#666',
            backgroundColor: '#eee',
            padding: '2px 8px',
            borderRadius: '4px',
            width: 'fit-content'
        },
        btnClaim: {
            backgroundColor: '#1e5b32',
            color: '#fff',
            border: 'none',
            padding: '10px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'background-color 0.2s'
        },
        statusBadge: {
            color: '#1e5b32',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: '#e8f5e9',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.9rem'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.column}>
                <h2 style={styles.title}>
                    Available Clients
                </h2>
                {unassigned.length === 0 ? (
                    <p style={{color: '#999', textAlign: 'center'}}>No unassigned clients found.</p>
                ) : (
                    unassigned.map(c => (
                        <div key={c.id} style={styles.clientCard} className="card-hover">
                            <div style={styles.clientInfo}>
                                <span style={styles.username}>{c.username}</span>
                            </div>
                            <button
                                style={styles.btnClaim}
                                onClick={() => handleClaim(c.id)}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#144123'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e5b32'}
                            >
                                Claim
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div style={styles.column}>
                <h2 style={styles.title}>
                    My Managed Clients
                </h2>
                {myClients.length === 0 ? (
                    <p style={{color: '#999', textAlign: 'center'}}>You have no managed clients yet.</p>
                ) : (
                    myClients.map(c => (
                        <div key={c.id} style={styles.clientCard}>
                            <div style={styles.clientInfo}>
                                <span style={styles.username}>{c.username}</span>
                            </div>
                            <div style={styles.statusBadge}>
                                Assigned
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}