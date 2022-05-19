import React from 'react';
import styled from 'styled-components';
import SearchBar from '../../SearchBar/SearchBar';
import HomeHeader from './HomeHeader';

const SearchLangingContainer = styled.section`
  display: flex;
  flex-direction: column;
  height: 50%;
  justify-content: flex-end;
  align-items: stretch;
  width: 100%;
  text-align: center;
  background-image: linear-gradient(transparent, var(--background-base) 95%),
    linear-gradient(48.57deg, rgb(73, 28, 229), rgb(40, 170, 160));
`;

const HomeTitleHeading = styled.h1`
  font-size: 40px;
  line-height: 40px;
  margin: 0 0 20px;
  letter-spacing: -0.03em;
`;

const HomeSubheading = styled.p`
  margin: 0 32px 32px;
`;

const SearchBarGridDiv = styled.div`
  display: grid;
  grid-template-columns: 16px 1fr 16px;
`;

const SearchBarDiv = styled.div`
  grid-column-start: 2;
  grid-column-end: 3;
`;

const Home = (): JSX.Element => (
  <>
    <HomeHeader />
    <SearchLangingContainer>
      <HomeTitleHeading>Spotect</HomeTitleHeading>
      <HomeSubheading>
        Browse metadata and harmonic data for millions of songs on Spotify.
      </HomeSubheading>
      <SearchBarGridDiv>
        <SearchBarDiv>
          <SearchBar />
        </SearchBarDiv>
      </SearchBarGridDiv>
    </SearchLangingContainer>
  </>
);

export default Home;
