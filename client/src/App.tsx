import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import styled from "styled-components";

import Collections from "./components/Collections";

import AddStudy from "./components/forms/AddStudy";
import AddFens from "./components/forms/AddFens";
import EditFens from "./components/forms/EditFens";
import StudyId from "./components/study/StudyId";
import Play from "./components/study/Play";
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
          {/* form stuff */}
          <Route path="/add-study" element={<AddStudy />} />
          <Route path="/add-study/fens" element={<AddFens />} />
          <Route path="/add-study/fens/:fenId" element={<EditFens />} />

          <Route path="/study/:fenId" element={<StudyId />} />
          <Route path="/study/:fenId/play" element={<Play />} />
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
