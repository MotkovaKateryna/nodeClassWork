const userNameHandler = require('../userNameHandler');

// Simple test example
const buggyCalc = (a, b) => (a + b === 7 ? 8 : a + b);

describe('Calc test example', () => {
  // test n1
  test('test calc return 2+2=4', () => {
    expect(buggyCalc(2, 2)).toBe(4);
  });

  // test n2
  it('should returns 7', () => {
    expect(buggyCalc(3, 4)).toBe(8);
  });
});

// User name handler testing
const testingData = [
  { input: 'Jimi Hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi Hendrix', output: 'Jimi Hendrix' },
  { input: '   Jimi  hendriX ', output: 'Jimi Hendrix' },
  { input: 'Jimi_Hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi.hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi@hend@rix', output: 'Jimi Hend Rix' },
  { input: '_jimi * hendrix', output: 'Jimi Hendrix' },
  { input: 'jimi hèndrix__', output: 'Jimi Hendrix' },
  { input: 'jimi中村hèndrix__', output: 'Jimi Hendrix' },
  { input: 'jimi de Hèndrix__', output: 'Jimi De Hendrix' },
  { input: '中村哲二', output: '' },
  { input: undefined, output: '' },
  { input: null, output: '' },
  { input: true, output: '' },
];

describe('User name handler tests', () => {
  test('all cases', () => {
    for (const item of testingData) {
      const normalizedName = userNameHandler(item.input);

      expect(normalizedName).toBe(item.output);
    }
  });

  it('should returns "Jimi Hendrix"', () => {
    expect(userNameHandler(testingData[0].input)).toBe(testingData[0].output);
  });
});
