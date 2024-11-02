import React from 'react'
import '../sidebar/sidebar.css'
export default function Sidebar() {
  return (
    <div  className='sidebar'>
    <div className="sidebar-header">
    </div>
    <div className="sidebar-content">
      <ul className="nav-links">
        <li >
          {/* <Link to="#"  onClick={setClassEmpty}>
          <FontAwesomeIcon icon={faHome} className='icon'/> */}
          {/* { !isOpen && <div>Màn hình chính</div> } */}
          <div className='sidebar-text' >Màn hình chính</div>
          {/* </Link> */}
        </li>
        <li >
          {/* <Link to="#" >
          <FontAwesomeIcon icon={faChalkboard} className='icon'/> */}
          <div className='sidebar-text'>Lớp Học</div>
          {/* { !isOpen && <div><FontAwesomeIcon icon={faChalkboard} className='icon'/>Lớp Học</div> } */}
          {/* </Link> */}
        </li>

        <li>
          {/* <Link to="#" >
          <FontAwesomeIcon icon={faCog} className='icon'/> */}
          <div className='sidebar-text'>Cài đặt</div>
          {/* { !isOpen && <div><FontAwesomeIcon icon={faCog} className='icon'/>Cài đặt</div> } */}
          {/* </Link> */}
        </li>
        {/* Add more navigation links as needed */}
      </ul>
    </div>
  </div>
  )
}
