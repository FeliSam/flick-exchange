import { useState, useEffect } from 'react';

const FALLBACK_RATE = 7.42;

export function useExchangeRate() {
  const [rate, setRate] = useState(FALLBACK_RATE);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/RUB');
        const data = await response.json();
        if (data.rates && data.rates.XOF) {
          setRate(data.rates.XOF);
          setLastUpdate(new Date());
        }
      } catch (err) {
        setRate(FALLBACK_RATE);
      } finally {
        setLoading(false);
      }
    };
    fetchRate();
    const interval = setInterval(fetchRate, 300000);
    return () => clearInterval(interval);
  }, []);

  const convert = (amount, from, to) => {
    if (from === to) return amount;
    if (from === 'RUB' && to === 'XOF') return amount * rate;
    if (from === 'XOF' && to === 'RUB') return amount / rate;
    return amount;
  };

  return { rate, loading, lastUpdate, convert };
}
