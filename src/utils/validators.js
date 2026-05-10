// Validate Benin phone numbers with network detection
export function validateBeninPhone(phone) {
  const clean = phone.replace(/\s/g, '').replace(/^\+229/, '');
  if (!/^\d{8}$/.test(clean)) return { valid: false, network: null, error: 'Le numéro doit contenir 8 chiffres' };

  const prefix = clean.substring(0, 2);
  const mtnPrefixes = ['01','40','41','42','43','50','51','52','53','54','56','57','61','62','66','67','69','90','91','92','93','94','95','96','97','98','99'];
  const moovPrefixes = ['10','11','12','13','14','15','16','17','19','60','63','64','65','68','44','45','46','47','48','49','55','58','59','21','22','23','25','26','27','28','29'];
  const celtiisPrefixes = ['04','05','06','07','08','09','24','30','31','32','33','34','35','36','37','38','39','70','71','72','73','74','75','76','77','78','79'];

  if (mtnPrefixes.includes(prefix)) return { valid: true, network: 'MTN', formatted: `+229 ${clean.substring(0,2)} ${clean.substring(2,5)} ${clean.substring(5,8)}` };
  if (moovPrefixes.includes(prefix)) return { valid: true, network: 'Moov', formatted: `+229 ${clean.substring(0,2)} ${clean.substring(2,5)} ${clean.substring(5,8)}` };
  if (celtiisPrefixes.includes(prefix)) return { valid: true, network: 'Celtiis', formatted: `+229 ${clean.substring(0,2)} ${clean.substring(2,5)} ${clean.substring(5,8)}` };

  return { valid: false, network: null, error: 'Préfixe non reconnu au Bénin' };
}

// Validate Russia phone numbers
export function validateRussiaPhone(phone) {
  const clean = phone.replace(/\s/g, '').replace(/^\+7/, '').replace(/^8/, '');
  if (!/^\d{10}$/.test(clean)) return { valid: false, error: 'Le numéro russe doit contenir 10 chiffres après le +7' };
  return { valid: true, formatted: `+7 ${clean.substring(0,3)} ${clean.substring(3,6)}-${clean.substring(6,8)}-${clean.substring(8,10)}` };
}

// Format currency
export function formatCurrency(amount, currency) {
  return `${amount.toLocaleString('fr-FR')} ${currency}`;
}

// App version
export const APP_VERSION = '1.0.0';
export const APP_NAME = 'Flick-exchange';
