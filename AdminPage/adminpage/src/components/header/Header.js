import React from 'react'
import '../header/header.css'
import screen from '../../assets/screen.png'
import { useNavigate } from "react-router-dom";
export default function Header() {
  const navigate = useNavigate();
  const logout = () =>{
    navigate('/')
  }
  return (
    <div> 
    <header className="header">
      <div className="thinh">
      <button className="sidebar-toggle" >
        <i className="fas fa-bars"></i>
      </button>
      <div><img src={screen} alt="" className="classroom-photo" style={{width:"50px"}}/>
      </div>
      <div className="lop-hoc">
         <h2>Quản Lý Hệ Thống Lớp Học </h2> 
         {/* {selectedClass.className && <div className="ten-lop-hoc">
          <span></span>
          <h2>&gt; {selectedClass.className}</h2>
          </div>} */}
      </div>
      </div>



      <div className="header-content">
        <nav className="nav">
          <ul className="ul">
            <li>
              {/* <Modal isOpen={isModalOpen} onClose={closeModal} /> */}
            </li>
    
              <div className="add-classroom" >
                  {/* <a href="#" role="button" onClick={openAddClassModal}><FontAwesomeIcon icon={faPlus} /></a> */}
                  <button className="header-button" onClick={logout}>
                    Logout
                  </button> 
              </div> 

              {/* <a href="#" role="button" onClick={openModal}>
                <img className="photo" src={user.photoURL} alt="" />
              </a> */}
          </ul>
        </nav>
      </div>
    </header>
           {/* <AddClassModal isOpen={isOpenAddClassModal} onClose={closeAddClassModal}/>  */}
    </div>
  )
}
