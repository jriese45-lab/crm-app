import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { FileText, ReceiptText, FolderClock, Plus, Download, WandSparkles } from 'lucide-react';

type DocTab = 'invoice' | 'proposal' | 'recent';

interface LineItem {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
}

const RECENT_DOCS = [
  { id: 'DOC-1022', type: 'Invoice', client: 'Beacon Dental', total: 2480, status: 'Sent' },
  { id: 'DOC-1021', type: 'Proposal', client: 'Northwind HVAC', total: 6995, status: 'Viewed' },
  { id: 'DOC-1019', type: 'Invoice', client: 'Apex Plumbing', total: 3590, status: 'Paid' },
];

export function DocumentsPage() {
  const [tab, setTab] = useState<DocTab>('invoice');
  const [client, setClient] = useState('Acme Corporation');
  const [email, setEmail] = useState('client@example.com');
  const [invoiceNo, setInvoiceNo] = useState('INV-952181');
  const [dueDate, setDueDate] = useState('2026-05-15');
  const [notes, setNotes] = useState('Payment due within 30 days of invoice date.');
  const [items, setItems] = useState<LineItem[]>([
    { id: 'line-1', description: 'Installation labor', qty: 8, unitPrice: 125 },
    { id: 'line-2', description: 'Equipment package', qty: 1, unitPrice: 1490 },
  ]);

  const total = useMemo(() => items.reduce((sum, line) => sum + (line.qty * line.unitPrice), 0), [items]);

  const updateItem = (id: string, key: keyof LineItem, value: string | number) => {
    setItems((curr) => curr.map((line) => line.id === id ? { ...line, [key]: value } : line));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <h2 style={{ fontSize: 32, fontFamily: 'var(--font-display)', marginBottom: 6 }}>Documents</h2>
        <p style={{ color: 'var(--text-2)' }}>Generate polished proposals and invoices with your branding.</p>
      </div>

      <div style={{ display: 'inline-flex', gap: 4, border: '1px solid var(--border-1)', borderRadius: 10, padding: 4, width: 'fit-content', background: 'var(--surface-1)' }}>
        <TabButton active={tab === 'invoice'} onClick={() => setTab('invoice')} icon={<ReceiptText size={14} />} label="Invoice" />
        <TabButton active={tab === 'proposal'} onClick={() => setTab('proposal')} icon={<FileText size={14} />} label="Proposal" />
        <TabButton active={tab === 'recent'} onClick={() => setTab('recent')} icon={<FolderClock size={14} />} label="Recent" />
      </div>

      {tab !== 'recent' ? (
        <section style={{ ...card, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 16, borderBottom: '1px solid var(--border-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 24, fontFamily: 'var(--font-display)' }}>Generate {tab === 'invoice' ? 'Invoice' : 'Proposal'}</h3>
              <p style={{ color: 'var(--text-2)' }}>Build a professional PDF your team can send immediately.</p>
            </div>
            <button style={ghostBtn}><WandSparkles size={14} /> AI Draft</button>
          </div>

          <div style={{ padding: 16, display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <Field label={`${tab === 'invoice' ? 'Invoice' : 'Proposal'} Number`} value={invoiceNo} onChange={setInvoiceNo} />
              <Field label="Client Name" value={client} onChange={setClient} />
              <Field label="Client Email" value={email} onChange={setEmail} />
            </div>

            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: 18, fontFamily: 'var(--font-display)' }}>{tab === 'invoice' ? 'Invoice' : 'Proposal'} Items</h4>
                <button onClick={() => setItems((list) => [...list, { id: crypto.randomUUID(), description: '', qty: 1, unitPrice: 0 }])} style={ghostBtn}><Plus size={14} /> Add Item</button>
              </div>
              {items.map((line) => (
                <div key={line.id} style={{ display: 'grid', gridTemplateColumns: '2.4fr 0.6fr 0.8fr 0.8fr', gap: 8 }}>
                  <input value={line.description} onChange={(e) => updateItem(line.id, 'description', e.target.value)} placeholder="Line item description" />
                  <input type="number" value={line.qty} onChange={(e) => updateItem(line.id, 'qty', Number(e.target.value))} min={1} />
                  <input type="number" value={line.unitPrice} onChange={(e) => updateItem(line.id, 'unitPrice', Number(e.target.value))} min={0} />
                  <div style={{ border: '1px solid var(--border-2)', borderRadius: 9, padding: '8px 10px', background: 'var(--surface-2)' }}>
                    ${(line.qty * line.unitPrice).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <Field label={tab === 'invoice' ? 'Due Date' : 'Valid Until'} value={dueDate} onChange={setDueDate} type="date" />
              <Field label="Amount Paid" value="0" onChange={() => undefined} type="number" />
              <div>
                <label style={label}>Total Amount</label>
                <div style={{ ...inputStatic, fontWeight: 700 }}>${total.toLocaleString()}</div>
              </div>
            </div>

            <div>
              <label style={label}>Terms & Notes</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ width: '100%' }} />
            </div>

            <button style={primaryBtn}><Download size={16} /> Generate {tab === 'invoice' ? 'Invoice' : 'Proposal'} PDF</button>
          </div>
        </section>
      ) : (
        <section style={{ ...card, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 14, borderBottom: '1px solid var(--border-1)' }}>
            <h3 style={{ fontSize: 22, fontFamily: 'var(--font-display)' }}>Recent Documents</h3>
          </div>
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ background: 'var(--surface-2)' }}>
                {['ID', 'Type', 'Client', 'Amount', 'Status'].map((h) => <th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {RECENT_DOCS.map((doc) => (
                <tr key={doc.id}>
                  <td style={td}>{doc.id}</td>
                  <td style={td}>{doc.type}</td>
                  <td style={td}>{doc.client}</td>
                  <td style={td}>${doc.total.toLocaleString()}</td>
                  <td style={td}>{doc.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
  return (
    <button onClick={onClick} style={{
      border: 'none',
      borderRadius: 8,
      padding: '7px 12px',
      background: active ? 'var(--accent)' : 'transparent',
      color: active ? '#000' : 'var(--text-2)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontWeight: 600,
      cursor: 'pointer',
    }}>
      {icon} {label}
    </button>
  );
}

function Field({ label: title, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <div>
      <label style={label}>{title}</label>
      <input value={value} type={type} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

const card: CSSProperties = {
  background: 'var(--surface-1)',
  border: '1px solid var(--border-1)',
  borderRadius: 14,
  padding: 14,
};

const label: CSSProperties = {
  display: 'block',
  marginBottom: 5,
  color: 'var(--text-2)',
  fontSize: 12,
};

const inputStatic: CSSProperties = {
  border: '1px solid var(--border-2)',
  borderRadius: 9,
  padding: '8px 10px',
  background: 'var(--surface-2)',
};

const primaryBtn: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  border: 'none', borderRadius: 10, padding: '10px 14px',
  background: 'linear-gradient(90deg, var(--red), #f97316)', color: '#fff', fontWeight: 700, cursor: 'pointer',
};

const ghostBtn: CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  border: '1px solid var(--border-2)', borderRadius: 9, padding: '7px 10px',
  background: 'var(--surface-2)', color: 'var(--text-1)', cursor: 'pointer',
};

const th: CSSProperties = {
  textAlign: 'left',
  fontSize: 11,
  color: 'var(--text-2)',
  fontFamily: 'var(--font-mono)',
  padding: '10px 12px',
};

const td: CSSProperties = {
  padding: '10px 12px',
  borderTop: '1px solid var(--border-1)',
};
