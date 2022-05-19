/**
 * @jest-environment jsdom
 */
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import SearchBarForForm from '../../components/SearchBar/SearchBarForForm';

jest.useFakeTimers();

test('fires clear button event on clear button click', () => {
  const onClear = jest.fn();
  render(
    <SearchBarForForm
      value="S"
      onInputChange={() => {}}
      onInputClearButtonPressed={onClear}
    />
  );

  fireEvent.click(screen.getByTestId('searchBarFormClearInput'));
  expect(onClear).toHaveBeenCalledTimes(1);
});
