import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import styled from "styled-components";
import Board from "./components/Board";
import Collections from "./components/Collections";
function Index() {
  return <h2>prova</h2>;
}

function About() {
  return <h2>about me</h2>;
}

function App() {
  return (
    <>
      <NavBar />

      <Styles.Wrapper>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/play" element={<Collections />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Styles.Wrapper>
    </>
  );
}

const Styles = {
  Wrapper: styled.main`
    display: flex;
    background-color: #eeeeee;
    height: 100vh;
  `,
};
export default App;
