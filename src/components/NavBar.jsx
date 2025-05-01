import "./NavBar.css"

function NavBar() {
  return (
    <>
      <ul className="nav-list">
        <li>
          <img
            src="/pictures/waldo-avatar.jpg"
            alt="Waldo-avatar"
            className="Waldo-avatar"
          />
        </li>
        <li>
          <h1>Where's Waldo?</h1>
        </li>
        <li>
          <a href="https://github.com/andreaamasio">
            <img src="/pictures/github-60.svg" alt="Github-link" />
          </a>
        </li>
      </ul>
    </>
  )
}

export default NavBar
