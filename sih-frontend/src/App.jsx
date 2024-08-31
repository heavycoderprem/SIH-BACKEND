
import { Route, Routes } from "react-router-dom";
import "./global.css";
import SignInForm from "./_auth/forms/SignInForm";
import SignUpForm from "./_auth/forms/SignUpForm";
import RootLayout from "./_root/RootLayout";
import Home from "./_root/pages/Home";
import AuthLayout from "./_auth/AuthLayout";
import DashBoard from "./_root/pages/DashBoard";



function App() {
 
  return (
     <main>
      <Routes>
        <Route element={<AuthLayout/>}>
          <Route path="/sign-in" element={<SignInForm/>}/>
          <Route path="/sign-up" element={<SignUpForm/>}/>
        </Route>

        <Route element={<RootLayout/>}>
           <Route index element={<DashBoard/>}/>
           <Route path="/sheet/:id" element={<Home/>}/>

        </Route>
      </Routes>
     </main>
  )
}

export default App
