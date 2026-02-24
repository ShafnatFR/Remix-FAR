
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(amount);
};

export const getDateTimeParts = (dateStr?: string) => {
  let targetDate: Date | null = null;

  // 1. Coba parse dateStr
  if (dateStr) {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime()) && parsed.getFullYear() > 1900) {
      targetDate = parsed;
    } 
    // Fallback: Handle format legacy "DD/MM/YYYY" (manual parse)
    else if (dateStr.includes('/') && dateStr.split('/').length === 3) {
        const parts = dateStr.split('/');
        // Asumsi format DD/MM/YYYY
        targetDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
  }

  // 2. Jika dateStr tidak valid/kosong, atau tahun 1899, cek timeStr atau format jam
  if (!targetDate && dateStr) {
    const val = dateStr;
    // Jika format ISO 1899 (Time only dari Google Sheets)
    if (val && val.includes('1899-12-30')) {
      const timePart = new Date(val);
      targetDate = new Date(); // Gunakan hari ini
      targetDate.setHours(timePart.getHours());
      targetDate.setMinutes(timePart.getMinutes());
      targetDate.setSeconds(timePart.getSeconds());
    } 
    // Jika format jam string biasa "14:00"
    else if (val && val.includes(':') && !val.includes('T') && !val.includes('/')) {
      const [h, m] = val.split(':');
      targetDate = new Date();
      targetDate.setHours(parseInt(h));
      targetDate.setMinutes(parseInt(m));
    }
  }

  if (!targetDate) return null;

  const year = targetDate.getFullYear();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  
  let hours = targetDate.getHours();
  const minutes = String(targetDate.getMinutes()).padStart(2, '0');
  const seconds = String(targetDate.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // Jam '0' menjadi '12'

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}:${seconds}`,
    ampm
  };
};

export const isFoodExpired = (distributionEnd?: string): boolean => {
  const targetStr = distributionEnd;
  if (!targetStr) return false;
  
  const parts = getDateTimeParts(targetStr);
  if (!parts) return false;
  
  // Reconstruct full date from parts
  const [year, month, day] = parts.date.split('-').map(Number);
  const [h, m, s] = parts.time.split(':').map(Number);
  
  // Handle AM/PM for reconstruction
  let hours = h;
  if (parts.ampm === 'PM' && hours < 12) hours += 12;
  if (parts.ampm === 'AM' && hours === 12) hours = 0;
  
  const expiryDate = new Date(year, month - 1, day, hours, m, s);
  
  // Current time in Jakarta (WIB)
  const now = new Date();
  const jakartaNow = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
  
  return jakartaNow > expiryDate;
};

export const formatDateTime = (dateStr?: string): string => {
  const parts = getDateTimeParts(dateStr);
  if (!parts) return dateStr || "Waktu tidak tersedia";
  
  // Format Output Legacy: DD-MM-YYYY, HH:MM AM/PM (tanpa detik untuk kompatibilitas tampilan lama jika perlu)
  const d = new Date(dateStr || new Date());
  // Re-construct slightly for the legacy string return
  return `${parts.date.split('-').reverse().join('-')}, ${parts.time.split(':').slice(0,2).join(':')} ${parts.ampm}`;
};
