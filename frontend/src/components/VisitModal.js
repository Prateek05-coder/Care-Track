import React, { useState, useEffect } from 'react';

const VisitModal = ({ show, onClose, onSave, visit }) => {
  const [form, setForm] = useState({
    date: '',
    reason: '',
    diagnosis: '',
    treatment: '',
    notes: ''
  });

  useEffect(() => {
    if (visit) {
      setForm({
        date: visit.date ? visit.date.split('T')[0] : '',
        reason: visit.reason || '',
        diagnosis: visit.diagnosis || '',
        treatment: visit.treatment || '',
        notes: visit.notes || ''
      });
    } else {
      setForm({
        date: '',
        reason: '',
        diagnosis: '',
        treatment: '',
        notes: ''
      });
    }
  }, [visit, show]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.date || !form.reason) {
      alert('Please fill all required fields.');
      return;
    }
    onSave(form);
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog" role="document" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{visit ? 'Edit Visit' : 'Add Visit'}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-2">
                <label className="form-label">Visit Date *</label>
                <input type="date" className="form-control" name="date" value={form.date} onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label">Reason for Visit *</label>
                <input type="text" className="form-control" name="reason" value={form.reason} onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label">Diagnosis</label>
                <input type="text" className="form-control" name="diagnosis" value={form.diagnosis} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Treatment</label>
                <input type="text" className="form-control" name="treatment" value={form.treatment} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label className="form-label">Notes</label>
                <textarea className="form-control" name="notes" value={form.notes} onChange={handleChange} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">{visit ? 'Save Visit' : 'Save Visit'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VisitModal;