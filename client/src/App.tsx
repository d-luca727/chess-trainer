import { Route, Routes } from "react-router-dom";

import NavBar from "./components/navbar/NavBar";

import Collections from "./components/Collections";
import AddStudy from "./components/forms/AddStudy";
import AddFens from "./components/forms/AddFens";
import EditFens from "./components/forms/EditFens";
import StudyId from "./components/study/StudyId";
import Play from "./components/study/Play";
import About from "./components/About";
import Home from "./components/Home";

function App() {
  return (
    <>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Collections />} />
          <Route path="/about" element={<About />} />
          form stuff
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
