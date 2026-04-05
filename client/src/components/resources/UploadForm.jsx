import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourceApi } from '../../services/resourceApi';

const SUBJECTS = [
  'Math',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'History',
  'English',
  'Economics',
];

const UploadForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    resourceType: 'pdf',
    fileURL: '',
    noteContent: '',
  });
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({ 
      ...prev, 
      resourceType: type,
      // Reset specific fields when changing type
      fileURL: '',
      noteContent: ''
    }));
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed.');
        setFile(null);
        e.target.value = '';
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit.');
        setFile(null);
        e.target.value = '';
        return;
      }
      setError('');
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.title || !formData.subject) {
        throw new Error('Title and Subject are required');
      }

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('subject', formData.subject);
      submitData.append('resourceType', formData.resourceType);

      if (formData.resourceType === 'pdf') {
        if (!file) throw new Error('Please select a PDF file to upload');
        submitData.append('file', file);
      } else if (formData.resourceType === 'link') {
        if (!formData.fileURL) throw new Error('Please provide the external URL');
        submitData.append('fileURL', formData.fileURL);
      } else if (formData.resourceType === 'note') {
        if (!formData.noteContent) throw new Error('Please enter note content');
        submitData.append('noteContent', formData.noteContent);
      }

      await resourceApi.create(submitData);
      
      setSuccess('Resource successfully uploaded!');
      
      // Navigate after short delay to let user see success message
      setTimeout(() => {
        navigate('/resources');
      }, 1500);
      
    } catch (err) {
      console.error('Upload error:', err);
      // Check if it's an axios error with a response message
      setError(err.response?.data?.message || err.message || 'An error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap'); *{font-family:'Outfit',sans-serif!important;}`}</style>

      <div className="bg-white rounded-[32px] border-[1.5px] border-[var(--cs-border)] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.06)]">
        <div className="bg-white border-b border-[var(--cs-border)] px-10 py-10">
          <h2 className="text-[2rem] font-black text-[#111827] tracking-tight">Expand the <span style={{ background:`linear-gradient(135deg,var(--cs-primary),#4f46e5)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Library</span></h2>
          <p className="text-[var(--cs-text-muted)] text-[.95rem] font-medium mt-1">Contribute your wisdom to the community platform.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[.9rem] flex items-start border border-red-100 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-2xl text-[.9rem] flex items-start border border-emerald-100 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{success} Platform updated.</span>
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-[.85rem] font-black text-[#374151] mb-2 uppercase tracking-wider">Resource Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-2xl border-[1.5px] border-[var(--cs-border)] px-5 py-4 focus:border-[var(--cs-primary)] focus:shadow-[0_0_0_4px_rgba(30,64,185,0.08)] outline-none transition-all text-[#111827] font-semibold bg-white"
                placeholder="e.g. Advanced Calculus Study Guide"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-[.85rem] font-black text-[#374151] mb-2 uppercase tracking-wider">Academic Subject *</label>
              <div className="relative">
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full appearance-none rounded-2xl border-[1.5px] border-[var(--cs-border)] px-5 py-4 focus:border-[var(--cs-primary)] focus:shadow-[0_0_0_4px_rgba(30,64,185,0.08)] outline-none transition-all text-[#111827] font-semibold bg-white"
                  required
                >
                  <option value="" disabled>Select subject</option>
                  {SUBJECTS.map(subj => <option key={subj} value={subj}>{subj}</option>)}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#94a3b8]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-[.85rem] font-black text-[#374151] mb-2 uppercase tracking-wider">Contextual Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full rounded-2xl border-[1.5px] border-[var(--cs-border)] px-5 py-4 focus:border-[var(--cs-primary)] focus:shadow-[0_0_0_4px_rgba(30,64,185,0.08)] outline-none transition-all resize-none text-[#111827] font-semibold bg-white"
                placeholder="Help others understand the value of this material..."
              ></textarea>
            </div>
          </div>

          {/* Resource Type Selection */}
          <div className="pt-6 border-t border-[var(--cs-border)]">
            <label className="block text-[.85rem] font-black text-[#374151] mb-5 uppercase tracking-wider text-center">Material Format *</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'pdf', icon: '📄', label: 'PDF Library' },
                { id: 'note', icon: '📝', label: 'Text Wisdom' },
                { id: 'link', icon: '🔗', label: 'Web Oracle' },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleTypeChange(type.id)}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl border-[1.5px] transition-all duration-300 ${
                    formData.resourceType === type.id 
                      ? 'border-[var(--cs-primary)] bg-[var(--cs-primary)]/5 text-[var(--cs-primary)] scale-105 shadow-[0_10px_20px_-5px_rgba(30,64,185,0.1)]' 
                      : 'border-[var(--cs-border)] bg-[#f8fafc] text-[#64748b] hover:border-[#cbd5e1]'
                  }`}
                >
                  <span className="text-3xl mb-3">{type.icon}</span>
                  <span className="text-[.75rem] font-black tracking-tight">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Inputs based on Resource Type */}
          <div className="pt-2 min-h-[140px]">
            {/* PDF Upload */}
            {formData.resourceType === 'pdf' && (
              <div className="border-[1.5px] border-dashed border-[#cbd5e1] rounded-2xl p-10 text-center hover:bg-[#f8fafc] hover:border-[var(--cs-primary)] transition-all cursor-pointer relative group">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center pointer-events-none">
                  <div className="w-16 h-16 rounded-2xl bg-white border-[1.5px] border-[var(--cs-border)] flex items-center justify-center mb-4 text-3xl group-hover:scale-110 transition-transform duration-300">
                    📂
                  </div>
                  <h4 className="text-[1rem] font-black text-[#111827]">
                    {file ? file.name : 'Vesting the Document'}
                  </h4>
                  <p className="text-[.85rem] text-[#94a3b8] mt-1 font-semibold">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Drop PDF here or click to browse (10MB limit)'}
                  </p>
                  {file && (
                    <span className="mt-4 text-[.75rem] bg-[var(--cs-accent-wellness)] text-white px-4 py-1.5 rounded-full font-black uppercase tracking-wider">Validated & Ready</span>
                  )}
                </div>
              </div>
            )}

            {/* Markdown/Text Note */}
            {formData.resourceType === 'note' && (
              <div>
                <label htmlFor="noteContent" className="block text-[.85rem] font-black text-[#374151] mb-2 uppercase tracking-wider">
                  Knowledge Content <span className="text-[#94a3b8] lowercase font-semibold ml-2">(Markdown accepted)</span>
                </label>
                <textarea
                  id="noteContent"
                  name="noteContent"
                  value={formData.noteContent}
                  onChange={handleInputChange}
                  rows="10"
                  className="w-full rounded-2xl border-[1.5px] border-[var(--cs-border)] px-6 py-6 focus:border-[var(--cs-primary)] focus:shadow-[0_0_0_4px_rgba(30,64,185,0.08)] outline-none font-mono text-[.9rem] leading-relaxed text-[#111827] bg-[#f8fafc]"
                  placeholder="# Divine Knowledge&#10;&#10;Transcribe your learnings here..."
                  required={formData.resourceType === 'note'}
                ></textarea>
              </div>
            )}

            {/* External Link */}
            {formData.resourceType === 'link' && (
              <div>
                <label htmlFor="fileURL" className="block text-[.85rem] font-black text-[#374151] mb-2 uppercase tracking-wider">The Digital Source</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-[#94a3b8]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    id="fileURL"
                    name="fileURL"
                    value={formData.fileURL}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border-[1.5px] border-[var(--cs-border)] pl-14 pr-6 py-4 focus:border-[var(--cs-primary)] focus:shadow-[0_0_0_4px_rgba(30,64,185,0.08)] outline-none text-[#111827] font-semibold bg-white"
                    placeholder="https://community-wisdom.org/path"
                    required={formData.resourceType === 'link'}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-6 flex flex-col-reverse sm:flex-row justify-end gap-4 border-t border-[var(--cs-border)]">
            <button
              type="button"
              onClick={() => navigate('/resources')}
              className="px-8 py-3.5 rounded-2xl font-black text-[#64748b] bg-[#f1f5f9] hover:bg-[#e2e8f0] transition-all w-full sm:w-auto text-center text-[.9rem]"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (formData.resourceType === 'pdf' && !file)}
              className="cs-button-primary px-10 py-3.5 rounded-2xl w-full sm:w-auto flex items-center justify-center min-w-[200px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Transmitting...
                </>
              ) : (
                'Publish Wisdom →'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
