/**
 * @jest-environment jsdom
 */
import {act, renderHook} from '@testing-library/react-hooks';
import useDebounce from '../../components/SearchBar/useDebounce';

jest.useFakeTimers();

it.only('should update value after specified delay (inclusive)', () => {
  const {result, rerender} = renderHook(
    ({value, delay}) => useDebounce(value, delay),
    {initialProps: {value: 'CJ', delay: 500}}
  );

  expect(result.current).toBe('CJ');
  act(() => jest.advanceTimersByTime(510));
  expect(result.current).toBe('CJ');

  rerender({value: 'Sweet', delay: 500});

  expect(result.current).toBe('CJ');
  act(() => jest.advanceTimersByTime(499));
  expect(result.current).toBe('CJ');
  act(() => jest.advanceTimersByTime(1));
  expect(result.current).toBe('Sweet');
});
