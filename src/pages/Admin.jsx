import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DEMO, FEATURES } from '../config';
import { addCar, addSold, deleteCar, deleteSold, getSession, listCars, listSold, login, logout, DEMO_PASSWORD } from '../lib/api';
import { inr } from '../lib/format';

const EMPTY = { title: '', brand: '', year: '', price: '', km: '', fuel: 'Petrol', transmission: 'Manual', owner_count: '1st Owner', location: 'Coimbatore', description: '' };
const EMPTY_D = { variant: '', color: '', registration: '', seats: '5', insurance: 'Comprehensive insurance', service: 'Available', features: [] };

function Login({ onDone }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await login(email, pw);
      onDone();
    } catch (x) {
      setErr(x.message);
    }
    setBusy(false);
  };
  return (
    <div className="login">
      <form onSubmit={submit} className="box">
        <h2>Joel Cars Admin</h2>
        {DEMO ? <p className="muted small">Demo mode – password: <b>{DEMO_PASSWORD}</b></p> : <input type="email" required placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} />}
        <input type="password" required placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} />
        {err && <p className="error">{err}</p>}
        <button className="btn btn-red full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <Link to="/" className="muted small">← Back to website</Link>
      </form>
    </div>
  );
}

function Previews({ files }) {
  const [urls, setUrls] = useState([]);
  useEffect(() => {
    const u = files.map((f) => URL.createObjectURL(f));
    setUrls(u);
    return () => u.forEach(URL.revokeObjectURL);
  }, [files]);
  return <div className="previews">{urls.map((u) => <img key={u} src={u} alt="" />)}</div>;
}

export default function Admin() {
  const [authed, setAuthed] = useState(null);
  const [tab, setTab] = useState('cars');
  const [cars, setCars] = useState([]);
  const [sold, setSold] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [d, setD] = useState(EMPTY_D);
  const [files, setFiles] = useState([]);
  const [soldFiles, setSoldFiles] = useState([]);
  const [caption, setCaption] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const refresh = async () => {
    setCars(await listCars());
    setSold(await listSold());
  };
  useEffect(() => {
    getSession().then((s) => setAuthed(!!s));
  }, []);
  useEffect(() => {
    if (authed) refresh().catch((e) => setMsg(e.message));
  }, [authed]);

  const run = async (fn, ok) => {
    setBusy(true);
    setMsg('');
    try {
      await fn();
      await refresh();
      setMsg('✅ ' + ok);
    } catch (e) {
      setMsg('❌ ' + (e.message || 'Something went wrong'));
    }
    setBusy(false);
  };

  if (authed === null) return null;
  if (!authed) return <Login onDone={() => setAuthed(true)} />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setDet = (k) => (e) => setD({ ...d, [k]: e.target.value });
  const toggleFeat = (f) => setD({ ...d, features: d.features.includes(f) ? d.features.filter((x) => x !== f) : [...d.features, f] });

  const submitCar = (e) => {
    e.preventDefault();
    if (!files.length) return setMsg('❌ Please choose at least one photo.');
    run(async () => {
      const res = await addCar(
        { ...form, year: +form.year || null, price: +form.price, km: +form.km || null },
        d,
        files
      );
      if (res?.warning) alert(res.warning);
      setForm(EMPTY);
      setD(EMPTY_D);
      setFiles([]);
      e.target.reset();
      setTab('cars');
    }, 'Car published – it is now live on the website.');
  };

  return (
    <div className="admin">
      <div className="admin-bar">
        <b>Joel Cars – Admin</b>
        <span>
          <Link to="/" className="btn btn-ghost sm">View website</Link>{' '}
          <button className="btn btn-ghost sm" onClick={async () => { await logout(); setAuthed(false); }}>Log out</button>
        </span>
      </div>
      <div className="wrap admin-body">
        <div className="tabs">
          {[['cars', `Available cars (${cars.length})`], ['add', '+ Add a car'], ['sold', `Sold-car photos (${sold.length})`]].map(([k, l]) => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => { setTab(k); setMsg(''); }}>{l}</button>
          ))}
        </div>
        {msg && <p className={msg.startsWith('✅') ? 'ok' : 'error'}>{msg}</p>}

        {tab === 'cars' && (
          <div className="box table-wrap">
            <table>
              <thead><tr><th>Photo</th><th>Car</th><th>Price</th><th>Photos</th><th></th></tr></thead>
              <tbody>
                {cars.map((c) => (
                  <tr key={c.id}>
                    <td><img src={c.images?.[0]} alt="" className="t-img" /></td>
                    <td><b>{c.title}</b><br /><small className="muted">{[c.year, c.fuel, c.transmission].filter(Boolean).join(' • ')}</small></td>
                    <td>{inr(c.price)}</td>
                    <td>{c.images?.length || 0}</td>
                    <td>
                      <button
                        className="btn btn-del sm"
                        disabled={busy}
                        onClick={() => confirm(`Delete "${c.title}" and all its photos? This cannot be undone.`) && run(() => deleteCar(c), 'Car and its photos deleted.')}
                      >
                        Sold – Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!cars.length && <tr><td colSpan="5" className="muted">No cars yet. Click “Add a car”.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'add' && (
          <form className="box form" onSubmit={submitCar}>
            <h3>Add a new car</h3>
            <div className="fgrid">
              <label>Car name *<input required value={form.title} onChange={set('title')} placeholder="Maruti Suzuki Swift VXi" /></label>
              <label>Brand *<input required value={form.brand} onChange={set('brand')} placeholder="Maruti Suzuki" /></label>
              <label>Price (₹) *<input required type="number" min="0" value={form.price} onChange={set('price')} placeholder="485000" /></label>
              <label>Year<input type="number" value={form.year} onChange={set('year')} placeholder="2019" /></label>
              <label>Kilometres driven<input type="number" value={form.km} onChange={set('km')} placeholder="42000" /></label>
              <label>Fuel<select value={form.fuel} onChange={set('fuel')}>{['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'].map((x) => <option key={x}>{x}</option>)}</select></label>
              <label>Transmission<select value={form.transmission} onChange={set('transmission')}>{['Manual', 'Automatic'].map((x) => <option key={x}>{x}</option>)}</select></label>
              <label>Ownership<select value={form.owner_count} onChange={set('owner_count')}>{['1st Owner', '2nd Owner', '3rd Owner', '4th+ Owner'].map((x) => <option key={x}>{x}</option>)}</select></label>
              <label>Location<input value={form.location} onChange={set('location')} /></label>
            </div>
            <h3 className="sub">More details (shown on the car page)</h3>
            <div className="fgrid">
              <label>Variant<input value={d.variant} onChange={setDet('variant')} placeholder="VXi, ZX, SX (O)…" /></label>
              <label>Colour<input value={d.color} onChange={setDet('color')} placeholder="Pearl White" /></label>
              <label>Registration (RTO)<input value={d.registration} onChange={setDet('registration')} placeholder="TN 66" /></label>
              <label>Seats<select value={d.seats} onChange={setDet('seats')}>{['2', '4', '5', '6', '7', '8'].map((x) => <option key={x}>{x}</option>)}</select></label>
              <label>Insurance<select value={d.insurance} onChange={setDet('insurance')}>{['Comprehensive insurance', 'Third-party insurance', 'Expired – to be renewed'].map((x) => <option key={x}>{x}</option>)}</select></label>
              <label>Service history<select value={d.service} onChange={setDet('service')}>{['Available', 'Not available'].map((x) => <option key={x}>{x}</option>)}</select></label>
            </div>
            <fieldset className="feat-pick">
              <legend>Features (tick all that apply)</legend>
              {FEATURES.map((f) => (
                <label key={f} className={d.features.includes(f) ? 'on' : ''}>
                  <input type="checkbox" checked={d.features.includes(f)} onChange={() => toggleFeat(f)} /> {f}
                </label>
              ))}
            </fieldset>
            <label>Description<textarea rows="4" value={form.description} onChange={set('description')} placeholder="Condition, service history, insurance, etc." /></label>
            <label>Photos * (select 6–7 at once; the first is the cover)
              <input type="file" accept="image/*" multiple onChange={(e) => setFiles([...e.target.files])} />
            </label>
            <Previews files={files} />
            <button className="btn btn-red" disabled={busy}>{busy ? 'Uploading… please wait' : 'Publish car'}</button>
          </form>
        )}

        {tab === 'sold' && (
          <>
            <form
              className="box form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!soldFiles.length) return setMsg('❌ Choose at least one photo.');
                run(async () => { await addSold(soldFiles, caption); setSoldFiles([]); setCaption(''); e.target.reset(); }, 'Added to the scrolling “Recently Sold” strip.');
              }}
            >
              <h3>Add sold-car / happy-customer photos</h3>
              <label>Caption (optional)<input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Hyundai i20 – delivered to Mr. Kumar" /></label>
              <label>Photos<input type="file" accept="image/*" multiple onChange={(e) => setSoldFiles([...e.target.files])} /></label>
              <Previews files={soldFiles} />
              <button className="btn btn-red" disabled={busy}>{busy ? 'Uploading…' : 'Upload'}</button>
            </form>
            <div className="sold-admin">
              {sold.map((s) => (
                <div key={s.id} className="box">
                  <img src={s.image_url} alt="" />
                  <small>{s.caption}</small>
                  <button className="btn btn-del sm" disabled={busy} onClick={() => confirm('Remove this photo?') && run(() => deleteSold(s), 'Photo removed.')}>Delete</button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
