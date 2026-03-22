import Navbar from "../components/Navbar"

export default function Overview() {
  return (
    <>
      <Navbar />
      <div style={container}>
        <h2>Overview</h2>
        <p>Coming soon...</p>
      </div>
    </>
  )
}

const container = {
  padding: "40px"
}