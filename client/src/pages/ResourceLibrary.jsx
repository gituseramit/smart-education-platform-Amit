import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resourceApi } from '../services/resourceApi';
import ResourceGrid from '../components/resources/ResourceGrid';
import SearchBar from '../components/resources/SearchBar';
import SubjectFilter from '../components/resources/SubjectFilter';

const T = { 
  primary: 'var(--cs-primary)', 
  border: 'var(--cs-border)', 
  text: 'var(--cs-text-main)', 
  muted: 'var(--cs-text-muted)',
  light: 'var(--cs-text-light)',
  accent: 'var(--cs-accent-career)'
};

const ResourceLibrary = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [subject, setSubject] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = { page, limit:12, sort:'newest' };
      if (searchTerm) params.search = searchTerm;
      if (subject && subject !== 'All') params.subject = subject;
      const { data } = await resourceApi.getAll(params);
      setResources(data.resources);
      setTotalPages(data.totalPages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchResources(); }, [searchTerm, subject, page]);

  const handleSearch = t => { setSearchTerm(t); setPage(1); };
  const handleSubject = s => { setSubject(s); setPage(1); };
  const handleDelete = id => setResources(p => p.filter(r => r._id !== id));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap'); *{font-family:'Outfit',sans-serif!important;}`}</style>

      {/* Header */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
        style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'1.5rem' }}>
        <div>
          <h1 style={{ fontSize:'2rem', fontWeight:900, letterSpacing:'-0.03em', marginBottom:'.4rem', color: '#111827' }}>
            Resource <span style={{ background:`linear-gradient(135deg,${T.primary},#4f46e5)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Library</span>
          </h1>
          <p style={{ color:T.muted, fontSize:'.95rem', fontWeight: 500 }}>A curated collection of educational materials shared by the Smart Education Platform community.</p>
        </div>
        <Link to="/resources/upload" className="cs-button-primary" style={{ textDecoration:'none', padding: '.75rem 1.8rem' }}>
          + Share Resource
        </Link>
      </motion.div>

      {/* Filters Overlay */}
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:.08 }}
        style={{ background:'white', border:'1.5px solid var(--cs-border)', borderRadius:24, padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.5rem', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.02)' }}>
        <div style={{ width:'100%', maxWidth:420 }}>
          <SearchBar onSearch={handleSearch} initialValue={searchTerm}/>
        </div>
        <SubjectFilter currentSubject={subject} onSubjectChange={handleSubject}/>
      </motion.div>

      {/* Grid */}
      <ResourceGrid resources={resources} loading={loading} onDelete={handleDelete}/>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div style={{ display:'flex', justifyContent:'center', gap:'.8rem', alignItems:'center', marginTop:'1rem' }}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
            style={{ padding:'.7rem 1.5rem', borderRadius:14, border:`1.5px solid ${T.border}`, background: page===1?'#f8fafc':'white', color: page===1?T.light:'#374151', fontWeight:700, fontSize:'.85rem', cursor:page===1?'not-allowed':'pointer', transition:'all .2s' }}>
            ← Previous
          </button>
          <span style={{ fontSize:'.9rem', color:T.muted, fontWeight: 700 }}>{page} <span style={{ color:T.light, fontWeight: 500 }}>of</span> {totalPages}</span>
          <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
            style={{ padding:'.7rem 1.5rem', borderRadius:14, border:`1.5px solid ${T.border}`, background: page===totalPages?'#f8fafc':'white', color: page===totalPages?T.light:'#374151', fontWeight:700, fontSize:'.85rem', cursor:page===totalPages?'not-allowed':'pointer', transition:'all .2s' }}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
