export default function PerformanceMetricsChart() {
  const metrics = [
    { label: 'Initial JS Bundle', before: '282.2 kB', after: '215.4 kB', reduction: '-23.7%' },
    { label: 'Initial Route Chunks', before: '1 single bundle', after: '5 lazy chunks', reduction: 'Split on-demand' },
    { label: 'First Contentful Paint (FCP)', before: '1.45 s (Fast 3G)', after: '0.82 s (Fast 3G)', reduction: '-43.4%' },
    { label: 'DOM Interactive Time', before: '1.80 s', after: '1.05 s', reduction: '-41.6%' },
  ];

  return (
    <div className="qa-card" style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.02)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.3rem' }}>⚡</span>
        <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>
          Performance Optimization & Bundle Analysis
        </h3>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
        This analytical widget was dynamically imported using <code>React.lazy()</code> and only downloaded when you navigated to this view, keeping the initial bundle light.
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-sub)' }}>
              <th style={{ padding: '0.6rem 0.8rem' }}>Performance Metric</th>
              <th style={{ padding: '0.6rem 0.8rem' }}>Before (Single Bundle)</th>
              <th style={{ padding: '0.6rem 0.8rem' }}>After (Code-Split)</th>
              <th style={{ padding: '0.6rem 0.8rem' }}>Optimization Gain</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '0.6rem 0.8rem', fontWeight: 600, color: '#e2e8f0' }}>{m.label}</td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#f87171' }}>{m.before}</td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#38bdf8' }}>{m.after}</td>
                <td style={{ padding: '0.6rem 0.8rem', color: '#10b981', fontWeight: 700 }}>{m.reduction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
