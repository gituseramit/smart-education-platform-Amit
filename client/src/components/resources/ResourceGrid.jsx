import ResourceCard from './ResourceCard';

const ResourceGrid = ({ resources, loading, onDelete }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border-[1.5px] border-[var(--cs-border)] p-6 h-52 animate-pulse">
            <div className="flex justify-between items-center mb-5">
              <div className="w-10 h-10 bg-slate-50 rounded-lg shrink-0 border border-slate-100"></div>
              <div className="w-24 h-6 bg-slate-50 rounded-full border border-slate-100"></div>
            </div>
            <div className="w-3/4 h-7 bg-slate-50 rounded-lg mb-3"></div>
            <div className="w-full h-5 bg-slate-50 rounded-lg mb-3"></div>
            <div className="w-2/3 h-5 bg-slate-50 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-[1.5px] border-[var(--cs-border)] p-16 text-center shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
        <div className="text-5xl mb-6">📂</div>
        <h3 className="text-1.5rem font-black text-[#111827] mb-3 tracking-tight">Empty Resource Library</h3>
        <p className="text-[var(--cs-text-muted)] max-w-sm mx-auto font-medium leading-relaxed">
          We couldn't locate any wisdom matching your search. Be the first to contribute or adjust your exploration filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <ResourceCard 
          key={resource._id} 
          resource={resource} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ResourceGrid;
