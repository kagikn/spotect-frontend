import React from 'react';
import {cleanup, render, screen, fireEvent} from '@testing-library/react';
import {vi, test, expect, afterEach} from 'vitest';
import SearchBarForForm from '../../components/SearchBar/SearchBarForForm';

vi.useFakeTimers();

test('fires the clear button event on the clear button click and the button disappears', () => {
  afterEach(cleanup);

  const onClear = vi.fn();
  render(
    <SearchBarForForm
      value="S"
      onInputChange={() => {}}
      onInputClearButtonPressed={onClear}
    />
  );

  const clearInputId = 'searchBarFormClearInput';
  fireEvent.click(screen.getByTestId(clearInputId));
  expect(onClear).toHaveBeenCalledTimes(1);
});

test('fires the change input event as the input changes', () => {
  const onInputChange = vi.fn();
  render(
    <SearchBarForForm
      value="S"
      onInputChange={onInputChange}
      onInputClearButtonPressed={() => {}}
    />
  );

  const inputElement = screen.getByTestId('searchBarFormInput');
  fireEvent.change(inputElement, {target: {value: 'A'}});
  expect(onInputChange).toHaveBeenCalledTimes(1);
});

test('changes the input string of the element as the input changes', () => {
  let inputStr = '';
  const onInputChange = (e) => {
    inputStr = e.target.value;
  };
  const onClearButtonPressedEvent = () => {};
  const {rerender} = render(
    <SearchBarForForm
      value={inputStr}
      onInputChange={onInputChange}
      onInputClearButtonPressed={onClearButtonPressedEvent}
    />
  );

  const inputElement = screen.getByTestId(
    'searchBarFormInput'
  ) as HTMLInputElement;
  fireEvent.change(inputElement, {target: {value: 'A'}});

  rerender(
    <SearchBarForForm
      value={inputStr}
      onInputChange={onInputChange}
      onInputClearButtonPressed={onClearButtonPressedEvent}
    />
  );

  expect(inputElement.value).toStrictEqual('A');
});
