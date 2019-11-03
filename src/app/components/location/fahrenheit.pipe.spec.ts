import { FahrenheitPipe } from './fahrenheit.pipe';

describe('FahrenheitPipe', () => {
  it('create an instance', () => {
    const pipe = new FahrenheitPipe();
    expect(pipe).toBeTruthy();
  });
});
