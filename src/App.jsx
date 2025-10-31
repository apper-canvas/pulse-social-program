import { Outlet } from "react-router-dom"
import { ToastContainer } from "react-toastify"

function App() {
  return (
    <>
      <Outlet />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-[9999]"
      />
    </>
  )
}

export default App