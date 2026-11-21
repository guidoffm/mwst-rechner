import { calculate, formatMoney, parseAmount } from './vat';

describe('calculate', () => {
  it('rechnet Netto zu Brutto mit 19 %', () => {
    expect(calculate(10000, 19, 'net-to-gross')).toEqual({
      netCents: 10000,
      vatCents: 1900,
      grossCents: 11900,
      rate: 19,
    });
  });

  it('rechnet Brutto zu Netto mit 19 %', () => {
    expect(calculate(11900, 19, 'gross-to-net')).toEqual({
      netCents: 10000,
      vatCents: 1900,
      grossCents: 11900,
      rate: 19,
    });
  });

  it('rundet kaufmännisch und Netto + Steuer ergibt immer Brutto', () => {
    const r = calculate(1000, 19, 'gross-to-net'); // 8,403... → 8,40
    expect(r.netCents).toBe(840);
    expect(r.vatCents).toBe(160);
    expect(r.netCents + r.vatCents).toBe(r.grossCents);
  });

  it('rundet halbe Cent auf', () => {
    // 0,50 € * 19 % = 0,095 € → 0,10 €
    expect(calculate(50, 19, 'net-to-gross').vatCents).toBe(10);
  });

  it('kann Steuersätze mit Nachkommastellen (CH 8,1 %)', () => {
    expect(calculate(10000, 8.1, 'net-to-gross').vatCents).toBe(810);
  });

  it('funktioniert mit negativen Beträgen (Gutschrift)', () => {
    expect(calculate(-50, 19, 'net-to-gross').vatCents).toBe(-10);
  });

  it('funktioniert mit 0 %', () => {
    expect(calculate(1234, 0, 'gross-to-net')).toEqual({
      netCents: 1234,
      vatCents: 0,
      grossCents: 1234,
      rate: 0,
    });
  });
});

describe('parseAmount', () => {
  it.each([
    ['', 0],
    ['0', 0],
    ['100', 10000],
    ['12,5', 1250],
    ['12,50', 1250],
    ['1.234,56', 123456],
    ['1.234', 123400],
    ['1.234.567', 123456700],
    ['1 234,56', 123456],
    ['1234.56', 123456],
    ['12.5', 1250],
    [',5', 50],
    ['5,', 500],
    ['-10,00', -1000],
    ['10 €', 1000],
    ['0,005', 1],
  ])('DE: „%s“ → %d', (input, expected) => {
    expect(parseAmount(input, ',')).toBe(expected);
  });

  it.each([
    ["1'234.56", 123456],
    ['1.234', 123],
    ['CHF 10.50', 1050],
  ])('CH: „%s“ → %d', (input, expected) => {
    expect(parseAmount(input, '.')).toBe(expected);
  });

  it.each(['abc', '1,2,3,4x', '1.234,5,6', ',', '--1'])('ungültig: „%s“', (input) => {
    expect(parseAmount(input, ',')).toBeNull();
  });
});

describe('formatMoney', () => {
  it('formatiert deutsch', () => {
    expect(formatMoney(123456, 'EUR', 'de-DE').replace(/\s/g, ' ')).toBe('1.234,56 €');
  });
});
