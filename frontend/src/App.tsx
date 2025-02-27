import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes.tsx";
import getUser from "./utils/GetUser.tsx";

function App() {
  getUser();

  return (
    <>
      <Router>
        <AppRoutes />
      </Router>
    </>
  );
}

export default App;
