import { useState, useEffect, useRef } from 'react';
import { resourceApi } from '../../services/resourceApi';

const SUBJECTS = [
  'All',
  'Math',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'History',
  'English',
  'Economics',
];

const SubjectFilter = ({ currentSubject, onSubjectChange }) => {
  const [counts, setCounts] = useState({});
  const scrollRef = useRef(null);

  useEffect(() => {
    // Fetch subject resource counts
    const fetchCounts = async () => {
      try {
        const { data } = await resourceApi.getSubjectCounts();
        const countsMap = data.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {});
        setCounts(countsMap);
      } catch (error) {
        console.error('Failed to fetch subject counts:', error);
      }
    };
    fetchCounts();
  }, []);

  const getBadgeColor = (subject, isActive) => {
    if (isActive) {
      return 'bg-primary-600 text-white shadow-md border-transparent transform scale-105';
    }
    
    // Default inactive state
    return 'bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50';
  };

  return (
    <div className="relative w-full">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto py-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2 snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {SUBJECTS.map((subject) => {
          const isActive = currentSubject === subject;
          const count = counts[subject] || 0;
          
          return (
            <button
              key={subject}
              onClick={() => onSubjectChange(subject)}
              className={`flex-shrink-0 flex items-center space-x-2 px-5 py-2 rounded-full border-[1.5px] text-[.85rem] font-bold transition-all duration-300 snap-start ${
                isActive 
                  ? 'bg-[var(--cs-primary)] text-white border-transparent' 
                  : 'bg-[#f8fafc] text-[#4b5563] border-[var(--cs-border)] hover:border-[var(--cs-primary)] hover:text-[var(--cs-primary)]'
              }`}
            >
              <span>{subject}</span>
              {count > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-white border-[1.5px] border-[var(--cs-border)] text-[var(--cs-primary)]'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Gradients to indicate scrollable area on mobile */}
      <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none sm:hidden"></div>
      <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none sm:hidden"></div>
    </div>
  );
};

export default SubjectFilter;
