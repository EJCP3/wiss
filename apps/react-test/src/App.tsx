import { Toaster, useToastHistory } from '@ejcp/wiss/react';
import { toast } from '@ejcp/wiss';
import { initToaster } from '@ejcp/wiss/vanilla';

function App() {
  const history = useToastHistory();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      fontFamily: 'system-ui, sans-serif',
      background: '#0a0a0a',
      color: '#fff',
    }}>
      <Toaster position="top-center" theme="dark" maxToasts={3} />

      <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>🧪 wiss Phase 3 Test</h1>
      <p style={{ opacity: 0.6 }}>Verifica que las nuevas funciones de Temas, Fuentes y HTML funcionan.</p>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px' }}>
        <button
          onClick={() => {
            initToaster({ format: 'classic', fontFamily: 'system-ui, sans-serif' });
            toast.success('¡Todo salió bien!');
          }}
          style={btnStyle('#22c55e')}
        >
          ✅ Classic Success
        </button>




        <button
          onClick={() => {
            initToaster({ format: 'classic', fontFamily: 'system-ui, sans-serif' });
            toast.success('<b>¡Éxito!</b>', { 
              description: 'Este texto tiene <i>formato HTML</i> gracias a <u>DOMParser</u>.',
              richText: true
            });
          }}
          style={btnStyle('#ec4899')}
        >
          ✨ Rich Text HTML
        </button>

        <button
          onClick={() => {
            initToaster({ format: 'classic', fontFamily: 'system-ui, sans-serif' });
            toast.error('<i>Intento XSS</i>', { 
              description: '<a href="javascript:alert(1)">Link malicioso</a> (el link debe ser sanitizado)',
              richText: true
            });
          }}
          style={btnStyle('#ef4444')}
        >
          🛡️ Sanitizer Check
        </button>

        <button
          onClick={() => {
            initToaster({ format: 'classic', fontFamily: 'system-ui, sans-serif' });
            const pastDate = new Date();
            pastDate.setMinutes(pastDate.getMinutes() - 15);
            toast.warning('Servidor caído', { 
              description: 'Este error ocurrió hace 15 minutos en el backend.',
              createdAt: pastDate
            });
          }}
          style={btnStyle('#f59e0b', '#000')}
        >
          ⏳ Past Date (15 min ago)
        </button>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#18181b', borderRadius: '12px', width: '100%', maxWidth: '800px', textAlign: 'left' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📜 Historial de Notificaciones ({history.length})</span>
          <button onClick={() => toast.clearHistory()} style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', background: '#ef4444', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Borrar Historial</button>
        </h2>
        {history.length === 0 ? (
          <p style={{ opacity: 0.5 }}>No hay notificaciones en el historial. Cierra una notificación para que aparezca aquí.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {history.map(t => (
              <li key={t.id} style={{ background: '#27272a', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <strong style={{ color: t.type === 'error' ? '#fca5a5' : t.type === 'success' ? '#86efac' : t.type === 'warning' ? '#fde047' : '#93c5fd' }}>
                    {t.type.toUpperCase()}
                  </strong>
                  <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                    {new Date(t.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                <div>{String(t.message)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function btnStyle(bg: string, color = '#fff', border = 'none'): React.CSSProperties {
  return {
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border,
    background: bg,
    color,
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  };
}

export default App;
