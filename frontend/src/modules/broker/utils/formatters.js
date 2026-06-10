export const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

export const normalizeSubType = (subType) => {
  if (!subType) return '';
  const s = subType.trim().toLowerCase();
  if (s === 'appartments' || s === 'apartments') return 'Apartments';
  if (s === 'kothi/villa' || s === 'kothi/villas' || s === 'kothi / villas') return 'Kothi/Villas';
  if (s === 'plot' || s === 'plots') return 'Plots';
  if (s === 'offices' || s === 'office' || s === 'office space') return 'Office Space';
  return subType.trim();
};
