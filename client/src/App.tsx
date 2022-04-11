import { Route, Routes } from "react-router-dom";
import NavBar from "./components/navbar/NavBar";

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
      <div
      /*  style={{
          backgroundColor: "#eeeeee",
          height: "100vh",
        }} */
      >
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
      </div>
    </>
  );
}

export default App;
