import {act, renderHook} from '@testing-library/react-hooks';
import {vi, it, expect} from 'vitest';
import useDebounce from '../../features/search-tracks/hooks/useDebounce';

vi.useFakeTimers();

it.only('should update value after specified delay (inclusive)', () => {
  const {result, rerender} = renderHook(
    ({value, delay}) => useDebounce(value, delay),
    {initialProps: {value: 'CJ', delay: 500}}
  );

  expect(result.current).toBe('CJ');
  act(() => {
    vi.advanceTimersByTime(510);
  });
  expect(result.current).toBe('CJ');

  rerender({value: 'Sweet', delay: 500});

  expect(result.current).toBe('CJ');
  act(() => {
    vi.advanceTimersByTime(499);
  });
  expect(result.current).toBe('CJ');
  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(result.current).toBe('Sweet');
});
