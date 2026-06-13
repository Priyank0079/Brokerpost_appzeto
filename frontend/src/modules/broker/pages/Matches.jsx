import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Loader2, Target, Search, RefreshCw, ChevronDown, MessageCircle, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- Highlight Helpers ---
const hlLoc = (text, common) => {
  if (!text || !common?.length) return <span>{text || '—'}</span>;
  let parts = [text];
  
  const uniqueCommon = [...new Set(common)];
  uniqueCommon.forEach(w => {
    if (!w || w.length < 3) return;
    const re = new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return [part];
      const pieces = part.split(re);
      return pieces.map((piece, i) => 
        re.test(piece) ? <span key={i} className="bg-blue-100 text-blue-800 px-1 rounded-sm font-semibold">{piece}</span> : piece
      );
    });
  });
  return <span>{parts.map((p, i) => <React.Fragment key={i}>{p}</React.Fragment>)}</span>;
};

const hlProj = (text, common) => {
  if (!text) return <span>—</span>;
  if (!common || !common.length) return <span className="bg-green-100 text-green-800 px-1 rounded-sm font-semibold">{text}</span>;
  
  let parts = [text];
  const uniqueCommon = [...new Set(common)];
  uniqueCommon.forEach(w => {
    if (!w || w.length < 2) return;
    const re = new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    
    parts = parts.flatMap(part => {
      if (typeof part !== 'string') return [part];
      const pieces = part.split(re);
      return pieces.map((piece, i) => 
        re.test(piece) ? <span key={i} className="bg-green-100 text-green-800 px-1 rounded-sm font-semibold">{piece}</span> : piece
      );
    });
  });
  return <span>{parts.map((p, i) => <React.Fragment key={i}>{p}</React.Fragment>)}</span>;
};

const bColor = (id) => {
  const BCOLORS = ['#1e3a5f','#c8962a','#166534','#6d28d9','#b45309','#0f766e','#be123c','#1d4ed8'];
  return BCOLORS[(id||'').split('').reduce((s,c)=>s+c.charCodeAt(0),0)%BCOLORS.length];
};
const ini = (n) => (n||'?').split(' ').map(x=>x[0]).join('').substring(0,2).toUpperCase();

const PILL = {
  'Apartments':'bg-blue-100 text-blue-800','Low Rise Floors':'bg-purple-100 text-purple-800','Kothi/Villas':'bg-orange-100 text-orange-800',
  'Plots':'bg-green-100 text-green-800','Plot':'bg-green-100 text-green-800','Retail Shops/Showroom':'bg-orange-100 text-orange-800',
  'Shops/Showroom':'bg-orange-100 text-orange-800','Office':'bg-blue-100 text-blue-800','Warehouse':'bg-gray-100 text-gray-800',
  'Standalone Building':'bg-purple-100 text-purple-800'
};

const scClass = (s) => s >= 70 ? 'bg-green-100 text-green-800' : s >= 40 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800';
const scDot = (s) => s >= 70 ? 'bg-green-600' : s >= 40 ? 'bg-amber-600' : 'bg-blue-600';
const scBar = (s) => s >= 70 ? '#166534' : s >= 40 ? '#d97706' : '#1e40af';
const scLbl = (s) => s >= 70 ? 'Strong' : s >= 40 ? 'Good' : 'Possible';

const Matches = () => {
  const { user } = useAuth();
  const [matchGroups, setMatchGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [fType, setFType] = useState('');
  const [fCat, setFCat] = useState('');
  const [fScore, setFScore] = useState('0');
  const [searchInp, setSearchInp] = useState('');
  const [sortMode, setSortMode] = useState('score');

  // Accordion state
  const [openGroups, setOpenGroups] = useState(new Set([0])); // Open first by default

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await api.get('/postings/smart-matches');
      if (res.success) {
        setMatchGroups(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch matches', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const toggleGroup = (idx) => {
    const newSet = new Set(openGroups);
    if (newSet.has(idx)) newSet.delete(idx);
    else newSet.add(idx);
    setOpenGroups(newSet);
  };

  const filteredGroups = useMemo(() => {
    const minS = parseInt(fScore) || 0;
    const srch = searchInp.toLowerCase().trim();

    let groups = matchGroups.map(g => {
      if (fType === 'avail' && !g.isAvail) return null;
      if (fType === 'req' && g.isAvail) return null;
      if (fCat && g.myL.vertical !== fCat.toUpperCase()) return null;
      
      const ms = g.matches.filter(m => {
        if (m.score < minS) return false;
        if (srch) {
          const fields = [
            m.listing.location, 
            m.listing.projectSociety, 
            m.listing.brokerName
          ].filter(Boolean).join(' ').toLowerCase();
          if (!fields.includes(srch)) return false;
        }
        return true;
      });
      
      if (!ms.length) return null;
      return { ...g, matches: ms };
    }).filter(Boolean);

    if (sortMode === 'score') {
      groups.forEach(g => g.matches.sort((a,b) => b.score - a.score));
      groups.sort((a,b) => b.matches[0].score - a.matches[0].score);
    } else {
      // Latest: sort by myL._id descending (ObjectId holds timestamp)
      groups.sort((a,b) => b.myL.id.localeCompare(a.myL.id));
    }

    return groups;
  }, [matchGroups, fType, fCat, fScore, searchInp, sortMode]);

  const stats = useMemo(() => {
    const total = matchGroups.reduce((s,g) => s + g.matches.length, 0);
    const strong = matchGroups.reduce((s,g) => s + g.matches.filter(m => m.score >= 70).length, 0);
    const uniq = new Set(matchGroups.flatMap(g => g.matches.map(m => m.listing.brokerId))).size;
    return { listed: matchGroups.length, total, strong, uniq };
  }, [matchGroups]);

  const fTotal = filteredGroups.reduce((s,g) => s + g.matches.length, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a365d]"></div>
      </div>
    );
  }

  const mobScColor = (s) => s >= 70 ? '#166534' : s >= 40 ? '#92400e' : '#1e40af';
  const mobScLabel = (s) => s >= 70 ? 'Strong' : s >= 40 ? 'Good' : 'Possible';
  const mobScBg = (s) => s >= 70 ? '#166534' : s >= 40 ? '#d97706' : '#3b82f6';

  const allMobMatches = filteredGroups.flatMap(g =>
    g.matches.map(m => ({ ...m, myL: g.myL, isAvail: g.isAvail }))
  ).sort((a, b) => b.score - a.score);

  return (
    <>
      {/* MOBILE MATCHES */}
      <div className="md:hidden" style={{ background: '#f5f0e8', minHeight: '100vh', paddingBottom: 72 }}>
        <div style={{ background: '#fff', borderBottom: '0.5px solid #e0d8cc', padding: '6px 12px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1e3a5f' }}>My Matches</div>
            </div>
            <span style={{ background: '#dcfce7', color: '#166534', fontSize: 8.5, fontWeight: 700, padding: '3px 9px', borderRadius: 20 }}>Live</span>
            <button onClick={fetchMatches} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c8962a', padding: 4 }}>
              <RefreshCw size={16} />
            </button>
          </div>
          
          {/* Mobile Stats Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Listings Matched', val: stats.listed },
              { label: 'Total Matches', val: stats.total },
              { label: 'Strong Matches', val: stats.strong, valClass: 'text-green-700' },
              { label: 'Brokers to Connect', val: stats.uniq },
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg p-2 shadow-sm flex flex-col justify-center items-center text-center">
                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">{s.label}</div>
                <div className={`font-serif text-lg font-bold ${s.valClass || 'text-[#1e3a5f]'}`}>{s.val}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 5, paddingBottom: 4 }} className="mob-hscroll">
            {[['', 'All Types'], ['avail', 'Availability'], ['req', 'Requirements']].map(([val, label]) => (
              <button key={val} onClick={() => setFType(val)}
                className={`mob-tc ${fType === val ? 'on' : ''}`}
                style={{ fontSize: 8.5, padding: '3px 10px', border: 'none' }}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: '4px 0' }}>
          {allMobMatches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7060', fontSize: 12 }}>
              <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.2 }}>◎</div>No matches found
            </div>
          ) : allMobMatches.map((m, idx) => {
            const { listing, score, locCommon, projCommon, myL } = m;
            const initials = (listing.brokerName || 'UB').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
            const waMsg = encodeURIComponent(`Hi ${listing.brokerName}, I have a matching property — ${listing.subType || ''} at ${listing.location || ''}. Would like to connect.`);
            return (
              <div key={idx} className="mob-match-card">
                <div className="mob-mc-score-bar">
                  <span style={{ fontSize: 13, fontWeight: 600, color: mobScColor(score) }}>{score}%</span>
                  <div className="mob-mc-bar"><div className="mob-mc-fill" style={{ width: `${score}%`, background: mobScBg(score) }} /></div>
                  <span style={{ fontSize: 8.5, fontWeight: 600, color: mobScColor(score) }}>{mobScLabel(score)}</span>
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 3 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#166534', marginTop: 4, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: '#1a1a2e' }}>{m.isAvail ? 'My Avail' : 'My Req'}: {myL.subType}</div>
                      <div style={{ fontSize: 9, color: '#6b7060' }}>{myL.location}{myL.projectSociety ? ` · ${myL.projectSociety}` : ''}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 9, color: '#c0b8a0', padding: '2px 0' }}>
                    ⇅ {[locCommon?.length > 0 && 'location', projCommon?.length > 0 && 'project'].filter(Boolean).join(' + ')} matched
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#1e40af', marginTop: 4, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: '#1a1a2e' }}>{listing.postType === 'AVAILABILITY' ? 'Avail' : 'Wanted'}: {listing.subType}</div>
                      <div style={{ fontSize: 9, color: '#6b7060' }}>{listing.location}{listing.projectSociety ? ` · ${listing.projectSociety}` : ''}{listing.price ? ` · ₹${listing.price}` : ''}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials}</div>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: '#1a1a2e' }}>{listing.brokerName}</div>
                      <div style={{ fontSize: 9, color: '#6b7060' }}>{listing.brokerCompany}{listing.brokerCity ? ` · ${listing.brokerCity}` : ''}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 5, marginTop: 7 }}>
                    {listing.brokerPhone ? (
                      <>
                        <a href={`https://wa.me/91${listing.brokerPhone}?text=${waMsg}`} target="_blank" rel="noreferrer"
                          style={{ flex: 1, background: '#25D366', color: '#fff', fontSize: 9.5, padding: '4px 0', borderRadius: 5, textAlign: 'center', textDecoration: 'none', fontWeight: 600 }}>
                          💬 WhatsApp
                        </a>
                        <a href={`tel:${listing.brokerPhone}`}
                          style={{ flex: 1, background: '#dbeafe', color: '#1e40af', fontSize: 9.5, padding: '4px 0', borderRadius: 5, textAlign: 'center', textDecoration: 'none', fontWeight: 600, border: '0.5px solid #93c5fd' }}>
                          📞 Call
                        </a>
                      </>
                    ) : <span style={{ fontSize: 9, color: '#6b7060', fontStyle: 'italic' }}>No phone</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DESKTOP MATCHES */}
      <div className="hidden md:block max-w-[1400px] mx-auto py-6 px-4 font-sans text-sm text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-serif text-[#1e3a5f] font-bold">Your Deal Matches</h1>
          <p className="text-slate-500 text-xs mt-1">
            Matches found across all your listings — availability and requirements. <strong className="text-slate-700">City</strong> and <strong className="text-slate-700">Sub-type</strong> must match, and both <strong className="text-slate-700">Location</strong> and <strong className="text-slate-700">Project</strong> must have keyword overlap.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search location, project, broker…" 
              value={searchInp}
              onChange={(e) => setSearchInp(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:border-[#1e3a5f] outline-none"
            />
          </div>
          <button onClick={fetchMatches} className="flex items-center gap-2 bg-[#c8962a] text-[#0d1520] px-4 py-2 rounded-lg font-bold hover:bg-[#a67d26] transition-colors shrink-0">
            <RefreshCw size={14} /> <span className="hidden md:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Listings Matched', val: stats.listed, sub: 'Your listings with results' },
          { label: 'Total Matches', val: stats.total, sub: 'Requirements matched' },
          { label: 'Strong Matches', val: stats.strong, sub: 'Score 70% and above', valClass: 'text-green-700' },
          { label: 'Brokers to Connect', val: stats.uniq, sub: 'Unique brokers' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">{s.label}</div>
            <div className={`font-serif text-3xl font-bold ${s.valClass || 'text-[#1e3a5f]'}`}>{s.val}</div>
            <div className="text-xs text-slate-400 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 mb-6 flex flex-wrap items-center gap-3 shadow-sm">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold ml-1">Filter</span>
        <select value={fType} onChange={(e) => setFType(e.target.value)} className="bg-[#f5f0e8] border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#1e3a5f]">
          <option value="">Availability & Requirements</option>
          <option value="avail">My Availability Only</option>
          <option value="req">My Requirements Only</option>
        </select>
        <select value={fCat} onChange={(e) => setFCat(e.target.value)} className="bg-[#f5f0e8] border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#1e3a5f]">
          <option value="">All Categories</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>
        <select value={fScore} onChange={(e) => setFScore(e.target.value)} className="bg-[#f5f0e8] border border-slate-200 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-[#1e3a5f]">
          <option value="0">All Scores</option>
          <option value="70">Strong (70%+)</option>
          <option value="40">Good & Above (40%+)</option>
        </select>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">{fTotal} match{fTotal !== 1 ? 'es' : ''}</span>
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button 
              onClick={() => setSortMode('score')} 
              className={`px-3 py-1.5 text-xs font-semibold ${sortMode === 'score' ? 'bg-[#1e3a5f] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >Score ↑</button>
            <button 
              onClick={() => setSortMode('date')} 
              className={`px-3 py-1.5 text-xs font-semibold border-l border-slate-200 ${sortMode === 'date' ? 'bg-[#1e3a5f] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >Latest</button>
          </div>
        </div>
      </div>

      {/* Match Groups */}
      {filteredGroups.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Target className="mx-auto text-slate-200 mb-4" size={48} />
          <h3 className="font-serif text-xl text-slate-500 mb-2">No matches found</h3>
          <p className="text-sm text-slate-400">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map((g, gi) => {
            const isOpen = openGroups.has(gi);
            const myProj = g.myL.projectSociety || '';
            const myPrice = g.myL.price || g.myL.budgetMax || '';
            const strong = g.matches.filter(m => m.score >= 70).length;
            const uniqBrokers = new Set(g.matches.map(m => m.listing.brokerId)).size;

            return (
              <div key={gi} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300">
                {/* Group Header */}
                <div 
                  onClick={() => toggleGroup(gi)}
                  className={`flex items-center gap-4 p-4 cursor-pointer select-none transition-colors border-l-4 ${g.isAvail ? 'border-l-green-600 bg-green-50/30 hover:bg-green-50/50' : 'border-l-[#1e3a5f] bg-blue-50/30 hover:bg-blue-50/50'} ${isOpen ? 'border-b border-slate-200' : ''}`}
                >
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md shrink-0 ${g.isAvail ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {g.isAvail ? 'My Availability' : 'My Requirement'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                      {g.myL.vertical} · {g.myL.intent?.replace(/_/g, ' ')}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${PILL[g.myL.subType] || 'bg-slate-100 text-slate-700'}`}>
                        {g.myL.subType}
                      </span>
                      <span className="text-sm font-bold text-slate-800 truncate">{g.myL.location}</span>
                      {myProj && <span className="text-xs text-slate-500 truncate">· {myProj}</span>}
                    </div>
                  </div>
                  {g.myL.size && <div className="text-xs text-slate-500 shrink-0 hidden md:block">{g.myL.size}</div>}
                  {myPrice && <div className="font-serif font-bold text-[#1e3a5f] shrink-0">₹ {myPrice}</div>}
                  <div className="flex items-center gap-1.5 bg-[#c8962a] text-[#0d1520] px-3 py-1 rounded-full text-[11px] font-bold shrink-0">
                    🎯 {g.matches.length} {g.matches.length !== 1 ? 'matches' : 'match'}
                    {strong > 0 && <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full ml-1 text-[10px]">{strong} strong</span>}
                  </div>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Match Table */}
                {isOpen && (
                  <div className="overflow-x-auto">
                    <div className="min-w-[900px]">
                      {/* Table Head */}
                      <div className="grid grid-cols-[80px_110px_1fr_1fr_160px_80px_100px_130px] p-3 bg-[#faf8f4] border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                        <span>Score</span><span>Sub-Type</span><span>Location</span><span>Project</span>
                        <span>Broker</span><span>Area</span><span>Budget/Price</span><span>Connect</span>
                      </div>
                      {/* Table Rows */}
                      {g.matches.map((m, mi) => {
                        const { listing, score, locCommon, projCommon } = m;
                        const oProj = listing.projectSociety || '';
                        const oPrice = listing.price || listing.budgetMax || '';
                        const isOtherAvail = listing.postType === 'AVAILABILITY';
                        const waMsg = encodeURIComponent(`Hi ${listing.brokerName}, I have a matching ${g.isAvail ? 'requirement for your availability' : 'availability for your requirement'} on BrokersPost — ${listing.subType||''} at ${listing.location||''}${oProj?' · '+oProj:''}. Would like to connect.`);

                        return (
                          <div key={mi} className="grid grid-cols-[80px_110px_1fr_1fr_160px_80px_100px_130px] p-3 border-b border-slate-100 hover:bg-[#faf8f4] items-center transition-colors">
                            {/* Score */}
                            <div>
                              <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-bold ${scClass(score)}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${scDot(score)}`} />
                                {score}%
                              </div>
                              <div className="w-full h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: scBar(score) }} />
                              </div>
                              <div className="text-[9px] uppercase tracking-wider text-slate-400 mt-1">{scLbl(score)}</div>
                            </div>
                            {/* SubType */}
                            <div className="pr-2">
                              <span className={`px-2 py-0.5 inline-block rounded-full text-[10px] font-medium mb-1 ${PILL[listing.subType] || 'bg-slate-100 text-slate-700'}`}>
                                {listing.subType}
                              </span>
                              <div className="text-[9px] text-green-600 font-bold">✓ Sub-type match</div>
                              <div className="mt-1">
                                <span className={`px-2 py-0.5 inline-block rounded-full text-[9px] font-semibold ${isOtherAvail ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {isOtherAvail ? 'Availability' : 'Requirement'}
                                </span>
                              </div>
                            </div>
                            {/* Location */}
                            <div className="pr-2">
                              <div className="text-xs font-semibold text-slate-800 leading-snug mb-0.5">
                                {hlLoc(listing.location, locCommon)}
                              </div>
                              {listing.city && <div className="text-[10px] text-slate-500 mb-1">{listing.city}</div>}
                              {m.locMatched ? (
                                <span className="inline-block px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800 text-[9px] font-bold">📍 Location matched</span>
                              ) : (
                                <span className="text-[9px] text-slate-400 italic">Not matched</span>
                              )}
                            </div>
                            {/* Project */}
                            <div className="pr-2">
                              <div className="text-xs text-slate-800 leading-snug mb-1">
                                {hlProj(oProj, projCommon)}
                              </div>
                              {m.projMatched ? (
                                <span className="inline-block px-1.5 py-0.5 rounded-sm bg-green-100 text-green-800 text-[9px] font-bold">◈ Project matched</span>
                              ) : (
                                <span className="text-[9px] text-slate-400 italic">{oProj ? 'Not matched' : '—'}</span>
                              )}
                            </div>
                            {/* Broker */}
                            <div className="flex items-center gap-2 pr-2">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ backgroundColor: bColor(listing.brokerId) }}>
                                {ini(listing.brokerName)}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-800 truncate">{listing.brokerName}</div>
                                <div className="text-[10px] text-slate-500 truncate">{listing.brokerCompany}{listing.brokerCity ? ` · ${listing.brokerCity}` : ''}</div>
                              </div>
                            </div>
                            {/* Area */}
                            <div className="text-xs text-slate-500 pr-2">{listing.size || '—'}</div>
                            {/* Budget */}
                            <div className="text-xs font-bold text-[#1e3a5f] pr-2">{oPrice ? `₹ ${oPrice}` : '—'}</div>
                            {/* Connect */}
                            <div className="flex items-center gap-1.5">
                              {listing.brokerPhone ? (
                                <>
                                  <a href={`https://wa.me/91${listing.brokerPhone}?text=${waMsg}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 bg-[#25D366] text-white px-2 py-1.5 rounded text-[10px] font-bold hover:bg-[#128C7E] transition-colors">
                                    <MessageCircle size={12} /> WA
                                  </a>
                                  <a href={`tel:${listing.brokerPhone}`} className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1.5 rounded text-[10px] font-bold hover:bg-blue-100 transition-colors">
                                    <Phone size={12} /> Call
                                  </a>
                                </>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">No phone</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {/* Table Footer */}
                      <div className="p-2.5 bg-[#faf8f4] border-t border-slate-200 text-[10px] text-slate-500 flex flex-wrap items-center gap-2">
                        <span>📍 Matched on: <strong className="text-slate-700">{g.myL.location}</strong>{myProj && <span> · ◈ <strong className="text-slate-700">{myProj}</strong></span>}</span>
                        <span className="text-slate-300">|</span>
                        <span>{g.matches.length} result{g.matches.length !== 1 ? 's' : ''} from {uniqBrokers} broker{uniqBrokers !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </div>{/* end desktop wrapper */}
    </>
  );
};

export default Matches;
