import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import SearchIcon from './SearchIcon';

const SearchBarDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const SearchBarForm = styled.form`
  background-color: var(--pure-white);
  border: 0px;
  border-radius: 4px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 48px;
  margin: 0;
  color: black;
  width: 100%;
  max-width: 600px;
`;

const SearchInput = styled.input`
  flex: 1 0 0;
  padding: 0 12px;
  border: 0;
  min-width: 0;
  &:focus {
    outline: 0;
  }
`;

const SearchBarButton = styled.button`
  height: 100%;
  border: 0;
  background-color: var(--spotify-brand-color-bright);
  border-radius: 4px;
  cursor: pointer;
  padding: 12px;
`;

function SearchBar() {
  const inputRef = useRef(null);
  const [token, setToken] = useState({
    accessToken: null,
    accessTokenExpirationTimestampMs: 0,
  });

  useEffect(() => {
    fetch('/api/get-access-token')
      .then((res) => res.json())
      .then((res) => {
        setToken(res);
      });
  }, []);

  function onSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function onPushedButton(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault();

    fetch('/api/search', {
      headers: {
        Authorization: `${token.accessToken}`,
      },
      credentials: 'omit',
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
    /* fetch(
      'https://api.spotify.com/v1/search' +
        `?q=${encodeURIComponent(inputRef.current.value)}` +
        `&type=${encodeURIComponent('track,artist,album')}` +
        `&limit=20`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token.accessToken}`,
          'Accept-Language': navigator.languages[0],
        },
      }
    )
      .then((res) => res.json())
      .then((res) => console.log(res)); */
  }

  return (
    <SearchBarDiv>
      <SearchBarForm onSubmit={onSubmitForm}>
        <SearchInput autoComplete="off" ref={inputRef} />
        <SearchBarButton type="submit" aria-label="Search">
          <SearchIcon width="24" height="24" additionalStrokeWidth="3%" />
        </SearchBarButton>
      </SearchBarForm>
      <button onClick={onPushedButton}>フェッチ</button>
    </SearchBarDiv>
  );
}

export default SearchBar;
