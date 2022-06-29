import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {vi, test, expect} from 'vitest';
import PageLoadingFailedView from '../../components/views/home/PageLoadingFailedView';

vi.useFakeTimers();

test('fires the retry button event on the retry button click', () => {
  const onClear = vi.fn();
  render(<PageLoadingFailedView onRetryButtonClick={onClear} />);

  const buttonId = 'pageLoadingFailedViewRetryButton';
  fireEvent.click(screen.getByTestId(buttonId));
  expect(onClear).toHaveBeenCalledTimes(1);
});
